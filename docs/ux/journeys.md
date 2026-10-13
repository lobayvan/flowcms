# Parcours utilisateurs

Chaque parcours est référencé par les stories (`journey`) et sert de base aux tests E2E.

## J1 — Première connexion (Camille)

Invitation reçue → définit son mot de passe → arrive sur le **sélecteur de site** (si plusieurs) →
**vue Site** du site, centrée sur l'accueil, avec une aide contextuelle de 3 étapes (zoom, double-clic,
légende) refermable.

## J2 — Modifier un texte (Camille)

Vue Site → recherche « Tarifs » (Ctrl+K) → le nœud est mis en évidence → double-clic → **vue Page** →
clic sur le bloc « Tableau de prix » → **inspecteur** à droite + aperçu synchronisé → modification
(autosave) → « Soumettre en relecture ».

**Succès** : moins de 30 secondes de l'ouverture à l'édition du bon champ.

## J3 — Ajouter une page dans la navigation (Camille)

Vue Site → bouton « Nouvelle page » ou glisser depuis la palette → titre, slug proposé, parent →
la page apparaît sans arête (badge « orpheline ») → dans la page « Services », tirer une connexion
vers la nouvelle page → l'inspecteur s'ouvre sur le champ de lien du bloc choisi → enregistrement →
l'arête apparaît, le badge disparaît.

## J4 — Relire et publier (Hugo)

Filtre « En relecture » → nœuds concernés en évidence → ouvre chaque page, voit le diff avec la
version publiée → « Approuver » ou « Demander des modifications » (commentaire obligatoire) →
« Publier maintenant » avec confirmation listant l'impact (pages liées, menus).

## J5 — Préparer un lancement (Hugo)

Sélection multiple de nœuds (nouvelle offre : 3 pages + menu) → « Ajouter à une release » → nomme la
release, date et heure → **calque de release** : nœuds et arêtes ajoutés en vert, retirés barrés →
contrôles (liens vers non publiées, conflits de slug) → « Planifier » → à l'heure dite, publication
atomique, notification, revalidation.

## J6 — Aligner le CMS sur le code (Inès)

CI du site Next.js → `next-flow-scan --push` → dans le CMS, bannière « Flow importé : 3 pages
ajoutées, 2 liens cassés » → les éléments issus du code sont verrouillés (icône cadenas, info-bulle
fichier:ligne) → Inès corrige les liens cassés dans son code.

## J7 — Gérer les accès (Marc)

Paramètres du site → Membres → « Inviter » (e-mail, rôle) → liste filtrable par rôle et statut →
changer un rôle, désactiver un compte → journal d'audit filtré par utilisateur.
