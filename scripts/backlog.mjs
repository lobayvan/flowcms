#!/usr/bin/env node
/**
 * Outil de suivi du backlog FlowCMS (source de vérité : backlog/backlog.json).
 *
 *   node scripts/backlog.mjs validate
 *   node scripts/backlog.mjs status [--sprint N]
 *   node scripts/backlog.mjs render
 *   node scripts/backlog.mjs move <ID> <statut> [--note "…"] [--check 0,2|all] [--by <nom>]
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const FILE = path.join(ROOT, 'backlog/backlog.json')
const SPRINT_DIR = path.join(ROOT, 'docs/sprints')
const STATUSES = ['backlog', 'ready', 'in-progress', 'review', 'done']
const ICON = { backlog: '⚪', ready: '🔵', 'in-progress': '🟡', review: '🟣', done: '🟢' }
// Transitions autorisées (le passage à done exige tous les critères cochés)
const TRANSITIONS = {
  backlog: ['ready'],
  ready: ['in-progress', 'backlog'],
  'in-progress': ['review', 'ready'],
  review: ['done', 'in-progress'],
  done: ['in-progress'],
}

const load = () => JSON.parse(fs.readFileSync(FILE, 'utf8'))
const save = (b) => fs.writeFileSync(FILE, JSON.stringify(b, null, 2) + '\n')
const args = process.argv.slice(2)
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined }
const pad = (n) => String(n).padStart(2, '0')
const who = () => opt('by') ?? (() => { try { return execSync('git config user.name').toString().trim() } catch { return 'inconnu' } })()

// ---------------------------------------------------------------- validate
function validate(b) {
  const errors = []
  const ids = new Set()
  const epics = new Set(b.epics.map((e) => e.id))
  const sprints = new Map(b.sprints.map((s) => [s.id, s]))
  const byId = new Map(b.stories.map((s) => [s.id, s]))

  for (const s of b.stories) {
    const at = `${s.id}`
    if (!/^US-\d{3}$/.test(s.id)) errors.push(`${at} : identifiant invalide`)
    if (ids.has(s.id)) errors.push(`${at} : identifiant en double`)
    ids.add(s.id)
    if (!epics.has(s.epic)) errors.push(`${at} : epic inconnu ${s.epic}`)
    if (s.sprint != null && !sprints.has(s.sprint)) errors.push(`${at} : sprint inconnu ${s.sprint}`)
    if (!STATUSES.includes(s.status)) errors.push(`${at} : statut inconnu ${s.status}`)
    if (![1, 2, 3, 5, 8].includes(s.points)) errors.push(`${at} : points hors échelle (1,2,3,5,8)`)
    if (!/^En tant qu(e |')/.test(s.story ?? '')) errors.push(`${at} : la story doit commencer par « En tant que »`)
    if (!Array.isArray(s.acceptance) || s.acceptance.length < 2) errors.push(`${at} : au moins 2 critères d'acceptation`)
    if ((s.checked ?? []).some((i) => i < 0 || i >= s.acceptance.length)) errors.push(`${at} : index de critère coché invalide`)
    if (s.status === 'done' && (s.checked ?? []).length !== s.acceptance.length) errors.push(`${at} : done sans tous les critères cochés`)
    if (s.labels?.includes('ux') && !s.journey && s.status !== 'backlog')
      errors.push(`${at} : story ux sans parcours (journey) ne peut pas être ${s.status}`)
    for (const d of s.dependsOn ?? []) {
      const dep = byId.get(d)
      if (!dep) { errors.push(`${at} : dépendance inconnue ${d}`); continue }
      if (dep.sprint != null && s.sprint != null && dep.sprint > s.sprint)
        errors.push(`${at} : dépend de ${d} planifiée dans un sprint ultérieur (${dep.sprint} > ${s.sprint})`)
      if (['in-progress', 'review', 'done'].includes(s.status) && dep.status !== 'done' && dep.sprint !== s.sprint)
        errors.push(`${at} : démarrée alors que ${d} n'est pas terminée`)
    }
  }
  // Cycles de dépendances
  const visiting = new Set(), visited = new Set()
  const dfs = (id, trail) => {
    if (visiting.has(id)) { errors.push(`Cycle de dépendances : ${[...trail, id].join(' → ')}`); return }
    if (visited.has(id)) return
    visiting.add(id)
    for (const d of byId.get(id)?.dependsOn ?? []) dfs(d, [...trail, id])
    visiting.delete(id); visited.add(id)
  }
  for (const s of b.stories) dfs(s.id, [])
  // Capacité
  for (const sp of b.sprints) {
    const pts = b.stories.filter((s) => s.sprint === sp.id).reduce((a, s) => a + s.points, 0)
    if (pts > (sp.capacity ?? b.capacityDefault)) errors.push(`Sprint ${sp.id} : ${pts} points > capacité ${sp.capacity ?? b.capacityDefault}`)
  }
  return errors
}

// ---------------------------------------------------------------- status
function currentSprint(b) {
  const today = new Date().toISOString().slice(0, 10)
  return b.sprints.find((s) => s.start <= today && today <= s.end) ??
    b.sprints.find((s) => b.stories.some((x) => x.sprint === s.id && x.status !== 'done')) ?? b.sprints.at(-1)
}

function status(b) {
  const sp = opt('sprint') != null ? b.sprints.find((s) => s.id === Number(opt('sprint'))) : currentSprint(b)
  const stories = b.stories.filter((s) => s.sprint === sp.id)
  const pts = (f) => stories.filter(f).reduce((a, s) => a + s.points, 0)
  const total = pts(() => true), done = pts((s) => s.status === 'done')
  const bar = '█'.repeat(Math.round((done / (total || 1)) * 20)).padEnd(20, '░')
  console.log(`\n${sp.name}  (${sp.start} → ${sp.end})`)
  console.log(`Objectif : ${sp.goal}`)
  console.log(`Avancement : ${bar} ${done}/${total} points\n`)
  for (const st of STATUSES) {
    const list = stories.filter((s) => s.status === st)
    if (!list.length) continue
    console.log(`${ICON[st]} ${st} (${list.length})`)
    for (const s of list) console.log(`   ${s.id}  ${String(s.points).padStart(2)} pts  ${s.title}  [${(s.checked ?? []).length}/${s.acceptance.length}]`)
  }
  const all = b.stories.reduce((a, s) => a + s.points, 0)
  const allDone = b.stories.filter((s) => s.status === 'done').reduce((a, s) => a + s.points, 0)
  console.log(`\nProjet : ${allDone}/${all} points terminés (${Math.round((allDone / all) * 100)} %)\n`)
}

// ---------------------------------------------------------------- move
function move(b) {
  const [, id, to] = args
  const s = b.stories.find((x) => x.id === id)
  if (!s) fail(`Story ${id} introuvable`)
  if (!STATUSES.includes(to)) fail(`Statut inconnu : ${to} (attendu : ${STATUSES.join(', ')})`)
  if (!TRANSITIONS[s.status].includes(to)) fail(`Transition interdite : ${s.status} → ${to} (autorisées : ${TRANSITIONS[s.status].join(', ')})`)
  const check = opt('check')
  if (check) {
    const idx = check === 'all' ? s.acceptance.map((_, i) => i) : check.split(',').map(Number)
    s.checked = [...new Set([...(s.checked ?? []), ...idx])].sort((a, c) => a - c)
  }
  if (to === 'done' && s.checked.length !== s.acceptance.length) {
    const missing = s.acceptance.filter((_, i) => !s.checked.includes(i))
    fail(`Impossible de passer ${id} en done, critères non validés :\n - ${missing.join('\n - ')}`)
  }
  if (to === 'in-progress' && s.status === 'done') s.checked = []
  s.history = [...(s.history ?? []), { at: new Date().toISOString(), from: s.status, to, by: who(), ...(opt('note') && { note: opt('note') }) }]
  s.status = to
  const errors = validate(b)
  if (errors.length) fail(`Le backlog deviendrait incohérent :\n - ${errors.join('\n - ')}`)
  save(b)
  render(b, true)
  console.log(`${ICON[to]} ${id} → ${to}`)
}

// ---------------------------------------------------------------- render
const BEGIN = '<!-- BEGIN:GENERATED (pnpm backlog:sprints) — ne pas éditer -->'
const END = '<!-- END:GENERATED -->'

function sprintMarkdown(b, sp) {
  const stories = b.stories.filter((s) => s.sprint === sp.id)
  const total = stories.reduce((a, s) => a + s.points, 0)
  const done = stories.filter((s) => s.status === 'done').reduce((a, s) => a + s.points, 0)
  const epic = (id) => b.epics.find((e) => e.id === id)?.title
  let md = `## Objectif\n\n${sp.goal}\n\n`
  md += `**Dates** : ${sp.start} → ${sp.end} · **Capacité** : ${sp.capacity} pts · **Engagé** : ${total} pts · **Terminé** : ${done} pts\n\n`
  md += `| | ID | Story | Epic | Pts | Labels | Critères | Dépend de |\n|---|---|---|---|--:|---|:-:|---|\n`
  for (const s of stories)
    md += `| ${ICON[s.status]} | ${s.id} | ${s.title} | ${epic(s.epic)} | ${s.points} | ${s.labels.join(', ')} | ${(s.checked ?? []).length}/${s.acceptance.length} | ${(s.dependsOn ?? []).join(', ') || '—'} |\n`
  md += `\n## Détail des stories\n`
  for (const s of stories) {
    md += `\n### ${s.id} — ${s.title}\n\n${s.story}${s.journey ? ` *(parcours ${s.journey})*` : ''}\n\n`
    s.acceptance.forEach((a, i) => { md += `- [${(s.checked ?? []).includes(i) ? 'x' : ' '}] ${a}\n` })
    const last = (s.history ?? []).at(-1)
    if (last) md += `\n_Dernier mouvement : ${last.from} → ${last.to} par ${last.by} le ${last.at.slice(0, 10)}${last.note ? ` — ${last.note}` : ''}_\n`
  }
  return md
}

function render(b, quiet = false) {
  fs.mkdirSync(SPRINT_DIR, { recursive: true })
  for (const sp of b.sprints) {
    const f = path.join(SPRINT_DIR, `sprint-${pad(sp.id)}.md`)
    const generated = `${BEGIN}\n${sprintMarkdown(b, sp)}${END}`
    let content
    if (fs.existsSync(f)) {
      const cur = fs.readFileSync(f, 'utf8')
      const a = cur.indexOf(BEGIN), z = cur.indexOf(END, a)
      content = a >= 0 && z > a ? cur.slice(0, a) + generated + cur.slice(z + END.length) : `${cur}\n${generated}\n`
    } else {
      content = `# ${sp.name}\n\n${generated}\n\n## Revue\n\n_À compléter en fin de sprint (/sprint-review)._\n\n## Rétrospective\n\n_À compléter en fin de sprint._\n`
    }
    fs.writeFileSync(f, content)
  }
  // Feuille de route
  let rm = `# Feuille de route\n\n${BEGIN}\n\`\`\`mermaid\ngantt\n  dateFormat YYYY-MM-DD\n  axisFormat %d/%m\n`
  for (const sp of b.sprints) {
    const st = b.stories.filter((s) => s.sprint === sp.id)
    const state = st.length && st.every((s) => s.status === 'done') ? 'done, ' : st.some((s) => s.status !== 'backlog' && s.status !== 'ready') ? 'active, ' : ''
    rm += `  section S${sp.id}\n  ${sp.name.replace(/^Sprint \d+ — /, '')} :${state}s${sp.id}, ${sp.start}, ${sp.end}\n`
  }
  rm += '```\n\n| Sprint | Dates | Objectif | Pts | Avancement |\n|---|---|---|--:|---|\n'
  for (const sp of b.sprints) {
    const st = b.stories.filter((s) => s.sprint === sp.id)
    const t = st.reduce((a, s) => a + s.points, 0), d = st.filter((s) => s.status === 'done').reduce((a, s) => a + s.points, 0)
    rm += `| [${sp.name}](sprint-${pad(sp.id)}.md) | ${sp.start} → ${sp.end} | ${sp.goal} | ${t} | ${d}/${t} |\n`
  }
  rm += `\n## Epics\n\n| Epic | Description | Stories | Pts |\n|---|---|--:|--:|\n`
  for (const e of b.epics) {
    const st = b.stories.filter((s) => s.epic === e.id)
    rm += `| ${e.id} — ${e.title} | ${e.description} | ${st.length} | ${st.reduce((a, s) => a + s.points, 0)} |\n`
  }
  rm += `${END}\n`
  fs.writeFileSync(path.join(SPRINT_DIR, 'roadmap.md'), rm)
  if (!quiet) console.log(`✔ ${b.sprints.length} pages de sprint et roadmap.md générées dans docs/sprints/`)
}

function fail(msg) { console.error(`✖ ${msg}`); process.exit(1) }

// ---------------------------------------------------------------- main
const b = load()
switch (args[0]) {
  case 'validate': {
    const e = validate(b)
    if (e.length) fail(`${e.length} problème(s) :\n - ${e.join('\n - ')}`)
    console.log(`✔ Backlog valide : ${b.stories.length} stories, ${b.epics.length} epics, ${b.sprints.length} sprints`)
    break
  }
  case 'status': status(b); break
  case 'render': render(b); break
  case 'move': move(b); break
  default: fail('Commande attendue : validate | status | render | move')
}
