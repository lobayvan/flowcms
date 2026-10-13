# Sprint 2 — Contenu

<!-- BEGIN:GENERATED (pnpm backlog:sprints) — ne pas éditer -->
## Objectif

Composer une page de blocs dans le CMS et la voir rendue sur le site de démonstration.

**Dates** : 2026-11-16 → 2026-11-27 · **Capacité** : 20 pts · **Engagé** : 19 pts · **Terminé** : 0 pts

| | ID | Story | Epic | Pts | Labels | Critères | Dépend de |
|---|---|---|---|--:|---|:-:|---|
| ⚪ | US-020 | Collection Pages | Contenu et registre de blocs | 3 | backend | 0/4 | US-011 |
| ⚪ | US-021 | Champ linkField et collection Menus | Contenu et registre de blocs | 3 | backend | 0/4 | US-020 |
| ⚪ | US-022 | Registre : 5 blocs de base avec métadonnées de flow | Contenu et registre de blocs | 5 | backend, frontend | 0/4 | US-006, US-020 |
| ⚪ | US-023 | BlockRenderer et site de démonstration | Contenu et registre de blocs | 5 | frontend | 0/5 | US-022 |
| ⚪ | US-024 | Live Preview dans l'admin | Contenu et registre de blocs | 3 | frontend | 0/3 | US-023 |

## Détail des stories

### US-020 — Collection Pages

En tant que Camille, je veux créer des pages organisées en sections afin de structurer le site.

- [ ] Champs title, slug, site, parent, layout (blocs), seo, flowPosition, workflowStatus
- [ ] Slug unique par site (index composé)
- [ ] Brouillons avec autosave et versions (maxPerDoc 50)
- [ ] Accès conformes à la matrice des rôles

### US-021 — Champ linkField et collection Menus

En tant que Camille, je veux lier une page à une autre sans saisir d'URL afin que les liens ne cassent jamais.

- [ ] linkField propose internal (page), external (url) et anchor
- [ ] Un lien interne stocke l'id de page ; changer le slug ne casse pas le lien
- [ ] Menus par site et emplacement (header, footer) avec éléments imbriqués
- [ ] Les menus sont versionnés

### US-022 — Registre : 5 blocs de base avec métadonnées de flow

En tant qu'Inès, je veux déclarer mes composants une seule fois afin qu'ils soient éditables dans le CMS et rendus sur le site.

- [ ] Blocs hero, rich-text, grid (slot children), card, cta selon la skill block-registry
- [ ] Chaque bloc expose config, Component et meta (label, icône, linkFields, slots)
- [ ] Un test vérifie la cohérence entre slots de config et meta.slots.allows
- [ ] Médias avec alt obligatoire

### US-023 — BlockRenderer et site de démonstration

En tant qu'Inès, je veux un composant de rendu générique afin d'afficher toute page du CMS dans mon site Next.js.

- [ ] apps/demo-site affiche n'importe quelle page publiée par son slug (route [[...slug]])
- [ ] Le rendu est récursif sur les slots
- [ ] Un blockType inconnu ne casse pas la page (null en prod, encadré en aperçu)
- [ ] Chaque bloc racine porte data-block-id
- [ ] Pages mises en cache par tag (page:<id>)

### US-024 — Live Preview dans l'admin

En tant que Camille, je veux voir ma modification sur le vrai site pendant que je tape afin d'éviter les allers-retours. *(parcours J2)*

- [ ] L'aperçu affiche le brouillon du site de démo à côté du formulaire
- [ ] La saisie met à jour l'aperçu en moins d'une seconde
- [ ] Le mode brouillon du site exige un jeton valide
<!-- END:GENERATED -->

## Revue

_À compléter en fin de sprint (/sprint-review)._

## Rétrospective

_À compléter en fin de sprint._
