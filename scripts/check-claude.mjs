#!/usr/bin/env node
/** Valide les skills, agents et commandes de .claude/ (exécuté en CI). */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const C = path.join(ROOT, '.claude')
const errors = []

function frontmatter(file) {
  const txt = fs.readFileSync(file, 'utf8')
  const m = txt.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) { errors.push(`${rel(file)} : frontmatter YAML manquant`); return null }
  const fm = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/)
    if (kv) fm[kv[1]] = kv[2].trim()
  }
  return { fm, body: m[2] }
}
const rel = (f) => path.relative(ROOT, f)

// Skills
const skills = fs.readdirSync(path.join(C, 'skills'))
for (const dir of skills) {
  const f = path.join(C, 'skills', dir, 'SKILL.md')
  if (!fs.existsSync(f)) { errors.push(`skills/${dir} : SKILL.md manquant`); continue }
  const r = frontmatter(f); if (!r) continue
  if (r.fm.name !== dir) errors.push(`${rel(f)} : name (${r.fm.name}) ≠ dossier (${dir})`)
  if (!/^[a-z0-9-]{1,64}$/.test(r.fm.name ?? '')) errors.push(`${rel(f)} : name invalide (kebab-case, ≤ 64)`)
  if (!r.fm.description || r.fm.description.length < 40) errors.push(`${rel(f)} : description absente ou trop courte`)
  if ((r.fm.description ?? '').length > 1024) errors.push(`${rel(f)} : description > 1024 caractères`)
  if (!/## Documentation/.test(r.body)) errors.push(`${rel(f)} : section « Documentation » manquante`)
  // Les chemins docs/… cités doivent exister
  for (const [, p] of r.body.matchAll(/`((?:docs|apps|packages|backlog)\/[\w./-]+\.(?:md|json))`/g))
    if (!fs.existsSync(path.join(ROOT, p))) errors.push(`${rel(f)} : référence introuvable ${p}`)
}

// Agents
const TOOLS = ['Read', 'Grep', 'Glob', 'Edit', 'Write', 'Bash', 'WebFetch', 'WebSearch']
const agents = fs.readdirSync(path.join(C, 'agents')).filter((f) => f.endsWith('.md'))
for (const file of agents) {
  const f = path.join(C, 'agents', file)
  const r = frontmatter(f); if (!r) continue
  if (r.fm.name !== file.replace(/\.md$/, '')) errors.push(`${rel(f)} : name ≠ nom de fichier`)
  if (!r.fm.description) errors.push(`${rel(f)} : description manquante`)
  for (const t of (r.fm.tools ?? '').split(',').map((s) => s.trim()).filter(Boolean))
    if (!TOOLS.includes(t)) errors.push(`${rel(f)} : outil inconnu ${t}`)
  for (const [, s] of r.body.matchAll(/skills? `([a-z0-9-]+)`/g))
    if (!skills.includes(s)) errors.push(`${rel(f)} : skill inconnue ${s}`)
}

// Commandes : les agents cités existent
const agentNames = agents.map((a) => a.replace(/\.md$/, ''))
for (const file of fs.readdirSync(path.join(C, 'commands'))) {
  const f = path.join(C, 'commands', file)
  const r = frontmatter(f); if (!r) continue
  if (!r.fm.description) errors.push(`${rel(f)} : description manquante`)
  for (const [, a] of r.body.matchAll(/agent `([a-z-]+)`/g))
    if (!agentNames.includes(a)) errors.push(`${rel(f)} : agent inconnu ${a}`)
}

if (errors.length) { console.error(`✖ ${errors.length} problème(s) :\n - ${errors.join('\n - ')}`); process.exit(1) }
console.log(`✔ .claude valide : ${skills.length} skills, ${agents.length} agents, ${fs.readdirSync(path.join(C, 'commands')).length} commandes`)
