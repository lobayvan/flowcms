# Spécifications d'écrans

Propriétaire : agent `ux-designer`. Chaque spec liste les états : vide, chargement, erreur, droits.

## S1 — Vue Site

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Site ▾]  Rechercher (Ctrl+K)   Filtres: ☑Contenu ☑CTA ☐Menu ☐Redir.  [Release ▾] │
├────────┬─────────────────────────────────────────────────────────┬───────────┤
│Palette │                                                         │Inspecteur │
│+ Page  │     ┌──────┐        ┌────────┐                          │(page      │
│Fragments│    │Accueil│──────►│Services│──────►┌──────┐           │ sélect.)  │
│        │     └──────┘        └────────┘       │Tarifs│ ●relecture│           │
│        │                                      └──────┘           │           │
│        │                         [mini-carte]  [légende]  [zoom] │           │
└────────┴─────────────────────────────────────────────────────────┴───────────┘
```

| Élément | Détail |
|---|---|
| Nœud page | titre, slug, badge de statut (forme + couleur + texte), compteur liens entrants/sortants, cadenas si `origin: code` |
| Arêtes | style par `kind` (voir `docs/architecture/links.md`), orange si cible non publiée |
| Interactions | double-clic → vue Page ; clic → inspecteur ; glisser → déplace (position sauvegardée) ; tirer depuis la poignée → créer un lien |
| Clavier | Tab / flèches entre nœuds, Entrée = ouvrir, Suppr = supprimer (confirmation), Ctrl+K = recherche, Échap = désélectionner |
| Vide | « Aucune page. Créez la première ou importez le flow depuis votre code. » + 2 boutons |
| Chargement | squelette de nœuds, pas de spinner plein écran |
| Erreur | bandeau avec « Réessayer » ; le dernier graphe chargé reste affiché |
| `viewer` | lecture seule : palette et poignées masquées, inspecteur en lecture |

## S2 — Vue Page

Arbre des blocs de la page (gauche → droite = profondeur), aperçu du site en panneau rétractable.

| Élément | Détail |
|---|---|
| Nœud bloc | icône et libellé du registre, résumé du contenu (premier texte), pastille si lien sortant |
| Arêtes | composition (plein), référence fragment (tirets), interaction (pointillés) |
| Ajout | « + » sur un slot → palette filtrée sur les blocs autorisés |
| Synchronisation | clic dans l'aperçu ↔ sélection du nœud ; survol nœud → surbrillance dans l'aperçu |
| Fil d'Ariane | Site › Services › Tarifs, retour à la vue Site |
| Alternative au glisser | menu du nœud « Déplacer vers… », « Monter », « Descendre » |

## S3 — Inspecteur

Formulaire Payload du bloc ou de la page. En haut : statut, auteur, dernière modification, actions
de workflow selon le rôle. Pour un champ de lien : sélecteur de page avec recherche et aperçu du
titre. Pour un nœud verrouillé : « Défini dans le code — `app/blog/page.tsx:12` ».

## S4 — Calque de release

Bandeau supérieur : nom, date planifiée, nombre d'éléments, contrôles (✔ / ⚠ avec détail), boutons
« Planifier », « Publier maintenant », « Retirer du calque ». Graphe : ajouts en vert (+), suppressions
barrées, modifications avec point bleu.

## S5 — Membres du site

Tableau : nom, e-mail, rôle, statut (invité / actif / désactivé), dernière connexion. Actions :
inviter, changer de rôle (limité au rôle de l'utilisateur courant), désactiver/réactiver, renvoyer
l'invitation. Lien vers le journal d'audit filtré.
