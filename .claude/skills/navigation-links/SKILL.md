---
name: navigation-links
description: Liens entre nœuds de pages (menu, contenu, CTA, hiérarchie, redirection) et entre nœuds de composants (composition, référence à un fragment, interaction), leur dérivation dans l'index page-edges et les règles d'intégrité. À utiliser pour linkField, les hooks d'arêtes, flow:reindex et l'analyse du graphe.
---

# Liens pages et composants

Source de vérité : `docs/architecture/links.md` et ADR 0002.

## Invariants (à ne jamais casser)

1. Un lien interne référence un **id de page**, jamais une URL.
2. Une arête n'existe que si un lien réel existe (dans un bloc, un menu, `parent`, une redirection,
   ou le code via `next-flow-scan`).
3. Les arêtes `origin: "code"` ne sont jamais modifiées ni supprimées par le CMS.
4. L'index `page-edges` est reconstructible à l'identique par `pnpm --filter cms flow:reindex`.

## Dérivation

`packages/flow-utils/src/extractLinks.ts` : parcours récursif des blocs guidé par
`metaBySlug[blockType].linkFields`, des nœuds de texte riche Lexical (`link` internes) et des
`fragments` référencés. Fonction pure : `(doc, registry) => Edge[]`, testée sur des fixtures.

Hook `afterChange` (pages, menus, fragments) :
remplace en une opération les arêtes `{ origin: 'cms', viaDoc: doc.id }` par les nouvelles.

## Intégrité

| Situation | Comportement |
|---|---|
| Suppression d'une page ciblée | refus + liste des sources + proposition de redirection |
| Changement de slug | redirection 301 automatique |
| Page publiée → page non publiée | arête orange ; publication refusée sauf même release |
| Fragment modifié | revalidation de toutes les pages qui le référencent |
| Bloc ciblé par une interaction supprimé | avertissement + nettoyage de `targetBlock` |

## Tests attendus

- Fixtures : lien dans un slot imbriqué à 3 niveaux, lien dans texte riche, fragment, menu, ancre.
- Propriété : `reindex` deux fois = même résultat ; ordre des blocs sans effet sur l'ensemble des arêtes.

## Documentation

- Relationship : https://payloadcms.com/docs/fields/relationship
- Plugin redirects : https://payloadcms.com/docs/plugins/redirects
- Lexical (texte riche) : https://payloadcms.com/docs/rich-text/overview
