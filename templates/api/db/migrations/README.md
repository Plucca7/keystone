# Database migrations

Plain SQL files applied strictly in filename order by `scripts/db-migrate.sh`.

## Naming convention

```
NNNN_short_description.sql
```

- `NNNN` — zero-padded sequence number (`0001`, `0002`, ...). The number IS the
  execution order; never reuse or reorder one.
- `short_description` — lowercase snake_case summary of what the migration does
  (for example `0002_add_orders_table.sql`).

## Rules

1. **Strictly ordered.** Migrations run in filename order, every environment,
   no exceptions. A migration may depend on everything before it and nothing
   after it.
2. **Applied before the code.** In every environment — local, staging,
   production — the database migrates first, then the new code deploys. Code
   that needs a column must never arrive before the column does (the deploy
   workflows encode this ordering).
3. **Never edited after being applied.** Once a migration has run anywhere
   beyond your machine, it is history. Need to change something it created?
   Write a new migration. Editing an applied file makes environments diverge
   silently, and the tracking table cannot detect it.
4. **One concern per migration.** Small, reviewable steps; a migration is the
   database-side half of the same one-branch-one-issue-one-PR unit as the code
   that needs it.

## Running

```bash
export DATABASE_URL=postgres://user:pass@host:5432/dbname
pnpm run db:migrate      # or: sh scripts/db-migrate.sh
```

The runner records applied files in a `schema_migrations` table and skips them
on the next run, so it is safe to run repeatedly.

## Conventions embodied by 0001_initial_schema.sql

Every new table copies these (the WHY is commented inline in the SQL):

- `id uuid primary key default gen_random_uuid()` — unguessable ids
- `tenant_id uuid not null` — the tenant column on every row (tenant isolation)
- `created_at` / `updated_at timestamptz not null default now()` + trigger
- `deleted_at timestamptz` — soft delete (delete means hide)
- Row Level Security with a tenant-isolation policy that fails closed
- ALL identifiers snake_case
