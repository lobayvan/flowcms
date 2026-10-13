---
description: Démarre une story - vérifie qu'elle est prête, prépare le plan et la branche, puis délègue à l'agent de développement adapté
argument-hint: <ID de la story, ex. US-012>
---

Démarre la story **$ARGUMENTS**.

1. Lis la story dans `backlog/backlog.json`. Si son statut n'est pas `ready`, arrête-toi et explique
   ce qui manque au regard de la Definition of Ready (`docs/process/workflow.md`).
2. Vérifie que toutes ses dépendances (`dependsOn`) sont `done` ; sinon arrête-toi et liste-les.
3. Si la story a le label `backend`, `security` ou touche au modèle de données, demande à l'agent
   `architect` un plan d'implémentation et enregistre-le dans `docs/sprints/plans/$ARGUMENTS.md`.
4. Si la story a le label `ux` et que l'écran n'est pas spécifié dans `docs/ux/screens.md`, demande
   d'abord la spec à l'agent `ux-designer`.
5. Délègue l'implémentation à l'agent selon les labels : `frontend` → `frontend-developer`,
   `scanner` → `scanner-engineer`, `devops` → `devops`, sinon `backend-developer`.
6. Termine par le résumé de l'agent et le statut obtenu (`pnpm backlog:status`).
