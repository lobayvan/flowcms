---
name: block-registry
description: Ajouter ou modifier un composant (bloc) du registre partagé packages/blocks, avec sa config Payload, son rendu React, ses métadonnées de flow et ses slots. À utiliser pour tout nouveau composant éditable ou toute modification du BlockRenderer.
---

# Registre de blocs

## Structure d'un bloc

```
packages/blocks/src/<slug>/
  config.ts       Block Payload (slug, labels, fields, slots)
  Component.tsx   rendu React (Server Component par défaut)
  meta.ts         { label, icon, color, linkFields: ['cta'], slots: { children: { allows: [...] } } }
  index.ts        export { config, Component, meta }
  <slug>.test.tsx rendu + snapshot des props minimales
```

Puis l'ajouter à `packages/blocks/src/index.ts` (`allBlocks`, `componentsBySlug`, `metaBySlug`).

## Règles

1. **Slug en kebab-case, stable** : il est stocké dans la base (`blockType`). Le renommer exige une
   migration.
2. **Liens** : `linkField('cta')`, et déclarer le champ dans `meta.linkFields` pour qu'il produise une
   arête.
3. **Slots** : un slot est un champ `blocks` ; ses blocs autorisés sont listés à la fois dans
   `config` (`blocks: [...]`) et `meta.slots.<nom>.allows` (utilisé par `isValidConnection`).
   Un test vérifie la cohérence des deux.
4. **Rendu** : composant pur, props typées depuis `payload-types.ts`, pas de fetch dans le
   composant. `'use client'` uniquement si interaction, et alors isoler la partie client.
5. **Accessibilité** : `alt` obligatoire sur les médias, titres hiérarchisés, contraste AA.
6. **Interaction entre blocs** : champ `targetBlock` (texte, id de bloc) + `meta.interactions`.

## BlockRenderer

`packages/renderer` résout `blockType → Component` récursivement. Un `blockType` inconnu rend `null`
en production et un encadré d'erreur en mode aperçu. Ajouter `data-block-id={id}` sur l'élément racine
pour la synchronisation aperçu ↔ flow.

## Documentation

- Champ blocks : https://payloadcms.com/docs/fields/blocks
- Server Components : https://nextjs.org/docs/app/getting-started/server-and-client-components
