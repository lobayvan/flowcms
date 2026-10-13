# FlowCMS

CMS générique pour sites **Next.js**, bâti sur **Payload CMS 3**, dont l'interface d'édition présente
les pages et les composants comme des **nœuds** reliés par la **navigation**, dans un éditeur de flow
(React Flow).

- **Vue Site** : chaque page est un nœud, chaque lien (menu, CTA, contenu, redirection) une arête.
- **Vue Page** : l'arbre des composants d'une page, leurs références et leurs interactions.
- **Publication** : brouillons, relecture, planification et *releases* groupées.
- **Rétro-ingénierie** : `next-flow-scan` reconstitue le flow d'un projet Next.js existant.

## Structure

```
apps/
  cms/              Next.js + Payload (admin, API, vue Flow)
  demo-site/        Site Next.js de démonstration qui consomme le CMS
packages/
  blocks/           Registre partagé des composants (config Payload + rendu React)
  renderer/         <BlockRenderer /> utilisé par les sites
  flow-utils/       Construction et analyse du graphe (arêtes, orphelins, profondeur)
  next-flow-scan/   CLI de reconstitution du flow depuis un projet Next.js
backlog/            Backlog (source de vérité) : epics, stories, sprints
docs/               Architecture, ADR, UX, sprints, processus
.claude/            Skills, agents et commandes pour le développement assisté
scripts/            Outils de suivi (backlog) et d'initialisation GitHub
```

## Démarrage

```bash
pnpm install
pnpm backlog:status          # état d'avancement du sprint courant
pnpm backlog:validate        # contrôle de cohérence du backlog
pnpm scan ./chemin/site-next # reconstitue le flow d'un projet Next.js
```

Pour créer le dépôt GitHub avec labels, milestones (sprints), issues et tableau de projet :

```bash
gh auth login
./scripts/github-bootstrap.sh <owner>/<repo>
```

## Documentation

| Sujet | Fichier |
|---|---|
| Vue d'ensemble | [docs/architecture/overview.md](docs/architecture/overview.md) |
| Modèle de données | [docs/architecture/data-model.md](docs/architecture/data-model.md) |
| Authentification et rôles | [docs/architecture/auth-rbac.md](docs/architecture/auth-rbac.md) |
| Liens pages et composants | [docs/architecture/links.md](docs/architecture/links.md) |
| Édition et publication | [docs/architecture/publishing.md](docs/architecture/publishing.md) |
| Parcours UX | [docs/ux/journeys.md](docs/ux/journeys.md) |
| Feuille de route et sprints | [docs/sprints/roadmap.md](docs/sprints/roadmap.md) |
| Processus (DoR, DoD, suivi) | [docs/process/workflow.md](docs/process/workflow.md) |
| Travailler avec les agents | [CLAUDE.md](CLAUDE.md) |
