---
name: access-control
description: Authentification, autorisation par rôle et par site, gestion des comptes (invitation, désactivation, clés API) et audit dans FlowCMS. À utiliser dès qu'on écrit une fonction access, un rôle, un hook de transition de workflow ou qu'on touche à la collection users.
---

# Authentification, autorisation, comptes

Référence projet : `docs/architecture/auth-rbac.md` (matrice des rôles = source de vérité).

## Implémentation

- Fonctions d'accès dans `apps/cms/src/access/`, une par intention : `isSuperAdmin`,
  `hasSiteRole(min)`, `canEditDoc`, `canPublish`, `isSelf`.
- Les rôles sont **ordonnés** : `viewer < author < editor < site-admin`. Comparer avec
  `roleRank(role) >= roleRank(min)`, jamais par égalité de chaînes dispersées.
- Une fonction dépendant du site renvoie une **contrainte `where`** :

```ts
export const hasSiteRole = (min: SiteRole): Access => ({ req: { user } }) => {
  if (!user?.active) return false
  if (user.platformRole === 'super-admin') return true
  const sites = user.siteRoles.filter((r) => roleRank(r.role) >= roleRank(min)).map((r) => idOf(r.site))
  return sites.length ? { site: { in: sites } } : false
}
```

- Publication : hook `beforeChange` qui refuse `_status: 'published'` et les transitions de
  `workflowStatus` non permises pour le rôle sur **le site du document**.
- Champs sensibles (`platformRole`, `siteRoles`, `active`) : `access.update` au niveau du champ.
- Un site-admin ne peut attribuer que des rôles ≤ au sien, et seulement sur ses sites.

## Comptes

- Invitation : création `active: false` + jeton d'activation (72 h) envoyé par e-mail.
- Désactivation plutôt que suppression ; `delete` réservé au super-admin et bloqué si l'utilisateur
  a des entrées d'audit.
- Clés API : un compte technique par usage, rôle minimal, rotation documentée.
- Tout changement de rôle, d'activation ou de publication écrit une ligne `audit-log`.

## Checklist avant PR

- [ ] Chaque collection a ses 4 accès explicites.
- [ ] Tests d'accès pour chaque rôle de la matrice (au moins un cas autorisé, un refusé).
- [ ] Un utilisateur d'un site A ne voit aucun document du site B (liste, findByID, GraphQL).
- [ ] Un compte `active: false` est refusé partout.
- [ ] Appels Local API au nom d'un utilisateur avec `overrideAccess: false`.

## Documentation

- Access control : https://payloadcms.com/docs/access-control/overview
- Authentification : https://payloadcms.com/docs/authentication/overview
- Clés API : https://payloadcms.com/docs/authentication/api-keys
- OWASP ASVS (contrôle d'accès, sessions) : https://owasp.org/www-project-application-security-verification-standard/
