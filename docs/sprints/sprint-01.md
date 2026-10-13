# Sprint 1 — Accès

<!-- BEGIN:GENERATED (pnpm backlog:sprints) — ne pas éditer -->
## Objectif

Chaque utilisateur ne voit et ne fait que ce que son rôle permet, sur ses seuls sites.

**Dates** : 2026-11-02 → 2026-11-13 · **Capacité** : 20 pts · **Engagé** : 20 pts · **Terminé** : 0 pts

| | ID | Story | Epic | Pts | Labels | Critères | Dépend de |
|---|---|---|---|--:|---|:-:|---|
| ⚪ | US-010 | Collection Users : rôle plateforme, rôles par site, activation | Authentification et autorisation | 3 | backend, security | 0/5 | US-003, US-005 |
| ⚪ | US-011 | Fonctions d'accès par site et matrice des rôles testée | Authentification et autorisation | 5 | backend, security | 0/4 | US-010 |
| ⚪ | US-012 | Interdire la publication aux rôles insuffisants | Authentification et autorisation | 3 | backend, security | 0/3 | US-011 |
| ⚪ | US-013 | Invitation, activation et désactivation des comptes | Authentification et autorisation | 5 | backend, ux, security | 0/4 | US-010 |
| ⚪ | US-014 | Journal d'audit | Authentification et autorisation | 3 | backend, security | 0/4 | US-010 |
| ⚪ | US-015 | Clés API pour comptes techniques | Authentification et autorisation | 1 | backend, security | 0/3 | US-010 |

## Détail des stories

### US-010 — Collection Users : rôle plateforme, rôles par site, activation

En tant que Marc, je veux attribuer un rôle différent à une personne selon le site afin de refléter les responsabilités réelles.

- [ ] Un utilisateur a un platformRole (super-admin|user) et une liste siteRoles (site, rôle)
- [ ] Les rôles par site sont viewer, author, editor, site-admin, ordonnés
- [ ] maxLoginAttempts=5, lockTime=15 min, vérification d'e-mail
- [ ] platformRole et siteRoles ne sont modifiables que selon la matrice
- [ ] Un compte active=false ne peut pas se connecter

### US-011 — Fonctions d'accès par site et matrice des rôles testée

En tant que responsable de site, je veux que chaque rôle n'accède qu'à ses sites afin de protéger les contenus de chaque client.

- [ ] Les fonctions d'accès renvoient une contrainte where sur site
- [ ] Un utilisateur du site A ne lit ni ne modifie aucun document du site B (REST, GraphQL, Local API)
- [ ] Chaque ligne de la matrice docs/architecture/auth-rbac.md a un test autorisé et un test refusé
- [ ] Couverture ≥ 80 % sur apps/cms/src/access

### US-012 — Interdire la publication aux rôles insuffisants

En tant que Hugo, je veux être certain qu'un auteur ne peut rien mettre en ligne afin que tout contenu publié ait été relu.

- [ ] Un author ou viewer ne peut pas enregistrer _status=published (API, admin, autosave)
- [ ] La table de transitions est définie dans un seul module réutilisé par l'UI
- [ ] Les tentatives refusées renvoient une erreur claire en français

### US-013 — Invitation, activation et désactivation des comptes

En tant que Marc, je veux inviter et désactiver des membres afin de gérer les accès sans partager de comptes. *(parcours J7)*

- [ ] Un site-admin invite par e-mail avec un rôle ≤ au sien ; un lien d'activation valable 72 h est envoyé
- [ ] Écran Membres (spec S5) : liste filtrable par rôle et statut
- [ ] Désactiver révoque immédiatement l'accès sans supprimer l'historique
- [ ] Renvoyer une invitation invalide la précédente

### US-014 — Journal d'audit

En tant que Marc, je veux savoir qui a fait quoi et quand afin de pouvoir expliquer toute modification.

- [ ] Création, modification, publication, suppression, changement de rôle et activation sont tracés
- [ ] Chaque entrée contient utilisateur, site, action, document, date et résumé du diff
- [ ] Le journal est en lecture seule pour tous, y compris le super-admin
- [ ] Filtre par site, utilisateur et période

### US-015 — Clés API pour comptes techniques

En tant qu'Inès, je veux une clé API dédiée à la CI afin d'automatiser l'import du flow sans compte personnel.

- [ ] useAPIKey activé ; une clé est liée à un compte technique au rôle minimal
- [ ] La procédure de rotation est documentée
- [ ] Une clé d'un compte désactivé est refusée
<!-- END:GENERATED -->

## Revue

_À compléter en fin de sprint (/sprint-review)._

## Rétrospective

_À compléter en fin de sprint._
