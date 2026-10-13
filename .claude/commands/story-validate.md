---
description: Valide une story en review (sécurité si nécessaire, puis QA critère par critère) et la passe en done ou la renvoie
argument-hint: <ID de la story>
---

Valide la story **$ARGUMENTS**.

1. Vérifie qu'elle est en statut `review` ; sinon arrête-toi.
2. Si elle a le label `security`, délègue d'abord à l'agent `security-reviewer`. Un verdict `BLOQUANT`
   renvoie la story en `in-progress` avec les constats en note : `pnpm backlog:move $ARGUMENTS in-progress --note "…"`.
3. Délègue la validation à l'agent `qa-validator`, qui décide `done` ou `in-progress`.
4. Affiche son rapport (critère → test → verdict) et le nouveau statut.
