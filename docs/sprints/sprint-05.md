# Sprint 5 — Publication

<!-- BEGIN:GENERATED (pnpm backlog:sprints) — ne pas éditer -->
## Objectif

Relire, planifier et publier des ensembles cohérents sans casser la navigation.

**Dates** : 2027-01-04 → 2027-01-15 · **Capacité** : 20 pts · **Engagé** : 20 pts · **Terminé** : 0 pts

| | ID | Story | Epic | Pts | Labels | Critères | Dépend de |
|---|---|---|---|--:|---|:-:|---|
| ⚪ | US-050 | Workflow éditorial | Édition et publication | 5 | backend, ux | 0/5 | US-012, US-041 |
| ⚪ | US-051 | Planification de publication et worker de jobs | Édition et publication | 2 | backend, devops | 0/4 | US-050 |
| ⚪ | US-052 | Releases : regrouper et contrôler | Édition et publication | 5 | backend, ux | 0/4 | US-050 |
| ⚪ | US-053 | Publication atomique des releases et retour arrière | Édition et publication | 5 | backend | 0/4 | US-052 |
| ⚪ | US-054 | Revalidation signée des sites | Édition et publication | 3 | backend, security | 0/4 | US-023 |

## Détail des stories

### US-050 — Workflow éditorial

En tant que Hugo, je veux relire, approuver ou renvoyer un contenu afin que seul un contenu validé soit publié. *(parcours J4)*

- [ ] Statuts draft, in_review, approved, scheduled, published, archived selon docs/architecture/publishing.md
- [ ] Actions affichées selon le rôle ; demande de modifications avec commentaire obligatoire
- [ ] Diff avec la version publiée
- [ ] Filtre par statut dans la vue Site
- [ ] Transitions tracées dans l'audit

### US-051 — Planification de publication et worker de jobs

En tant que Hugo, je veux programmer la publication d'une page afin qu'elle sorte au bon moment sans intervention.

- [ ] schedulePublish activé sur pages, menus et fragments
- [ ] Un process jobs (payload jobs:run --handle-schedules) est documenté et lancé en dev
- [ ] Dates saisies dans le fuseau de l'utilisateur, stockées en UTC
- [ ] Supprimer un document annule ses publications planifiées

### US-052 — Releases : regrouper et contrôler

En tant que Hugo, je veux regrouper plusieurs changements dans une release afin de les publier ensemble. *(parcours J5)*

- [ ] Collection releases (nom, site, éléments, date, statut)
- [ ] Ajout à une release depuis la sélection multiple du flow
- [ ] Contrôles avant planification : liens vers non publiées hors release, conflits de slug, droits
- [ ] Les contrôles en échec bloquent la planification avec le détail

### US-053 — Publication atomique des releases et retour arrière

En tant que Hugo, je veux qu'une release soit publiée en entier ou pas du tout afin de ne jamais laisser le site dans un état incohérent.

- [ ] Job publishRelease : toutes les publications dans une transaction
- [ ] Un échec annule tout, release en failed, notification
- [ ] Job idempotent
- [ ] Annuler une release republie les versions précédentes de ses documents

### US-054 — Revalidation signée des sites

En tant qu'Inès, je veux que mon site se mette à jour dès la publication afin que les visiteurs voient le contenu à jour.

- [ ] Après publication, POST signé HMAC vers site.revalidateUrl avec les tags concernés
- [ ] Le site vérifie la signature en temps constant et appelle revalidateTag
- [ ] 3 tentatives avec backoff puis alerte
- [ ] Le secret n'apparaît dans aucun log
<!-- END:GENERATED -->

## Revue

_À compléter en fin de sprint (/sprint-review)._

## Rétrospective

_À compléter en fin de sprint._
