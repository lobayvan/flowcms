---
description: Prépare le prochain sprint - affine les stories candidates, vérifie la DoR et la capacité, fixe l'objectif
argument-hint: [numéro de sprint, par défaut le prochain]
---

Prépare le sprint **$ARGUMENTS** (le prochain non démarré si vide).

1. `pnpm backlog:status` pour l'état actuel.
2. Délègue à l'agent `product-owner` : sélectionner les stories du sprint dans `backlog/backlog.json`
   (dépendances respectées, capacité 20 points par défaut), confirmer ou rédiger l'objectif du sprint.
3. Pour chaque story `ux` sans spec d'écran, délègue à `ux-designer`.
4. Le `product-owner` passe en `ready` les stories qui satisfont la DoR, puis exécute
   `pnpm backlog:validate` et `pnpm backlog:sprints`.
5. Présente : objectif, stories retenues (ID, titre, points), points engagés / capacité, risques.
