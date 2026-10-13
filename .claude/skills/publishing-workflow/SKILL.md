---
name: publishing-workflow
description: Workflow éditorial (brouillon, relecture, approbation), planification de publication, releases groupées atomiques, revalidation des sites et retour arrière. À utiliser pour workflowStatus, schedulePublish, la collection releases, la jobs queue Payload et les webhooks de revalidation.
---

# Édition et publication

Source de vérité : `docs/architecture/publishing.md`.

## Règles

1. `workflowStatus` et `_status` restent cohérents : `published` ⇔ dernière version publiée existe.
   Une table de transitions unique dans `apps/cms/src/workflow/transitions.ts` (rôle minimal par
   transition) est utilisée par le hook ET par l'UI.
2. **Planification simple** : `schedulePublish` natif de Payload. Ne pas réinventer.
3. **Releases** : tâche `publishRelease` ; toutes les publications dans **une transaction**
   (`payload.db.beginTransaction()` / `commitTransaction` / `rollbackTransaction`), avec `req`
   transmis à chaque opération.
4. Les jobs sont **idempotents** : une release déjà `published` n'est pas republiée.
5. Le worker de jobs tourne dans un process séparé en production :
   `payload jobs:run --cron "* * * * *" --handle-schedules`.
6. **Revalidation** après publication : POST signé (`REVALIDATE_SECRET`, HMAC du corps) vers
   `site.revalidateUrl` avec les tags `page:<id>`, `menu:<location>`, `fragment:<id>`. Échec →
   nouvelle tentative (3, backoff) puis alerte.
7. Les dates sont stockées en UTC et affichées dans le fuseau de l'utilisateur.

## Validation avant planification d'une release

- Aucun lien vers une page non publiée hors de la release.
- Aucun slug en conflit avec une page publiée.
- L'utilisateur a `canPublish` sur le site de chaque document.

## Tests attendus

- Transitions autorisées / refusées pour chaque rôle.
- Release : succès complet ; échec d'un document → rien n'est publié.
- Job exécuté deux fois → un seul effet.
- Annulation de release → versions précédentes restaurées.

## Documentation

- Brouillons et planification : https://payloadcms.com/docs/versions/drafts
- Jobs queue : https://payloadcms.com/docs/jobs-queue/overview
- Transactions : https://payloadcms.com/docs/database/transactions
- Revalidation Next.js : https://nextjs.org/docs/app/api-reference/functions/revalidateTag
- Live Preview : https://payloadcms.com/docs/live-preview/overview
