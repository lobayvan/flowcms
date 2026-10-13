---
name: flow-scanner
description: Faire évoluer next-flow-scan, la CLI qui reconstitue le flow (routes, layouts, composants, liens, redirections) d'un projet Next.js avec ts-morph, et l'endpoint /api/flow/import qui l'importe dans le CMS. À utiliser pour toute détection de route ou de lien, le format flow.json ou l'import.
---

# next-flow-scan

Code : `packages/next-flow-scan/cli.mjs`. Format de sortie : `schema: "next-flow/1"`.

## Format flow.json (contrat stable)

```jsonc
{
  "schema": "next-flow/1", "site": "mon-site", "generatedAt": "…",
  "nodes": [{ "id": "page:/blog/[slug]", "kind": "page|layout|component", "route": "…", "file": "…", "position": {"x":0,"y":0}, "orphan": false }],
  "edges": [{ "id": "…", "source": "…", "target": "…", "kind": "navigation|contains|layout|redirect", "scope": "global|local", "trigger": "Link|a|router.push|redirect", "dynamic": false, "locked": true }],
  "warnings": ["Lien cassé /oops dans app/blog/page.tsx:3"]
}
```

Toute modification incompatible incrémente `schema` (`next-flow/2`) et l'import gère les deux.

## Règles

1. **Analyse statique uniquement** : ne jamais exécuter le code du projet scanné, sauf `next.config`
   pour les redirections (dans un `try`, avertissement en cas d'échec).
2. Chaque nouvelle détection a une **fixture** dans `packages/next-flow-scan/fixtures/` et un test.
3. Ce qui ne peut être résolu va dans `warnings`, jamais en erreur bloquante.
4. Ids déterministes (`page:<route>`, `component:<fichier>#<nom>`) : deux scans identiques produisent
   le même fichier (hors `generatedAt`).
5. Import CMS (`POST /api/flow/import`, clé API, rôle site-admin) : upsert des pages par
   `site + route`, positions uniquement si absentes, remplacement des arêtes `origin: "code"`.

## Cas couverts

App Router et Pages Router, groupes `(x)`, slots `@x`, dossiers privés `_x`, routes interceptées,
segments `[x]`, `[...x]`, `[[...x]]`, alias tsconfig, `<Link href>` (chaîne, template, `{ pathname }`),
`<a href>`, `router.push/replace`, `redirect`, `permanentRedirect`, `redirects()` de next.config.

## Limites connues

Liens calculés à l'exécution, liens dans des fichiers MDX non importés, plusieurs composants par
fichier (liens attribués au fichier).

## Documentation

- ts-morph : https://ts-morph.com/
- Routage App Router : https://nextjs.org/docs/app/getting-started/layouts-and-pages
- Conventions de fichiers : https://nextjs.org/docs/app/api-reference/file-conventions
