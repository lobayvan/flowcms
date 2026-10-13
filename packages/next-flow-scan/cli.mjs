#!/usr/bin/env node
/**
 * next-flow-scan — reconstitue le flow (pages, composants, liens) d'un projet Next.js.
 *
 * Usage :
 *   node next-flow-scan.mjs <dossier-projet> [--out flow.json] [--site <id>]
 *                           [--push <url-cms>] [--api-key <clé>]
 *
 * Détecte :
 *   - les routes App Router (app/…/page.tsx) et Pages Router (pages/…)
 *   - les layouts (app/…/layout.tsx) et leur rattachement aux pages
 *   - l'arbre des composants locaux utilisés par chaque page (imports résolus)
 *   - les liens : <Link href>, <a href>, router.push/replace, redirect(), permanentRedirect()
 *   - les redirections déclarées dans next.config (si le fichier est importable)
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { Project, SyntaxKind, Node } from 'ts-morph'

// ---------- Arguments ----------
const argv = process.argv.slice(2)
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : def
}
const root = path.resolve(argv.find((a) => !a.startsWith('--') && !argv[argv.indexOf(a) - 1]?.startsWith('--')) ?? '.')
const outFile = opt('out', 'flow.json')
const siteId = opt('site', path.basename(root))
const pushUrl = opt('push')
const apiKey = opt('api-key', process.env.CMS_API_KEY)

const EXT = ['.tsx', '.ts', '.jsx', '.js', '.mdx']
const rel = (f) => path.relative(root, f).split(path.sep).join('/')
const firstDir = (...c) => c.map((d) => path.join(root, d)).find((d) => fs.existsSync(d))

// ---------- 1. Routes ----------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    e.isDirectory() ? walk(p, out) : out.push(p)
  }
  return out
}

function appRoutes(appDir) {
  const files = walk(appDir)
  const pages = [], layouts = []
  for (const f of files) {
    const base = path.basename(f, path.extname(f))
    if (!EXT.includes(path.extname(f))) continue
    const segs = path.relative(appDir, path.dirname(f)).split(path.sep).filter(Boolean)
    if (segs.some((s) => s.startsWith('_'))) continue // dossiers privés
    const urlSegs = segs.filter((s) => !/^\(.*\)$/.test(s) && !s.startsWith('@')) // groupes, slots parallèles
    if (urlSegs.some((s) => s.startsWith('(.'))) continue // routes interceptées
    const route = '/' + urlSegs.join('/')
    if (base === 'page') pages.push({ file: f, route, dir: path.dirname(f) })
    if (base === 'layout') layouts.push({ file: f, dir: path.dirname(f) })
  }
  return { pages, layouts }
}

function pagesRoutes(pagesDir) {
  return walk(pagesDir)
    .filter((f) => EXT.includes(path.extname(f)))
    .map((f) => {
      const r = rel(f).replace(/^(src\/)?pages/, '').replace(/\.(tsx|ts|jsx|js|mdx)$/, '')
      return { file: f, route: r.replace(/\/index$/, '') || '/' }
    })
    .filter((p) => !/^\/(_app|_document|_error|api)(\/|$)/.test(p.route))
}

// Motif de route → RegExp ([id], [...slug], [[...slug]])
function routeRegex(route) {
  const body = route
    .split('/').filter(Boolean)
    .map((s) => {
      if (/^\[\[\.\.\..+\]\]$/.test(s)) return '(?:/.*)?'
      if (/^\[\.\.\..+\]$/.test(s)) return '/.+'
      if (/^\[.+\]$/.test(s)) return '/[^/]+'
      return '/' + s.replace(/[.*+?^${}()|\\]/g, '\\$&')
    })
    .join('')
  return new RegExp(`^${body || '/'}/?$`)
}

// ---------- 2. Analyse du code ----------
const tsconfig = ['tsconfig.json', 'jsconfig.json'].map((f) => path.join(root, f)).find(fs.existsSync)
const project = new Project({
  tsConfigFilePath: tsconfig,
  skipAddingFilesFromTsConfig: true,
  compilerOptions: tsconfig ? undefined : { allowJs: true, jsx: 4 },
})

const nodes = new Map()
const edges = new Map()
const warnings = []
const addNode = (n) => nodes.has(n.id) || nodes.set(n.id, n)
const addEdge = (e) => {
  const id = `${e.kind}:${e.source}->${e.target}${e.via ? '@' + e.via : ''}`
  edges.has(id) || edges.set(id, { id, ...e })
}

/** Extrait une URL depuis une expression : '...', `...${x}...`, { pathname: '...' } */
function hrefFrom(expr) {
  if (!expr) return null
  if (Node.isJsxExpression(expr)) expr = expr.getExpression()
  if (!expr) return null
  if (Node.isStringLiteral(expr) || Node.isNoSubstitutionTemplateLiteral(expr)) return { href: expr.getLiteralText(), dynamic: false }
  if (Node.isTemplateExpression(expr)) {
    let s = expr.getHead().getLiteralText()
    for (const span of expr.getTemplateSpans()) s += '__dyn__' + span.getLiteral().getLiteralText()
    return { href: s, dynamic: true }
  }
  if (Node.isObjectLiteralExpression(expr)) {
    const p = expr.getProperty('pathname')
    if (p && Node.isPropertyAssignment(p)) return hrefFrom(p.getInitializer())
  }
  return { href: null, dynamic: true, raw: expr.getText().slice(0, 60) }
}

/** Liens présents dans un fichier source */
function linksIn(sf) {
  const found = []
  const jsx = [...sf.getDescendantsOfKind(SyntaxKind.JsxOpeningElement), ...sf.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)]
  for (const el of jsx) {
    const tag = el.getTagNameNode().getText()
    if (tag !== 'Link' && tag !== 'a') continue
    const attr = el.getAttribute('href')
    if (attr && Node.isJsxAttribute(attr)) found.push({ ...hrefFrom(attr.getInitializer()), via: tag === 'Link' ? 'Link' : 'a', line: el.getStartLineNumber() })
  }
  for (const call of sf.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const callee = call.getExpression().getText()
    if (/(^|\.)(push|replace)$/.test(callee) && /router/i.test(callee) || /^(redirect|permanentRedirect)$/.test(callee)) {
      found.push({ ...hrefFrom(call.getArguments()[0]), via: callee, line: call.getStartLineNumber() })
    }
  }
  return found
}

/** Composants locaux importés et utilisés en JSX dans un fichier */
function childComponents(sf) {
  const used = new Set(
    [...sf.getDescendantsOfKind(SyntaxKind.JsxOpeningElement), ...sf.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)]
      .map((el) => el.getTagNameNode().getText().split('.')[0])
      .filter((t) => /^[A-Z]/.test(t)),
  )
  const out = []
  for (const imp of sf.getImportDeclarations()) {
    const target = imp.getModuleSpecifierSourceFile()
    if (!target || target.getFilePath().includes('/node_modules/')) continue
    const names = [imp.getDefaultImport()?.getText(), ...imp.getNamedImports().map((n) => n.getAliasNode()?.getText() ?? n.getName())].filter(Boolean)
    for (const name of names) if (used.has(name)) out.push({ name, file: target.getFilePath() })
  }
  return out
}

const fileCache = new Map()
const load = (f) => {
  if (!fileCache.has(f)) fileCache.set(f, project.getSourceFile(f) ?? project.addSourceFileAtPath(f))
  return fileCache.get(f)
}

/** Parcourt récursivement l'arbre de composants depuis un fichier ; renvoie les liens rencontrés. */
function visit(parentId, file, seen = new Set()) {
  if (seen.has(file)) return []
  seen.add(file)
  let sf
  try { sf = load(file) } catch (e) { warnings.push(`Lecture impossible : ${rel(file)}`); return [] }
  const links = linksIn(sf).map((l) => ({ ...l, from: parentId, file: rel(file) }))
  for (const c of childComponents(sf)) {
    const id = `component:${rel(c.file)}#${c.name}`
    addNode({ id, kind: 'component', name: c.name, file: rel(c.file) })
    addEdge({ source: parentId, target: id, kind: 'contains' })
    links.push(...visit(id, c.file, seen))
  }
  return links
}

// ---------- 3. Construction du graphe ----------
const appDir = firstDir('app', 'src/app')
const pagesDir = firstDir('pages', 'src/pages')
const { pages: appPages, layouts } = appDir ? appRoutes(appDir) : { pages: [], layouts: [] }
const allPages = [...appPages, ...(pagesDir ? pagesRoutes(pagesDir) : [])]
if (!allPages.length) { console.error('Aucune page trouvée (app/ ou pages/).'); process.exit(1) }

const routes = allPages.map((p) => ({ ...p, id: `page:${p.route}`, re: routeRegex(p.route) }))
const matchRoute = (href) => routes.find((r) => r.re.test(href)) ??
  routes.find((r) => r.re.test(href.replace(/__dyn__/g, 'x')))

const allLinks = []
for (const l of layouts) {
  const id = `layout:${rel(l.file)}`
  addNode({ id, kind: 'layout', name: path.basename(path.dirname(l.file)) || 'root', file: rel(l.file) })
  allLinks.push(...visit(id, l.file))
}
for (const r of routes) {
  addNode({ id: r.id, kind: 'page', route: r.route, dynamic: r.route.includes('['), file: rel(r.file) })
  for (const l of layouts) if ((r.dir + path.sep).startsWith(l.dir + path.sep)) addEdge({ source: `layout:${rel(l.file)}`, target: r.id, kind: 'layout' })
  allLinks.push(...visit(r.id, r.file))
}

// Rattache chaque lien à sa (ses) page(s) source(s) : un composant partagé propage ses liens.
const parentsOf = (id) => [...edges.values()].filter((e) => e.target === id && (e.kind === 'contains' || e.kind === 'layout')).map((e) => e.source)
function owningPages(id, seen = new Set()) {
  if (seen.has(id)) return []
  seen.add(id)
  if (id.startsWith('page:')) return [id]
  // Un layout « possède » toutes les pages qu'il enveloppe
  if (id.startsWith('layout:')) return [...edges.values()].filter((e) => e.kind === 'layout' && e.source === id).map((e) => e.target)
  return parentsOf(id).flatMap((p) => owningPages(p, seen))
}

function isGlobal(id, seen = new Set()) {
  if (id.startsWith('layout:')) return true
  if (seen.has(id) || id.startsWith('page:')) return false
  seen.add(id)
  return parentsOf(id).some((p) => isGlobal(p, seen))
}

for (const l of allLinks) {
  if (!l.href) { warnings.push(`Lien non résolu (${l.via}) dans ${l.file}:${l.line} → ${l.raw}`); continue }
  if (/^(https?:|mailto:|tel:|#)/.test(l.href)) continue
  const clean = l.href.split(/[?#]/)[0] || '/'
  const target = matchRoute(clean)
  if (!target) { warnings.push(`Lien cassé ${l.href} dans ${l.file}:${l.line}`); continue }
  // « global » = lien porté par un layout (header, footer…) : affiché replié dans le CMS
  const scope = isGlobal(l.from) ? 'global' : 'local'
  for (const src of owningPages(l.from)) {
    if (src === target.id) continue
    addEdge({ source: src, target: target.id, kind: 'navigation', via: l.from, trigger: l.via, dynamic: l.dynamic, scope, locked: true })
  }
}

// Redirections de next.config
for (const name of ['next.config.mjs', 'next.config.js']) {
  const f = path.join(root, name)
  if (!fs.existsSync(f)) continue
  try {
    const cfg = (await import(pathToFileURL(f).href)).default
    const resolved = typeof cfg === 'function' ? await cfg('phase-production-build', {}) : cfg
    for (const r of (await resolved?.redirects?.()) ?? []) {
      const s = matchRoute(r.source.replace(/:\w+\*?/g, 'x')), t = matchRoute(r.destination.replace(/:\w+\*?/g, 'x'))
      if (t) addEdge({ source: s?.id ?? `redirect:${r.source}`, target: t.id, kind: 'redirect', permanent: !!r.permanent, locked: true })
    }
  } catch { warnings.push(`${name} non importable : redirections ignorées`) }
}

// Pages orphelines (aucun lien entrant, hors accueil)
const incoming = new Set([...edges.values()].filter((e) => e.kind === 'navigation').map((e) => e.target))
for (const n of nodes.values()) if (n.kind === 'page' && n.route !== '/' && !incoming.has(n.id)) n.orphan = true

// Positions initiales : profondeur de navigation depuis "/" (le CMS affinera avec ELK)
const depth = new Map([['page:/', 0]]), queue = ['page:/']
while (queue.length) {
  const cur = queue.shift()
  for (const e of edges.values()) if (e.kind === 'navigation' && e.source === cur && !depth.has(e.target)) { depth.set(e.target, depth.get(cur) + 1); queue.push(e.target) }
}
const perLevel = {}
for (const n of nodes.values()) if (n.kind === 'page') {
  const d = depth.get(n.id) ?? -1
  perLevel[d] = (perLevel[d] ?? 0) + 1
  n.position = { x: (d < 0 ? 0 : d) * 320, y: perLevel[d] * 140 + (d < 0 ? 1200 : 0) }
}

// ---------- 4. Sortie ----------
const flow = {
  schema: 'next-flow/1', site: siteId, generatedAt: new Date().toISOString(),
  stats: {
    pages: [...nodes.values()].filter((n) => n.kind === 'page').length,
    components: [...nodes.values()].filter((n) => n.kind === 'component').length,
    navigationEdges: [...edges.values()].filter((e) => e.kind === 'navigation').length,
  },
  nodes: [...nodes.values()], edges: [...edges.values()], warnings: [...new Set(warnings)],
}
fs.writeFileSync(outFile, JSON.stringify(flow, null, 2))
console.log(`✔ ${flow.stats.pages} pages, ${flow.stats.components} composants, ${flow.stats.navigationEdges} liens → ${outFile}`)
if (flow.warnings.length) console.log(`⚠ ${flow.warnings.length} avertissement(s), voir "warnings" dans ${outFile}`)

if (pushUrl) {
  const res = await fetch(`${pushUrl.replace(/\/$/, '')}/api/flow/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(apiKey && { Authorization: `users API-Key ${apiKey}` }) },
    body: JSON.stringify(flow),
  })
  console.log(res.ok ? '✔ Flow envoyé au CMS' : `✖ Envoi refusé (${res.status})`)
  if (!res.ok) process.exit(1)
}
