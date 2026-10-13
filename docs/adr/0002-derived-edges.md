# ADR 0002 — Arêtes dérivées du contenu, indexées dans `page-edges`

- **Statut** : accepté
- **Date** : 2026-10-13

## Contexte

Stocker les arêtes comme données éditables séparées créerait deux sources de vérité (le lien dans le
bloc et l'arête dans le graphe) qui divergeraient.

## Décision

Les arêtes sont calculées à partir des champs `linkField`, des menus, de `parent` et des redirections.
Elles sont matérialisées dans `page-edges` (index en lecture) par des hooks, avec `origin: cms | code`.
Créer une arête dans le flow = créer le lien dans le bloc (le panneau propriétés s'ouvre).

## Conséquences

- Le graphe est toujours fidèle au contenu.
- Les hooks doivent être idempotents ; une commande `flow:reindex` reconstruit l'index.
