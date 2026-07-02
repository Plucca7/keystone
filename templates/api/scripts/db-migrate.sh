#!/bin/sh
# db-migrate.sh - applies db/migrations/NNNN_*.sql in filename order via psql.
#
# The glob below only matches the documented NNNN_short_description.sql
# convention (db/migrations/README.md) - a stray non-migration file dropped
# in the folder (README.md, a .sql scratch file without the numeric prefix)
# is silently skipped instead of being picked up and "applied" by accident.
#
# Idempotent: applied filenames are recorded in a schema_migrations table and
# skipped on subsequent runs, so this script is safe to run on every deploy.
#
# POSIX sh on purpose: this must run identically on a developer laptop, a CI
# runner, and a bare container without bash installed.
#
# Usage:
#   DATABASE_URL=postgres://user:pass@host:5432/db sh scripts/db-migrate.sh

set -eu

# Fail fast with a human-readable message: a missing DATABASE_URL otherwise
# surfaces as a cryptic psql connection error deep in the loop.
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set." >&2
  echo "Set it to a Postgres connection string, e.g.:" >&2
  echo "  export DATABASE_URL=postgres://user:pass@host:5432/dbname" >&2
  exit 1
fi

if ! command -v psql > /dev/null 2>&1; then
  echo "ERROR: psql not found on PATH. Install the Postgres client tools." >&2
  exit 1
fi

# Resolve the migrations directory relative to this script, so the script
# works no matter which directory it is invoked from.
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
MIGRATIONS_DIR="$SCRIPT_DIR/../db/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "ERROR: migrations directory not found: $MIGRATIONS_DIR" >&2
  exit 1
fi

# Tracking table. "filename" as the primary key keeps the model dead simple:
# a file is either applied (row exists) or not.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "
  create table if not exists schema_migrations (
    filename   text primary key,
    applied_at timestamptz not null default now()
  );
"

applied_count=0
skipped_count=0

# POSIX glob expansion sorts lexicographically, which is exactly the NNNN_
# ordering convention - no extra sort needed. The [0-9][0-9][0-9][0-9]_
# prefix restricts the match to the documented naming convention (see the
# header comment above and db/migrations/README.md).
for file in "$MIGRATIONS_DIR"/[0-9][0-9][0-9][0-9]_*.sql; do
  # When the glob matches nothing, sh leaves the pattern literal.
  if [ ! -e "$file" ]; then
    echo "No migration files found in $MIGRATIONS_DIR - nothing to do."
    exit 0
  fi

  name=$(basename "$file")

  already=$(psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -tA \
    -c "select 1 from schema_migrations where filename = '$name'")

  if [ "$already" = "1" ]; then
    echo "SKIP  $name (already applied)"
    skipped_count=$((skipped_count + 1))
    continue
  fi

  echo "APPLY $name"
  # --single-transaction wraps the file AND the tracking insert in ONE
  # transaction: either the migration applies and is recorded, or neither
  # happens. A crash can never leave an applied-but-unrecorded migration.
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 --single-transaction \
    -f "$file" \
    -c "insert into schema_migrations (filename) values ('$name')"

  applied_count=$((applied_count + 1))
done

echo "Done. Applied: $applied_count, skipped: $skipped_count."
