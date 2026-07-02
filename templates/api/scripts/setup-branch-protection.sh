#!/bin/sh
# setup-branch-protection.sh - enables GitHub branch protection on main.
#
# Local git hooks (.husky/) only protect machines that installed them; this
# script adds the SERVER-side rail so nobody -- hooks or no hooks -- pushes
# straight to main. Run it once after creating the repository.
#
# Requirements:
#   - GitHub CLI (gh) installed and authenticated: gh auth login
#   - Admin permission on the repository
#
# Usage:
#   sh scripts/setup-branch-protection.sh [owner/repo] [branch]
#   (defaults: the repo of the current directory, branch "main")

set -eu

if ! command -v gh > /dev/null 2>&1; then
  echo "ERROR: GitHub CLI (gh) not found. Install it and run: gh auth login" >&2
  exit 1
fi

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
BRANCH="${2:-main}"

echo "Enabling branch protection on $REPO ($BRANCH)..."

# Protection settings, in plain terms:
# - required_status_checks: the CI gate must pass before merging. The context
#   string must match the check name as shown on a PR; with this template's
#   ci.yml calling the reusable workflow, that name is "ci / Quality Check".
#   strict=true additionally requires the branch to be up to date with main,
#   so the merged result is exactly what CI tested.
# - required_pull_request_reviews: one approving review; stale approvals are
#   dismissed when new commits arrive, so the approval covers what merges.
# - enforce_admins: admins follow the same rules -- rules that only bind
#   non-admins are theater.
# - force pushes and deletions off: history on main is append-only.
gh api -X PUT "repos/$REPO/branches/$BRANCH/protection" \
  --input - << 'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci / Quality Check"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

echo "Branch protection enabled on $REPO ($BRANCH)."
