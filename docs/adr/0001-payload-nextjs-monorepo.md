# ADR 0001 — Payload 3 dans un monorepo Next.js

- **Statut** : accepté
- **Date** : 2026-10-13

## Contexte

Les sites cibles sont en Next.js. Construire auth, médias, versions et permissions de zéro coûterait
plusieurs mois sans valeur différenciante. La valeur du projet est l'éditeur en flow et l'analyse du
graphe.

## Décision

- Payload 3 installé dans `apps/cms` (Next.js), PostgreSQL, S3.
- Monorepo pnpm + Turborepo ; registre de blocs partagé dans `packages/blocks`.
- Versions de `next`, `payload` et `@payloadcms/*` **figées ensemble** (pas de `^`) et mises à jour
  dans une PR dédiée après lecture des notes de version.
- Hébergement auto-géré (Payload Cloud n'accepte plus de nouvelles inscriptions depuis le rachat par
  Figma) : un service web et un service jobs séparés.

## Conséquences

- Rythme de sortie très rapide de Payload : veille et mises à jour régulières.
- Dépendance forte à l'API d'admin de Payload pour la vue Flow : isoler l'intégration dans
  `apps/cms/src/admin/` pour limiter l'impact des évolutions.
