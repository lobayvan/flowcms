# Personas

| Persona | Rôle FlowCMS | Contexte | Besoin principal | Frustration actuelle |
|---|---|---|---|---|
| **Camille**, rédactrice | `author` | Met à jour textes et visuels plusieurs fois par semaine | Trouver vite la bonne page et le bon bloc, voir le résultat | Arborescence de pages illisible, ne sait pas d'où on arrive sur une page |
| **Hugo**, responsable éditorial | `editor` | Valide le contenu, coordonne les lancements | Relire, planifier, publier un ensemble cohérent à une date | Publications page par page, liens cassés découverts après coup |
| **Inès**, intégratrice | `site-admin` | Développe les sites Next.js et les composants | Exposer ses composants au CMS, garder code et CMS alignés | Divergence entre ce que le code fait et ce que le CMS montre |
| **Marc**, responsable agence | `super-admin` | Gère plusieurs sites clients | Ouvrir un site, gérer les accès, tracer qui a fait quoi | Comptes partagés, aucune traçabilité |

## Implications de conception

- Camille ne doit jamais voir un concept technique (`origin`, `blockType`) sans libellé humain.
- Hugo a besoin d'une vue d'ensemble « ce qui va changer » (calque de release).
- Inès veut que le scan de son code produise un flow fidèle, et voir ce qui est verrouillé et pourquoi.
- Marc gère des dizaines d'utilisateurs : actions groupées, filtres par site et par rôle.
