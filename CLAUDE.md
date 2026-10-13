# FlowCMS — guide pour Claude

CMS générique Next.js + Payload 3 avec éditeur de flow (pages et composants en nœuds).
Langue du projet : **français** (docs, stories, commits, UI). Code et identifiants en anglais.

## Où trouver quoi

- Backlog (source de vérité) : `backlog/backlog.json` — ne jamais modifier les statuts à la main,
  utiliser `pnpm backlog:move`.
- Architecture : `docs/architecture/`, décisions : `docs/adr/`, UX : `docs/ux/`.
- Processus, DoR, DoD : `docs/process/workflow.md`.

## Agents (`.claude/agents/`)

| Agent | Rôle | Peut passer en |
|---|---|---|
| `product-owner` | stories, priorités, planification et clôture de sprint | `ready` |
| `ux-designer` | parcours, specs d'écran, revue UX | — |
| `architect` | plans d'implémentation, ADR, contrats | — |
| `backend-developer` | Payload : collections, accès, hooks, jobs, endpoints | `in-progress`, `review` |
| `frontend-developer` | vue Flow, aperçu, blocs, renderer | `in-progress`, `review` |
| `scanner-engineer` | `next-flow-scan` et import | `in-progress`, `review` |
| `qa-validator` | validation critère par critère | **`done`** (seul) |
| `security-reviewer` | revue sécurité (bloquante) | — |
| `devops` | CI, Docker, déploiement, GitHub | `in-progress`, `review` |

## Cycle d'une story

```
backlog ─(product-owner + ux-designer)─► ready ─(architect : plan si besoin)─► in-progress
   ─(backend/frontend/scanner)─► review ─(security-reviewer si label security)─(qa-validator)─► done
                                          └──────────────── refus ──────────────► in-progress
```

Commandes : `/sprint-plan`, `/story-start <ID>`, `/story-validate <ID>`, `/sprint-review`.

## Skills (`.claude/skills/`)

`payload-collections`, `access-control`, `block-registry`, `flow-editor`, `navigation-links`,
`publishing-workflow`, `flow-scanner`, `testing-validation`, `git-workflow`, `ux-guidelines`.

## Invariants non négociables

1. Les arêtes du flow sont dérivées du contenu (ADR 0002) ; un lien interne référence un id de page.
2. Accès explicite sur chaque collection ; Local API au nom d'un utilisateur avec `overrideAccess: false`.
3. `next`, `payload` et `@payloadcms/*` en versions exactes, mises à jour ensemble (ADR 0001).
4. Aucune story en `done` sans validation de `qa-validator`.
5. Pas de secret dans le dépôt.

## Commandes utiles

```bash
pnpm backlog:status            # avancement du sprint courant
pnpm backlog:validate          # cohérence du backlog (CI)
pnpm backlog:sprints           # régénère docs/sprints/sprint-XX.md
pnpm backlog:move US-012 review --note "…"
pnpm check:claude              # valide skills et agents (CI)
pnpm scan <projet-next>        # reconstitue un flow
```
