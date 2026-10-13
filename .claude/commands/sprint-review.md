---
description: Clôture le sprint courant - bilan, validation des stories en review, report des restantes, rétrospective
---

Clôture le sprint courant.

1. `pnpm backlog:status` : stories par statut, points livrés / engagés.
2. Pour chaque story en `review`, lance `/story-validate <ID>`.
3. Délègue au `product-owner` : reporter les stories non `done` au sprint suivant avec une note,
   rédiger la section **Revue** de `docs/sprints/sprint-XX.md` (objectif atteint ou non, livré,
   reporté, vélocité).
4. Ajoute une section **Rétrospective** : ce qui a bien marché, ce qui a freiné, 1 à 3 actions.
5. `pnpm backlog:validate && pnpm backlog:sprints`, puis propose le commit
   `docs(backlog): clôture du sprint XX`.
