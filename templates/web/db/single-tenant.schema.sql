-- 0001_initial_schema.sql
--
-- Foundation migration (single-tenant variant). It establishes the database
-- conventions this project follows; later migrations copy these patterns.
-- Applied by scripts/db-migrate.sh, which tracks applied files in
-- schema_migrations.
--
-- This project serves ONE owner, so there is no tenant_id column and no row
-- level security — every row belongs to the single owner of this database.
-- Keystone generated this variant because the project was created WITHOUT
-- multi-tenant isolation. If you later need to serve multiple separate clients,
-- add tenant_id to every business table and a row-level-security policy keyed
-- on it (see the Keystone docs).
--
-- Conventions demonstrated here (each explained inline where used):
--   1. snake_case identifiers everywhere in the database
--   2. UUID primary keys via core gen_random_uuid() (PostgreSQL 13+, no extension)
--   3. created_at / updated_at timestamps, updated_at kept fresh by trigger
--   4. deleted_at soft delete (rows are marked, never destroyed)
--
-- Ordering rule: MIGRATION BEFORE CODE. The schema change ships and is applied
-- to the target database BEFORE the code that depends on it deploys.

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at honest
-- ---------------------------------------------------------------------------

-- One function reused by every table's trigger. Why a trigger instead of
-- trusting application code: every write path (app, psql session, future
-- background job) goes through the database, so the database is the only
-- place that can guarantee updated_at is always correct.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Worked example table: items
-- ---------------------------------------------------------------------------

-- Example entity (mirrors the app's worked examples in src/lib/events.ts and
-- src/lib/query-keys.ts). Replace/extend with real entities, keeping every
-- convention shown here.
--
-- Identifiers are snake_case: PostgreSQL folds unquoted identifiers to
-- lowercase, so camelCase would force quoting everywhere. TypeScript code
-- uses camelCase; the mapping happens once at the data-access layer.
CREATE TABLE IF NOT EXISTS items (
  -- UUID primary key: safe to generate anywhere (no central sequence),
  -- non-guessable in URLs, and merge-friendly across environments.
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  name text NOT NULL,

  -- Audit timestamps: timestamptz (never naive timestamp) so instants stay
  -- unambiguous across time zones.
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Soft delete: rows are marked deleted, never physically removed, so
  -- history and audits survive and accidental deletions are recoverable.
  -- NULL = alive. Application queries must filter WHERE deleted_at IS NULL.
  deleted_at timestamptz
);

-- Partial index on the live rows: every application query excludes
-- soft-deleted rows, so this index matches the real access pattern and stays
-- smaller than a full index.
CREATE INDEX IF NOT EXISTS items_alive_idx
  ON items (created_at)
  WHERE deleted_at IS NULL;

-- Attach the shared updated_at trigger.
DROP TRIGGER IF EXISTS items_set_updated_at ON items;
CREATE TRIGGER items_set_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
