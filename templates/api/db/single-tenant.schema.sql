-- 0001_initial_schema.sql
--
-- Foundation migration (single-tenant variant): the shared updated_at trigger
-- function and one example table ("items") that embodies the database
-- conventions of this template. New tables copy this shape.
--
-- This project serves ONE owner, so there is no tenant_id column and no row
-- level security — every row belongs to the single owner of this database.
-- Keystone generated this variant because the project was created WITHOUT
-- multi-tenant isolation. The multi-tenant variant adds tenant_id + RLS; if you
-- later need to serve multiple separate clients, add tenant_id to every table
-- and a row-level-security policy keyed on it (see the Keystone docs).
--
-- Convention: ALL database identifiers (tables, columns, functions, indexes)
-- are snake_case. Postgres folds unquoted identifiers to lowercase, so
-- camelCase would force quoting every identifier in every query forever.
-- Application code stays camelCase; the repository layer owns the mapping.
--
-- Requires Postgres 13+: gen_random_uuid() (used below) is core as of 13, so
-- no "create extension pgcrypto" is needed here.

-- Shared trigger function: keeps updated_at honest on every UPDATE.
-- Why a trigger and not application code: every write path (app, psql,
-- another service) gets the same behavior; nobody can forget to set it.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Example table. Replace "items" with your first real domain table, keeping
-- every column and comment below.
create table if not exists items (
  -- uuid over serial: primary keys are exposed in URLs and logs, and a uuid
  -- is unguessable — sequential ids leak volume and invite enumeration.
  id uuid primary key default gen_random_uuid(),

  name text not null,

  -- timestamptz, never timestamp: the server, the client, and the host may
  -- sit in different time zones; timestamptz stores an absolute instant.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Soft delete: "delete" means hide, not destroy. Rows are recoverable and
  -- auditable; every read query must filter "deleted_at is null".
  deleted_at timestamptz
);

-- Auto-maintain updated_at (see set_updated_at above).
drop trigger if exists items_set_updated_at on items;
create trigger items_set_updated_at
  before update on items
  for each row
  execute function set_updated_at();

-- Partial index on the live rows: the soft-delete filter (deleted_at is null)
-- matches every live read, keeping the index small and always usable.
create index if not exists items_alive_idx
  on items (created_at)
  where deleted_at is null;
