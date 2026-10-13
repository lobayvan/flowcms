#!/usr/bin/env bash
# Crée le dépôt GitHub (privé par défaut), pousse main, protège la branche
# et synchronise labels, milestones et issues depuis le backlog.
#   ./scripts/github-bootstrap.sh <owner/repo> [--public]
set -euo pipefail

REPO="${1:?Usage : $0 <owner/repo> [--public]}"
VISIBILITY="--private"; [[ "${2:-}" == "--public" ]] && VISIBILITY="--public"
cd "$(dirname "$0")/.."

gh auth status >/dev/null || { echo "✖ Exécutez d'abord : gh auth login"; exit 1; }

if gh repo view "$REPO" >/dev/null 2>&1; then
  echo "• Le dépôt $REPO existe déjà"
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
  git push -u origin main
else
  gh repo create "$REPO" $VISIBILITY --source . --remote origin --push \
    --description "CMS générique Next.js + Payload avec éditeur de flow des pages et composants"
fi

# Protection de main : PR + CI verte (ignorée si le plan GitHub ne le permet pas)
gh api --method PUT "repos/$REPO/branches/main/protection" --input - <<'JSON' >/dev/null 2>&1 \
  && echo "✔ Branche main protégée" || echo "• Protection de main non appliquée (plan GitHub ?) — à faire dans Settings > Branches"
{
  "required_status_checks": { "strict": true, "contexts": ["Backlog et configuration Claude", "Lint, types, tests"] },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 1 },
  "restrictions": null
}
JSON

gh repo edit "$REPO" --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false --delete-branch-on-merge >/dev/null
node scripts/github-sync.mjs "$REPO"

echo
echo "✔ Terminé : https://github.com/$REPO"
echo "  Tableau de suivi : créez un Project (Board) et ajoutez les issues « story » ; colonnes = labels status:*"
