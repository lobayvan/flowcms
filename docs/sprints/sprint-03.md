# Sprint 3 — Vue Site

<!-- BEGIN:GENERATED (pnpm backlog:sprints) — ne pas éditer -->
## Objectif

Voir et faire évoluer la navigation du site dans un graphe fidèle au contenu.

**Dates** : 2026-11-30 → 2026-12-11 · **Capacité** : 21 pts · **Engagé** : 21 pts · **Terminé** : 0 pts

| | ID | Story | Epic | Pts | Labels | Critères | Dépend de |
|---|---|---|---|--:|---|:-:|---|
| ⚪ | US-030 | Extraction des liens et index page-edges | Vue Site | 5 | backend | 0/4 | US-021, US-022 |
| ⚪ | US-031 | Vue Site React Flow | Vue Site | 5 | frontend, ux | 0/5 | US-030 |
| ⚪ | US-032 | Disposition automatique ELK et sauvegarde des positions | Vue Site | 3 | frontend | 0/4 | US-031 |
| ⚪ | US-033 | Analyse du graphe | Vue Site | 3 | backend, frontend | 0/4 | US-030 |
| ⚪ | US-034 | Créer une page et un lien depuis le flow | Vue Site | 3 | frontend, ux | 0/4 | US-031 |
| ⚪ | US-035 | Intégrité des liens : suppression et changement de slug | Vue Site | 2 | backend | 0/3 | US-030 |

## Détail des stories

### US-030 — Extraction des liens et index page-edges

En tant que Hugo, je veux que le graphe reflète exactement les liens du contenu afin de pouvoir lui faire confiance.

- [ ] extractLinks parcourt blocs imbriqués, texte riche, fragments et menus (fonction pure testée)
- [ ] Un hook afterChange remplace les arêtes origin=cms du document
- [ ] flow:reindex reconstruit l'index ; deux exécutions donnent le même résultat
- [ ] Les arêtes origin=code ne sont jamais modifiées par le CMS

### US-031 — Vue Site React Flow

En tant que Camille, je veux voir toutes les pages et leurs liens dans un graphe afin de comprendre la navigation du site. *(parcours J2)*

- [ ] Vue personnalisée dans l'admin conforme à la spec S1 (nœuds, badges, arêtes par kind, légende, mini-carte)
- [ ] Navigation globale (menus) repliée par défaut, affichable par filtre
- [ ] Double-clic sur une page ouvre la vue Page ; Ctrl+K recherche une page
- [ ] Navigation clavier entre nœuds ; aucune violation axe serious/critical
- [ ] États vide, chargement, erreur et viewer implémentés

### US-032 — Disposition automatique ELK et sauvegarde des positions

En tant que Camille, je veux que le graphe soit lisible d'emblée et garde ma disposition afin de m'y repérer.

- [ ] Les pages sans position sont placées par ELK (layered, gauche → droite)
- [ ] Les positions déplacées sont sauvegardées (debounce) sans créer de version
- [ ] Action « Réorganiser » avec confirmation
- [ ] Layout dans un Web Worker au-delà de 100 nœuds

### US-033 — Analyse du graphe

En tant que Hugo, je veux repérer pages orphelines et liens problématiques afin de corriger la navigation avant publication.

- [ ] Détection des pages orphelines, impasses, profondeur depuis l'accueil, cycles de redirection
- [ ] Arête orange quand une page publiée pointe vers une page non publiée
- [ ] Panneau « Problèmes » listant chaque cas avec lien vers le nœud
- [ ] Fonctions d'analyse pures et testées dans flow-utils

### US-034 — Créer une page et un lien depuis le flow

En tant que Camille, je veux ajouter une page et la relier depuis le graphe afin de faire évoluer la navigation sans changer d'écran. *(parcours J3)*

- [ ] « Nouvelle page » crée un brouillon avec slug proposé et parent
- [ ] Tirer une connexion ouvre l'inspecteur sur le champ de lien du bloc source choisi
- [ ] L'arête n'apparaît qu'après enregistrement du lien (ADR 0002)
- [ ] Le badge orpheline disparaît quand un lien entrant existe

### US-035 — Intégrité des liens : suppression et changement de slug

En tant que Hugo, je veux être protégé contre les liens cassés afin que les visiteurs ne tombent jamais sur une 404 interne.

- [ ] Supprimer une page ciblée est refusé avec la liste des pages sources
- [ ] Changer un slug publié crée une redirection 301 (plugin redirects)
- [ ] Les redirections apparaissent comme arêtes kind=redirect
<!-- END:GENERATED -->

## Revue

_À compléter en fin de sprint (/sprint-review)._

## Rétrospective

_À compléter en fin de sprint._
