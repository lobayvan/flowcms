---
name: ux-guidelines
description: Principes UX et UI de l'éditeur FlowCMS (vue Site, vue Page, inspecteur, publication), personas, parcours, états vides et d'erreur, accessibilité. À utiliser pour concevoir ou relire un écran, une interaction ou un parcours, et pour rédiger les critères UX d'une story.
---

# Lignes directrices UX

Références projet : `docs/ux/personas.md`, `docs/ux/journeys.md`, `docs/ux/screens.md`.

## Principes

1. **Le graphe sert l'édition, pas l'inverse.** Toute action du flow mène à un contenu éditable en
   ≤ 2 clics (double-clic nœud → vue Page ; clic bloc → inspecteur).
2. **Lisibilité avant exhaustivité** : navigation globale repliée, filtres par type d'arête,
   regroupement par section (`parent`), mini-carte.
3. **Le statut se voit sans cliquer** : badge brouillon / en relecture / planifié / publié sur chaque
   nœud ; arête orange vers une cible non publiée.
4. **Rien d'irréversible sans confirmation explicite** : suppression, publication immédiate, annulation
   de release. Toujours un retour arrière proposé.
5. **Le code fait autorité** : les éléments `origin: code` sont visuellement verrouillés avec
   l'explication « défini dans le code : fichier:ligne ».
6. **Pas d'information portée par la couleur seule** : forme d'arête + icône + légende.

## Pour chaque écran / story UI, préciser

- L'état vide, l'état de chargement, l'état d'erreur, l'état « droits insuffisants ».
- Le comportement clavier (Tab, flèches entre nœuds, Entrée, Échap, Suppr).
- Le texte exact des actions et confirmations (en français, verbes d'action).
- Ce que voit chaque rôle (viewer en lecture seule : actions masquées, pas désactivées sans raison).

## Accessibilité

WCAG 2.2 AA : contraste ≥ 4.5:1, focus visible, cibles ≥ 24×24 px, alternatives aux glisser-déposer
(menu « Déplacer vers… »), annonces `aria-live` pour sauvegarde et publication.

## Documentation

- WCAG 2.2 : https://www.w3.org/TR/WCAG22/
- Accessibilité React Flow : https://reactflow.dev/learn/advanced-use/accessibility
- Heuristiques de Nielsen : https://www.nngroup.com/articles/ten-usability-heuristics/
