---
name: payload-collections
description: Créer ou modifier une collection, un global, un champ ou un hook Payload CMS 3 dans apps/cms. À utiliser pour tout travail sur le schéma de données (pages, menus, fragments, releases, page-edges, users, audit-log), les hooks et la Local API.
---

# Collections et hooks Payload

Référence projet : `docs/architecture/data-model.md`.

## Règles

1. **Un fichier par collection** : `apps/cms/src/collections/<Nom>.ts`, exporté puis enregistré dans
   `payload.config.ts`. Les hooks dans `apps/cms/src/hooks/<collection>/<hook>.ts`.
2. **Toujours un champ `site`** (relationship → `sites`, `required`, `index: true`) sur les contenus
   multi-site. Le plugin multi-tenant l'injecte : ne pas le redéclarer s'il est actif.
3. **Accès explicite** : `access.read/create/update/delete` définis sur chaque collection, via les
   fonctions de `apps/cms/src/access/` (voir skill `access-control`). Jamais d'accès implicite.
4. **Versions** : `pages`, `menus`, `fragments` ont `versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 50 }`.
5. **Liens** : tout champ de lien utilise `linkField()` de `apps/cms/src/fields/link.ts`. Jamais un
   champ `text` contenant une URL interne.
6. **Index** : ajouter `index: true` sur les champs filtrés (`slug`, `site`, `workflowStatus`) et un
   index unique composé `site + slug` sur `pages`.
7. **Types générés** : après toute modification de schéma, `pnpm --filter cms payload generate:types`
   puis commit de `payload-types.ts`. Les migrations Postgres : `pnpm --filter cms payload migrate:create <nom>`.

## Hooks

- Les hooks sont **idempotents** et rapides ; un travail long passe par `req.payload.jobs.queue()`.
- Dans un hook, réutiliser `req` (transaction en cours) : `req.payload.update({ ..., req })`.
- Éviter les boucles : passer `context: { skipEdges: true }` quand un hook met à jour le même
  document, et le tester en entrée.
- `afterChange` pour les effets (index `page-edges`, audit, revalidation) ; `beforeChange` pour la
  validation et les transitions de workflow.

## Local API

```ts
await payload.find({
  collection: 'pages',
  where: { site: { equals: siteId } },
  depth: 0,                 // profondeur minimale ; augmenter seulement si nécessaire
  overrideAccess: false,    // obligatoire dès qu'on agit au nom d'un utilisateur
  user,
})
```

## Pièges

- La Local API **ignore l'accès** par défaut (`overrideAccess: true`).
- `depth` trop élevé sur les blocs imbriqués explose les temps de réponse.
- Les versions de `payload` et `next` sont couplées : ne jamais monter l'une sans l'autre (ADR 0001).

## Documentation

- Collections : https://payloadcms.com/docs/configuration/collections
- Champs blocks : https://payloadcms.com/docs/fields/blocks
- Hooks : https://payloadcms.com/docs/hooks/collections
- Local API : https://payloadcms.com/docs/local-api/overview
- Brouillons et versions : https://payloadcms.com/docs/versions/drafts
