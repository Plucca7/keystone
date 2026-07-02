#!/bin/sh
# db-migrate.sh -- apply pending SQL migrations from db/migrations/, in order.
#
# POSIX sh on purpose: it must run identically on developer machines (macOS,
# Linux, Git Bash) and on CI runners without bash-isms. Requires only psql.
#
# Tracking: a schema_migrations table records each applied filename. The
# script is idempotent -- already-applied files are skipped -- so deploys can
# run it unconditionally on every release.
#
# Usage:
#   DATABASE_URL=postgres://user:pass@host:5432/db sh scripts/db-migrate.sh

set -eu

# Fail fast without DATABASE_URL: applying migrations to whatever database a
# stray environment points at is exactly the accident this guard prevents.
if [ -z "${DATABASE_URL:-}" ]; then
  echo "db-migrate: DATABASE_URL is not set. Refusing to guess a target database." >&2
  echo "db-migrate: usage: DATABASE_URL=postgres://... sh scripts/db-migrate.sh" >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "db-migrate: psql not found on PATH. Install the PostgreSQL client tools." >&2
  exit 1
fi

# Resolve the migrations directory relative to this script, so the script
# works no matter which directory it is invoked from.
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
MIGRATIONS_DIR="$SCRIPT_DIR/../db/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "db-migrate: migrations directory not found: $MIGRATIONS_DIR" >&2
  exit 1
fi

# The tracking table lives with the data it describes. filename is the natural
# key: migrations are append-only and never renamed once applied.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "
  CREATE TABLE IF NOT EXISTS schema_migrations (
    filename   text        PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  );
"

applied_count=0

# Glob expansion sorts lexicographically, and the zero-padded NNNN_ prefix
# makes lexicographic order equal migration order -- no extra sort needed.
for file in "$MIGRATIONS_DIR"/[0-9][0-9][0-9][0-9]_*.sql; do
  # When the glob matches nothing, POSIX sh leaves the literal pattern in
  # $file; this guard turns that into a clean no-op instead of a psql error.
  [ -e "$file" ] || continue

  name=$(basename "$file")

  already=$(psql "$DATABASE_URL" -tA -v ON_ERROR_STOP=1 \
    -c "SELECT 1 FROM schema_migrations WHERE filename = '$name'")
  if [ "$already" = "1" ]; then
    echo "db-migrate: skip  $name (already applied)"
    continue
  fi

  echo "db-migrate: apply $name"

  # Migration + its tracking record in ONE transaction: if the migration
  # fails, nothing is recorded; if the record fails, the migration rolls
  # back. Either way the database and the ledger never disagree.
  {
    echo "BEGIN;"
    cat "$file"
    echo ";"
    echo "INSERT INTO schema_migrations (filename) VALUES ('$name');"
    echo "COMMIT;"
  } | psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q

  applied_count=$((applied_count + 1))
done

echo "db-migrate: done ($applied_count applied)"
