---
name: testing-validation
description: Stratégie de test et validation d'une tâche dans FlowCMS (Vitest, tests d'accès Payload, Playwright pour l'éditeur de flow, accessibilité) et vérification des critères d'acceptation d'une story avant de la passer en done. À utiliser pour écrire des tests ou valider une story.
---

# Tests et validation

## Pyramide

| Niveau | Outil | Où | Exemples |
|---|---|---|---|
| Unitaire | Vitest | `packages/*`, `apps/cms/src/**/*.test.ts` | extractLinks, analyse du graphe, transitions |
| Intégration | Vitest + Payload (Postgres de test) | `apps/cms/test/int/` | accès par rôle, hooks d'arêtes, release atomique |
| E2E | Playwright | `apps/cms/test/e2e/` | parcours éditeur dans la vue Flow |
| Accessibilité | `@axe-core/playwright` | E2E | vue Flow, panneaux, formulaires |

## Règles

1. Toute story a au moins un test par critère d'acceptation, nommé avec l'id :
   `it('[US-021] refuse la publication à un author', …)`.
2. Tests d'intégration sur une base Postgres éphémère (service CI), jamais sur une base partagée.
3. Pas de `setTimeout` arbitraire en E2E : attendre un état (`expect(locator).toBeVisible()`).
4. Données de test via des fabriques (`test/factories.ts`), pas de dépendance à l'ordre des tests.
5. Couverture minimale : 80 % sur `packages/flow-utils` et `apps/cms/src/access`.

## Validation d'une story (avant `done`)

1. Lire la story dans `backlog/backlog.json` (critères d'acceptation).
2. `pnpm lint && pnpm typecheck && pnpm test` au vert.
3. Pour chaque critère : retrouver le test correspondant (grep de l'id) et vérifier qu'il échouerait
   sans le code (lecture critique).
4. Stories UI : parcours manuel ou E2E + contrôle axe sans violation `serious`/`critical`.
5. Documentation mise à jour si le comportement ou un contrat change.
6. Consigner le résultat : `pnpm backlog:move <ID> done --note "…"` (refusé si un critère n'est pas coché).

## Documentation

- Vitest : https://vitest.dev/guide/
- Playwright : https://playwright.dev/docs/intro
- Tests Payload : https://payloadcms.com/docs/local-api/overview
- axe : https://github.com/dequelabs/axe-core-npm
