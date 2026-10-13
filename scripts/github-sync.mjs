#!/usr/bin/env node
/**
 * Synchronise le backlog vers GitHub (idempotent) : labels, milestones (sprints), issues (stories).
 *   node scripts/github-sync.mjs <owner/repo> [--dry-run]
 * Prérequis : gh authentifié (gh auth login) avec les droits repo.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const repo = process.argv[2]
const dry = process.argv.includes('--dry-run')
if (!repo?.includes('/')) { console.error('Usage : node scripts/github-sync.mjs <owner/repo> [--dry-run]'); process.exit(1) }
const b = JSON.parse(fs.readFileSync(path.join(ROOT, 'backlog/backlog.json'), 'utf8'))

const gh = (args, input) => {
  if (dry && !['GET'].includes(args[args.indexOf('--method') + 1] ?? 'GET') ) { console.log('  [dry-run] gh', args.join(' ')); return '{}' }
  return execFileSync('gh', args, { encoding: 'utf8', input, stdio: ['pipe', 'pipe', 'inherit'] })
}
const api = (method, route, body) =>
  JSON.parse(gh(['api', '--method', method, `repos/${repo}/${route}`, ...(body ? ['--input', '-'] : [])], body && JSON.stringify(body)) || '{}')
const list = (route) => JSON.parse(gh(['api', '--paginate', '--slurp', `repos/${repo}/${route}`])).flat()

// 1. Labels
const LABELS = {
  story: '1d76db', bug: 'd73a4a', chore: 'cfd3d7',
  ux: 'c5def5', backend: '0e8a16', frontend: 'fbca04', security: 'b60205', devops: '5319e7', scanner: '006b75',
  'status:backlog': 'ededed', 'status:ready': '0075ca', 'status:in-progress': 'e4e669', 'status:review': 'a371f7', 'status:done': '0e8a16',
  ...Object.fromEntries(b.epics.map((e) => [`epic:${e.id}`, 'bfd4f2'])),
}
const existingLabels = new Set(dry ? [] : list('labels?per_page=100').map((l) => l.name))
for (const [name, color] of Object.entries(LABELS)) {
  const epic = b.epics.find((e) => `epic:${e.id}` === name)
  const body = { name, color, ...(epic && { description: epic.title }) }
  if (existingLabels.has(name)) api('PATCH', `labels/${encodeURIComponent(name)}`, body)
  else api('POST', 'labels', body)
}
console.log(`✔ ${Object.keys(LABELS).length} labels`)

// 2. Milestones = sprints
const existingMs = dry ? [] : list('milestones?state=all&per_page=100')
const msNumber = {}
for (const sp of b.sprints) {
  const body = { title: sp.name, description: `${sp.goal}\n\nDu ${sp.start} au ${sp.end}`, due_on: `${sp.end}T18:00:00Z` }
  const found = existingMs.find((m) => m.title === sp.name)
  const res = found ? api('PATCH', `milestones/${found.number}`, body) : api('POST', 'milestones', body)
  msNumber[sp.id] = found?.number ?? res.number
}
console.log(`✔ ${b.sprints.length} milestones`)

// 3. Issues = stories
const existingIssues = dry ? [] : list('issues?state=all&labels=story&per_page=100')
let created = 0, updated = 0
for (const s of b.stories) {
  const title = `${s.id} — ${s.title}`
  const epic = b.epics.find((e) => e.id === s.epic)
  const body = [
    s.story, '',
    `**Epic** : ${epic.id} — ${epic.title} · **Points** : ${s.points}${s.journey ? ` · **Parcours** : ${s.journey}` : ''}`,
    s.dependsOn?.length ? `**Dépend de** : ${s.dependsOn.join(', ')}` : '', '',
    '### Critères d\'acceptation', '',
    ...s.acceptance.map((a, i) => `- [${(s.checked ?? []).includes(i) ? 'x' : ' '}] ${a}`), '',
    '<sub>Synchronisé depuis `backlog/backlog.json` — modifier le backlog, pas cette issue.</sub>',
  ].join('\n')
  const payload = {
    title, body,
    labels: ['story', `epic:${s.epic}`, `status:${s.status}`, ...s.labels],
    milestone: s.sprint != null ? msNumber[s.sprint] : null,
    state: s.status === 'done' ? 'closed' : 'open',
  }
  const found = existingIssues.find((i) => i.title.startsWith(`${s.id} `))
  if (found) { api('PATCH', `issues/${found.number}`, payload); updated++ }
  else { const { state, ...p } = payload; api('POST', 'issues', p); created++ }
}
console.log(`✔ Issues : ${created} créées, ${updated} mises à jour`)
