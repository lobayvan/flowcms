# Sprint 6 — Code et v1

<!-- BEGIN:GENERATED (pnpm backlog:sprints) — ne pas éditer -->
## Objectif

Aligner le flow sur le code des sites et livrer une v1 exploitable.

**Dates** : 2027-01-18 → 2027-01-29 · **Capacité** : 20 pts · **Engagé** : 20 pts · **Terminé** : 0 pts

| | ID | Story | Epic | Pts | Labels | Critères | Dépend de |
|---|---|---|---|--:|---|:-:|---|
| ⚪ | US-060 | Calque de release dans la vue Site | Édition et publication | 3 | frontend, ux | 0/3 | US-031, US-052 |
| ⚪ | US-061 | Fixtures et tests de next-flow-scan | Reconstitution depuis le code | 3 | scanner | 0/3 | US-006 |
| ⚪ | US-062 | Import du flow et éléments verrouillés | Reconstitution depuis le code | 5 | backend, scanner, security | 0/4 | US-030, US-061 |
| ⚪ | US-063 | Action GitHub de scan pour les sites | Reconstitution depuis le code | 2 | devops, scanner | 0/3 | US-062 |
| ⚪ | US-064 | Performance 500 nœuds et audit d'accessibilité | Qualité et exploitation | 5 | frontend, ux | 0/3 | US-031, US-040 |
| ⚪ | US-065 | Déploiement web + jobs et documentation d'exploitation | Qualité et exploitation | 2 | devops | 0/3 | US-051 |

## Détail des stories

### US-060 — Calque de release dans la vue Site

En tant que Hugo, je veux voir le site tel qu'il sera après la release afin de valider l'impact sur la navigation. *(parcours J5)*

- [ ] Spec S4 : ajouts en vert, suppressions barrées, modifications marquées
- [ ] Contrôles affichés dans le bandeau avec détail
- [ ] L'aperçu accepte ?release=<id>

### US-061 — Fixtures et tests de next-flow-scan

En tant qu'Inès, je veux un scanner fiable et testé afin de faire confiance au flow importé.

- [ ] Une fixture et un test par cas listé dans la skill flow-scanner
- [ ] Sortie déterministe vérifiée (hors generatedAt)
- [ ] Le scanner est publiable comme binaire next-flow-scan

### US-062 — Import du flow et éléments verrouillés

En tant qu'Inès, je veux importer le flow de mon code dans le CMS afin que le CMS montre la réalité du site. *(parcours J6)*

- [ ] POST /api/flow/import (clé API, rôle site-admin, corps validé, taille limitée)
- [ ] Upsert des pages par site+route, positions uniquement si absentes
- [ ] Remplacement des arêtes origin=code ; nœuds et arêtes verrouillés dans le flow avec fichier:ligne
- [ ] Bannière de synthèse : pages ajoutées, liens cassés

### US-063 — Action GitHub de scan pour les sites

En tant qu'Inès, je veux que chaque déploiement de mon site mette à jour le flow afin de ne jamais avoir à y penser.

- [ ] Workflow réutilisable qui exécute next-flow-scan --push
- [ ] Les avertissements apparaissent dans le résumé du job
- [ ] Documentation d'installation dans un site existant

### US-064 — Performance 500 nœuds et audit d'accessibilité

En tant que Marc, je veux que l'éditeur reste fluide et accessible sur de gros sites afin de l'utiliser pour tous mes clients.

- [ ] Jeu de données de 500 pages : chargement < 2 s, déplacement fluide
- [ ] Audit WCAG 2.2 AA des vues Site, Page et Membres sans violation serious/critical
- [ ] Rapport d'audit dans docs/ux/

### US-065 — Déploiement web + jobs et documentation d'exploitation

En tant que Marc, je veux un déploiement documenté afin d'héberger FlowCMS moi-même.

- [ ] Image Docker unique, rôle web ou jobs par variable d'environnement
- [ ] Procédures de sauvegarde, restauration et mise à jour next/payload documentées
- [ ] Contrôle de santé exposé
<!-- END:GENERATED -->

## Revue

_À compléter en fin de sprint (/sprint-review)._

## Rétrospective

_À compléter en fin de sprint._
