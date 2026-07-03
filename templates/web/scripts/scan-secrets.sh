#!/bin/sh
# scan-secrets.sh -- refuse a commit that introduces an obvious hard-coded
# secret. Runs from the husky pre-commit hook.
#
# POSIX sh on purpose: it must run identically on developer machines (macOS,
# Linux, Git Bash) and on CI runners without bash-isms. Requires only git and
# grep (POSIX ERE via grep -E), both always present where git commits happen.
#
# What it scans: the STAGED added lines only (git diff --cached). Scanning what
# is actually about to be committed -- not the whole tree -- means a secret
# already living elsewhere in history does not block every future commit, while
# a newly introduced key is caught at the moment it is added.
#
# What it catches: provider keys with a distinctive, high-signal SHAPE
# (AWS / Stripe / GitHub / OpenAI / Google / Slack / private-key blocks). This
# is format matching, not entropy analysis: it is a cheap, low-false-positive
# net for the most common leaks, NOT a guarantee that no secret can pass. The
# real hard rail is server-side secret scanning in CI plus keeping secrets in
# the environment, never in the repo (see CLAUDE.md, Guardrails / Security).
#
# Usage (normally invoked by .husky/pre-commit):
#   sh scripts/scan-secrets.sh

set -eu

# Collect the added lines across all staged changes. --cached scopes to the
# staging area; the leading '+' filter (with the '+++' file header removed)
# keeps only lines being ADDED, so deleting a line that happens to contain a
# key never trips the scanner.
added="$(git diff --cached --no-color -U0 | grep -E '^\+' | grep -Ev '^\+\+\+' || true)"

if [ -z "$added" ]; then
  # Nothing added (e.g. a pure deletion or metadata-only commit): nothing to scan.
  exit 0
fi

# One ERE alternation, each branch a provider's key SHAPE. A single combined
# pattern (rather than a loop over separate patterns) sidesteps POSIX word
# splitting -- the PEM branch contains a space, which a `for` loop would tear
# apart. Kept high-signal: a real key matches, prose about keys generally does
# not.
#   - AWS access key id:        AKIA + 16 uppercase alphanumerics
#   - Stripe live/test secret:  sk_live_ / sk_test_ + token
#   - GitHub token:             ghp_/gho_/ghu_/ghs_/ghr_ + 36 chars
#   - OpenAI secret key:        sk- + 20+ token chars
#   - Google API key:           AIza + 35 chars
#   - Slack token:              xox[baprs]- + token
#   - Private key PEM block:    -----BEGIN [...] PRIVATE KEY-----
secret_re='AKIA[0-9A-Z]{16}'
secret_re="$secret_re|sk_(live|test)_[0-9a-zA-Z]{16,}"
secret_re="$secret_re|gh[posur]_[0-9a-zA-Z]{36}"
secret_re="$secret_re|sk-[a-zA-Z0-9]{20,}"
secret_re="$secret_re|AIza[0-9A-Za-z_-]{35}"
secret_re="$secret_re|xox[baprs]-[0-9a-zA-Z-]{10,}"
secret_re="$secret_re|-----BEGIN[A-Z ]* PRIVATE KEY-----"

# -e -- so the pattern (which can start with '-' via the PEM branch reached
# through alternation) is taken as the expression, never parsed as an option.
matches="$(printf '%s\n' "$added" | grep -E -e "$secret_re" || true)"

if [ -n "$matches" ]; then
  echo "Commit blocked: a staged change looks like a hard-coded secret." >&2
  echo "Matched secret-shaped tokens:" >&2
  # Show the offending lines so the author can find and remove them. The key is
  # already in the staging area (local only, not yet committed), so echoing it
  # here does not leak it anywhere it is not already sitting. The leading '+'
  # from the diff is turned into indentation for readability.
  printf '%s\n' "$matches" | sed 's/^+/  /' >&2
  echo "" >&2
  echo "Move the secret to an environment variable (.env.local, never committed)" >&2
  echo "and read it via process.env. If this is a false positive, commit with" >&2
  echo "--no-verify -- but confirm it is genuinely not a secret first." >&2
  exit 1
fi

exit 0
