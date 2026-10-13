---
name: flow-editor
description: Développer la vue Flow de l'admin (vue Site et vue Page) avec React Flow (@xyflow/react) et ELK, ses nœuds personnalisés, ses arêtes, la sélection, la sauvegarde des positions et la synchronisation avec l'aperçu. À utiliser pour tout code dans apps/cms/src/admin/flow ou packages/flow-utils.
---

# Éditeur de flow

Références projet : `docs/architecture/links.md`, `docs/ux/screens.md`.

## Architecture

```
apps/cms/src/admin/flow/
  FlowView.tsx          Server Component (vue admin Payload) : charge pages + page-edges
  SiteCanvas.tsx        'use client' — vue Site
  PageCanvas.tsx        'use client' — vue Page (arbre de blocs)
  nodes/                PageNode, BlockNode, FragmentNode, RedirectNode
  edges/                NavigationEdge (style selon kind), BundledMenuEdge
  panels/               Inspector, Toolbar, Legend, ReleaseLayer
  store.ts              Zustand : sélection, filtres, calques, positions modifiées
packages/flow-utils/    buildSiteGraph, buildPageGraph, analyze (orphelins, profondeur, cycles), layout (ELK)
```

## Règles

1. **Logique pure dans `flow-utils`**, testée sans React. Les composants n'assemblent que des données.
2. **`nodeTypes` et `edgeTypes` définis hors du composant** (ou mémoïsés), sinon React Flow
   recrée tous les nœuds à chaque rendu.
3. Nœuds personnalisés enveloppés dans `memo` ; données minimales dans `node.data`.
4. **Positions** : sauvegarde différée (debounce 800 ms) des nœuds déplacés uniquement, via un
   endpoint qui met à jour `flowPosition` sans créer de version.
5. **Layout** : ELK (`layered`, direction `RIGHT`) dans un Web Worker pour plus de 100 nœuds ; seuls
   les nœuds sans position sont placés, sauf action « Réorganiser ».
6. **Arêtes de menu** : regroupées en un faisceau par défaut (filtre « Afficher la navigation
   globale »).
7. **Créer une arête = créer un lien** : `onConnect` ouvre l'inspecteur sur le champ de lien du bloc
   source ; l'arête n'apparaît qu'après enregistrement (ADR 0002).
8. **Vue Page** : `isValidConnection` vérifie `meta.slots[slot].allows`.
9. **Aperçu** : messages `postMessage` typés `{ type: 'flowcms:select', blockId }` dans les deux sens ;
   vérifier `event.origin` contre `site.previewUrl`.
10. **Accessibilité** : navigation clavier entre nœuds, `aria-label` sur chaque nœud, légende des
    styles d'arêtes, pas d'information portée par la couleur seule.

## Performance

Cible : 500 nœuds à 60 fps au déplacement. `onlyRenderVisibleElements` au-delà de 200 nœuds ;
pas de `useNodes()` dans les nœuds personnalisés.

## Documentation

- React Flow : https://reactflow.dev/learn
- Performance : https://reactflow.dev/learn/advanced-use/performance
- ELK.js : https://github.com/kieler/elkjs
- Vues personnalisées Payload : https://payloadcms.com/docs/custom-components/custom-views
