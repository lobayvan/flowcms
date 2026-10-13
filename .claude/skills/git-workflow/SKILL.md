---
name: git-workflow
description: Conventions git et GitHub de FlowCMS — branches, Conventional Commits, pull requests liées aux stories, revue et fusion. À utiliser avant de créer une branche, un commit ou une PR.
---

# Git et GitHub

## Branches

- `main` protégée : PR obligatoire, CI verte, 1 revue.
- Une branche par story : `<type>/<ID>-<slug>` → `feat/US-012-vue-site-react-flow`.
- Rebase sur `main` avant fusion ; fusion en **squash**.

## Commits — Conventional Commits

```
<type>(<scope>): <résumé à l'impératif, ≤ 72 caractères>

<pourquoi, si non évident>

Refs: US-012
```

Types : `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `perf`.
Scopes : `cms`, `flow`, `blocks`, `renderer`, `flow-utils`, `scan`, `auth`, `publish`, `backlog`, `ci`.

## Pull requests

- Titre = commit de squash. Corps : template `.github/pull_request_template.md`.
- `Closes #<issue>` pour fermer l'issue GitHub de la story.
- Petites PR (< 400 lignes hors fichiers générés) ; découper sinon.
- Fichiers générés (`payload-types.ts`, migrations) dans un commit séparé.

## Interdits

- Pas de secret, `.env`, dump de base ou `flow.json` de client dans le dépôt.
- Pas de `--force` sur `main` ; pas de fusion avec CI rouge.

## Documentation

- Conventional Commits : https://www.conventionalcommits.org/fr/v1.0.0/
- GitHub CLI : https://cli.github.com/manual/
