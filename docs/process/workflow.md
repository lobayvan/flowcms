# Processus : organisation, suivi, validation

## Rythme

Sprints de **2 semaines**, du lundi au vendredi suivant. Capacité par défaut : 20 points.

| Moment | Commande | Qui |
|---|---|---|
| Lundi J1 — planification | `/sprint-plan` | product-owner, ux-designer |
| Chaque jour — suivi | `pnpm backlog:status` | tous |
| Au fil de l'eau — démarrage | `/story-start US-xxx` | agents de développement |
| Au fil de l'eau — validation | `/story-validate US-xxx` | security-reviewer, qa-validator |
| Vendredi J10 — revue et rétro | `/sprint-review` | product-owner, qa-validator |

## Statuts d'une story

| Statut | Signification | Qui le donne |
|---|---|---|
| ⚪ `backlog` | idée rédigée, pas encore prête | product-owner |
| 🔵 `ready` | satisfait la Definition of Ready | product-owner |
| 🟡 `in-progress` | en développement sur une branche | agent de développement |
| 🟣 `review` | PR ouverte, CI verte, en attente de validation | agent de développement |
| 🟢 `done` | satisfait la Definition of Done, validée | **qa-validator uniquement** |

Transitions autorisées (contrôlées par `pnpm backlog:move`) :
`backlog → ready → in-progress → review → done`, avec retours `ready → backlog`,
`in-progress → ready`, `review → in-progress` (refus), `done → in-progress` (réouverture).
Chaque mouvement est horodaté et attribué dans `history`.

## Definition of Ready (DoR)

- [ ] Rédigée « En tant que … je veux … afin de … », persona identifié.
- [ ] 2 à 6 critères d'acceptation **vérifiables par un test**.
- [ ] Estimée (1, 2, 3, 5, 8) ; au-delà de 8, découpée.
- [ ] Dépendances identifiées et terminées ou planifiées dans le même sprint.
- [ ] Label `ux` : parcours (`journey`) référencé et écran spécifié dans `docs/ux/screens.md`.
- [ ] Touche au modèle de données ou à la sécurité : plan de l'architecte disponible.

## Definition of Done (DoD)

- [ ] Chaque critère d'acceptation a un test nommé `[US-xxx] …` qui le prouve.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` verts en local et en CI.
- [ ] Label `ux` : E2E du parcours + aucun défaut axe `serious`/`critical`.
- [ ] Label `security` : verdict `OK` du security-reviewer.
- [ ] Types générés et migrations commités si le schéma change.
- [ ] Documentation (`docs/`, skills) à jour si un comportement ou un contrat change.
- [ ] PR revue, fusionnée en squash sur `main`, issue GitHub fermée.
- [ ] Story passée en `done` par le qa-validator avec une note de preuve.

## Traçabilité

```
backlog.json (US-xxx) ─► issue GitHub (label story, milestone = sprint)
       │                         ▲
       ▼                         │ Closes #n
branche feat/US-xxx-… ─► commits "Refs: US-xxx" ─► PR ─► CI ─► validation ─► done
```

`backlog/backlog.json` reste la source de vérité ; `scripts/github-bootstrap.sh` crée et met à jour
les issues et milestones à partir de lui. La CI refuse une PR dont le titre n'est pas au format
Conventional Commits ou dont le corps ne référence aucune story (sauf label `chore`).
