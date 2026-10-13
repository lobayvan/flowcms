# Sprint 4 — Vue Page

<!-- BEGIN:GENERATED (pnpm backlog:sprints) — ne pas éditer -->
## Objectif

Éditer une page bloc par bloc depuis son graphe, avec l'aperçu synchronisé.

**Dates** : 2026-12-14 → 2026-12-23 · **Capacité** : 16 pts · **Engagé** : 16 pts · **Terminé** : 0 pts

| | ID | Story | Epic | Pts | Labels | Critères | Dépend de |
|---|---|---|---|--:|---|:-:|---|
| ⚪ | US-040 | Vue Page : arbre des blocs et composition | Vue Page | 5 | frontend, ux | 0/4 | US-031 |
| ⚪ | US-041 | Inspecteur intégré | Vue Page | 3 | frontend | 0/3 | US-040 |
| ⚪ | US-042 | Fragments réutilisables | Vue Page | 3 | backend, frontend | 0/3 | US-040 |
| ⚪ | US-043 | Interactions entre blocs | Vue Page | 2 | backend, frontend | 0/3 | US-040 |
| ⚪ | US-044 | Synchronisation aperçu ↔ flow | Vue Page | 3 | frontend, security | 0/3 | US-024, US-040 |

## Détail des stories

### US-040 — Vue Page : arbre des blocs et composition

En tant que Camille, je veux voir la structure d'une page en blocs afin de trouver et réorganiser un composant facilement. *(parcours J2)*

- [ ] Vue conforme à la spec S2 avec fil d'Ariane vers la vue Site
- [ ] Ajout de bloc dans un slot limité aux blocs autorisés (isValidConnection)
- [ ] Réordonner par glisser ou par le menu « Monter / Descendre / Déplacer vers… »
- [ ] Les modifications enregistrent un brouillon de la page

### US-041 — Inspecteur intégré

En tant que Camille, je veux modifier un bloc sans quitter le graphe afin de garder le contexte.

- [ ] Clic sur un nœud ouvre le formulaire Payload du bloc dans le panneau (spec S3)
- [ ] Validation et autosave identiques à l'édition standard
- [ ] Nœuds verrouillés affichés en lecture avec fichier:ligne

### US-042 — Fragments réutilisables

En tant que Hugo, je veux modifier une fois un bandeau présent sur plusieurs pages afin de garder le site cohérent.

- [ ] Collection fragments et bloc ref
- [ ] Le nœud fragment liste les pages qui l'utilisent (arêtes en tirets)
- [ ] Modifier un fragment revalide toutes les pages qui le référencent

### US-043 — Interactions entre blocs

En tant qu'Inès, je veux relier un filtre à une liste ou un sommaire à ses sections afin de configurer ces interactions dans le CMS.

- [ ] Champ targetBlock déclaré dans meta.interactions
- [ ] Arête pointillée entre blocs reliés, qui survit au déplacement
- [ ] Supprimer la cible avertit et nettoie targetBlock

### US-044 — Synchronisation aperçu ↔ flow

En tant que Camille, je veux cliquer dans l'aperçu pour sélectionner le bloc correspondant afin de trouver instantanément ce que je veux modifier.

- [ ] Clic dans l'aperçu sélectionne le nœud ; survol du nœud met en évidence le bloc dans l'aperçu
- [ ] Messages postMessage typés avec vérification de l'origine dans les deux sens
- [ ] Sans effet hors mode aperçu
<!-- END:GENERATED -->

## Revue

_À compléter en fin de sprint (/sprint-review)._

## Rétrospective

_À compléter en fin de sprint._
