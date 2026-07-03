#!/bin/sh
# setup-branch-protection.sh -- configure server-side branch protection via the
# GitHub API. Run once per repository (and again whenever the policy changes).
#
# Why this exists: the husky hooks (.husky/pre-commit, .husky/pre-push) are
# LOCAL guards -- anyone can bypass them with --no-verify or a fresh clone.
# Server-side protection is the rail that cannot be skipped: GitHub itself
# refuses direct pushes, force pushes, and unreviewed merges.
#
# Requirements: gh CLI authenticated with admin rights on the repository.
#
# Usage:
#   sh scripts/setup-branch-protection.sh              # repo inferred from the current directory
#   sh scripts/setup-branch-protection.sh owner/repo   # explicit target

set -eu

if ! command -v gh >/dev/null 2>&1; then
  echo "setup-branch-protection: gh CLI not found. Install https://cli.github.com/ and run 'gh auth login'." >&2
  exit 1
fi

# Accept the repo as an argument for CI/scripted use; otherwise infer it from
# the git remote of the current directory.
REPO="${1:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"
if [ -z "$REPO" ]; then
  echo "setup-branch-protection: could not determine the repository. Pass it explicitly: owner/repo" >&2
  exit 1
fi

echo "setup-branch-protection: configuring $REPO"

# NOTE on required status check contexts: for a job that calls a reusable
# workflow, GitHub names the check "<caller job id> / <called job name>".
# This template's CI (.github/workflows/ci.yml, job id "ci") calls
# _ci-reusable.yml (job "Quality Check"), so the context below is
# "ci / Quality Check". If you rename either job, update this list -- the
# exact names are visible in any PR's checks tab.
CHECKS='["ci / Quality Check"]'

# --- main: the production branch -------------------------------------------
# Strictest tier. A change reaches main only through a PR that is up to date
# with the base (strict: true), reviewed by at least one human, green on CI,
# and with every review conversation resolved. Admins included: a rail with a
# VIP lane is not a rail.
gh api --method PUT "repos/$REPO/branches/main/protection" --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": $CHECKS
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
EOF
echo "setup-branch-protection: main protected"

# --- develop: the staging branch --------------------------------------------
# Same no-direct-push / no-force-push / green-CI rules, but no mandatory human
# approval: develop is the integration branch and small teams merge there at a
# pace where a required review would push people toward rubber-stamping.
# Review rigor is spent where it matters -- the promotion to main.
gh api --method PUT "repos/$REPO/branches/develop/protection" --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": $CHECKS
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
EOF
echo "setup-branch-protection: develop protected"

echo "setup-branch-protection: done"
