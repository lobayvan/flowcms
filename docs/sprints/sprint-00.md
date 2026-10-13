# Sprint 0 — Fondations

<!-- BEGIN:GENERATED (pnpm backlog:sprints) — ne pas éditer -->
## Objectif

Un environnement de développement reproductible où le CMS démarre et la CI valide chaque PR.

**Dates** : 2026-10-19 → 2026-10-30 · **Capacité** : 20 pts · **Engagé** : 18 pts · **Terminé** : 0 pts

| | ID | Story | Epic | Pts | Labels | Critères | Dépend de |
|---|---|---|---|--:|---|:-:|---|
| 🔵 | US-001 | Monorepo pnpm + Turborepo et configuration TypeScript/ESLint partagée | Fondations | 3 | devops | 0/4 | — |
| 🔵 | US-002 | Docker Compose de développement (PostgreSQL, MinIO, Mailpit) | Fondations | 2 | devops | 0/3 | — |
| 🔵 | US-003 | Installer Payload 3 dans apps/cms avec PostgreSQL et stockage S3 | Fondations | 5 | backend | 0/5 | US-001, US-002 |
| 🔵 | US-004 | CI GitHub Actions | Fondations | 3 | devops | 0/4 | US-001 |
| 🔵 | US-005 | Collection Sites et sélecteur de site | Fondations | 3 | backend, ux | 0/4 | US-003 |
| 🔵 | US-006 | Squelettes des packages blocks, renderer, flow-utils avec Vitest | Fondations | 2 | backend, frontend | 0/3 | US-001 |

## Détail des stories

### US-001 — Monorepo pnpm + Turborepo et configuration TypeScript/ESLint partagée

En tant que développeuse (Inès), je veux un monorepo outillé afin de partager le registre de blocs entre le CMS et les sites.

- [ ] pnpm install puis pnpm lint, typecheck et test réussissent depuis la racine
- [ ] Une configuration TypeScript strict et ESLint partagée est utilisée par tous les packages
- [ ] Turborepo met en cache build, lint et test
- [ ] Node et pnpm sont imposés par engines et packageManager

### US-002 — Docker Compose de développement (PostgreSQL, MinIO, Mailpit)

En tant que développeuse, je veux lancer les services en une commande afin d'avoir un environnement identique pour toute l'équipe.

- [ ] docker compose up démarre PostgreSQL, MinIO (bucket créé) et Mailpit
- [ ] Les volumes sont persistants et documentés
- [ ] .env.example contient toutes les variables nécessaires

### US-003 — Installer Payload 3 dans apps/cms avec PostgreSQL et stockage S3

En tant que développeuse, je veux un CMS Payload fonctionnel afin de construire les collections du projet.

- [ ] L'admin est accessible sur /admin et la création du premier utilisateur fonctionne
- [ ] Les médias sont stockés dans MinIO via @payloadcms/storage-s3
- [ ] next, payload et @payloadcms/* sont en versions exactes (ADR 0001)
- [ ] Les migrations Postgres sont générées et appliquées par script
- [ ] payload-types.ts est généré et commité

### US-004 — CI GitHub Actions

En tant qu'équipe, je veux que chaque PR soit vérifiée automatiquement afin de ne jamais fusionner un code cassé.

- [ ] Sur chaque PR : lint, typecheck, test avec un service PostgreSQL
- [ ] pnpm backlog:validate et pnpm check:claude s'exécutent en CI
- [ ] Le cache pnpm est activé et la CI dure moins de 8 minutes
- [ ] La branche main exige la CI verte (documenté)

### US-005 — Collection Sites et sélecteur de site

En tant que Marc (super-admin), je veux déclarer plusieurs sites afin de gérer leurs contenus séparément. *(parcours J1)*

- [ ] Un site a un nom, un domaine, une URL d'aperçu, une URL de revalidation et des langues
- [ ] Le plugin multi-tenant isole les contenus par site
- [ ] Un utilisateur ayant plusieurs sites choisit le site actif dans l'admin ; un seul site → sélection automatique
- [ ] État vide : message et bouton de création pour le super-admin

### US-006 — Squelettes des packages blocks, renderer, flow-utils avec Vitest

En tant que développeuse, je veux les packages partagés prêts afin de commencer le registre et la logique de graphe.

- [ ] Les trois packages compilent et exposent un index typé
- [ ] Vitest est configuré avec un test d'exemple par package
- [ ] Les packages sont consommables par apps/cms et apps/demo-site
<!-- END:GENERATED -->

## Revue

_À compléter en fin de sprint (/sprint-review)._

## Rétrospective

_À compléter en fin de sprint._
