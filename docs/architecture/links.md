# Liens entre nœuds

## Liens entre pages (vue Site)

Un lien interne pointe toujours vers l'**identifiant** d'une page, jamais vers une URL en dur.

```ts
linkField(name = 'link') → group {
  type:   'internal' | 'external' | 'anchor'
  page:   relationship → pages      // si internal
  url:    text                       // si external
  anchor: text (id de bloc)          // ancre optionnelle
}
```

| `kind` d'arête | Origine | Style dans le flow |
|---|---|---|
| `menu` | `menus.items[].link` | faisceau replié, affichable à la demande |
| `content` | lien dans un bloc (texte riche, carte…) | trait plein |
| `cta` | champ `cta` d'un bloc | trait épais |
| `hierarchy` | `pages.parent` | trait gris, sans flèche |
| `redirect` | plugin redirects, `next.config` | tirets orange |

### Dérivation et index

1. Un hook `afterChange` sur `pages`, `menus`, `fragments` parcourt les blocs (récursivement) et
   collecte les liens internes.
2. Il remplace les lignes `page-edges` dont `origin = "cms"` et `viaDoc = <ce document>`.
3. Les arêtes `origin = "code"` viennent de `next-flow-scan` et ne sont jamais modifiées par le CMS.

### Intégrité

- `beforeDelete` sur une page avec liens entrants : refus, avec la liste des pages sources et une
  proposition de redirection.
- Changement de slug : redirection 301 créée automatiquement.
- Page publiée pointant vers une page non publiée : arête signalée (orange), publication bloquée
  sauf si la cible fait partie de la même release.
- Analyse du graphe (`packages/flow-utils`) : orphelins, impasses, profondeur depuis `/`, cycles de
  redirection.

## Liens entre composants (vue Page)

| Relation | Exemple | Stockage | Style |
|---|---|---|---|
| **Composition** | Grille → Carte | blocs imbriqués (`blocks` dans un slot) | trait plein |
| **Référence** | Bandeau promo partagé | bloc `ref` → `fragments` | tirets |
| **Interaction** | Filtre → Liste, Sommaire → Section | champ `targetBlock` = id du bloc cible | pointillés |

- La composition est contrainte par le registre : `isValidConnection` n'accepte un enfant que si le
  slot du parent l'autorise.
- Les ids de blocs Payload sont stables : une interaction survit au déplacement d'un bloc.
- Supprimer un bloc ciblé par une interaction affiche un avertissement et nettoie le `targetBlock`.
- Un fragment affiche dans le flow la liste des pages qui l'utilisent (requête inverse).
