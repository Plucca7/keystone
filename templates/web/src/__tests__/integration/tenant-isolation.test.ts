/**
 * Integration test: tenant isolation via Row Level Security.
 *
 * Layer 3 of the test pyramid (CLAUDE.md, e2e/README.md). Runs against a
 * REAL Postgres, not a mock: a mocked repository would happily "pass" a
 * query the real database rejects, and no mock exercises an actual RLS
 * policy -- mocks lie about SQL and about security. This test proves the
 * policy in db/migrations/0001_initial_schema.sql actually blocks
 * cross-tenant reads and writes at the database level, independent of
 * anything application code remembers to do.
 *
 * Decision: skips cleanly when DATABASE_URL is unset (describe.skipIf).
 * `pnpm test` must stay green on a laptop or CI runner with no Postgres
 * available; this layer only activates where a real database is wired in
 * (see db/migrations/README.md and scripts/db-migrate.sh).
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Client } from 'pg'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIGRATION_PATH = join(
  __dirname,
  '..',
  '..',
  '..',
  'db',
  'migrations',
  '0001_initial_schema.sql',
)

// Two arbitrary but fixed tenant ids: fixed (not random per run) so a failed
// assertion always reproduces the same rows if inspected manually.
const TENANT_A = '11111111-1111-1111-1111-111111111111'
const TENANT_B = '22222222-2222-2222-2222-222222222222'

/**
 * Sets the RLS session variable for the current connection, mirroring what
 * the application does per-request in production (see the policy comment in
 * 0001_initial_schema.sql). The `false` third argument (not "is_local")
 * scopes the setting to the SESSION rather than the transaction, matching
 * how this standalone script -- which does not wrap each query in an
 * explicit transaction -- needs the setting to persist across statements.
 */
async function setTenant(client: Client, tenantId: string | null): Promise<void> {
  await client.query('select set_config($1, $2, false)', ['app.tenant_id', tenantId ?? ''])
}

describe.skipIf(!process.env.DATABASE_URL)('tenant isolation (RLS)', () => {
  let client: Client

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- guarded by describe.skipIf above
    client = new Client({ connectionString: process.env.DATABASE_URL! })
    await client.connect()

    // Run the real migration so this test proves the actual shipped policy,
    // not a hand-written approximation of it. Idempotent (create/alter ...
    // if not exists, drop policy if exists) so re-running against an
    // already-migrated database is safe.
    const migrationSql = readFileSync(MIGRATION_PATH, 'utf8')
    await client.query(migrationSql)

    // Clean slate: delete any leftover rows from a previous run under the
    // same fixed tenant ids. Force row level security is on, so cleanup
    // goes through the same tenant-scoped path as the rest of the test
    // rather than assuming a superuser bypass.
    await setTenant(client, TENANT_A)
    await client.query('delete from items where tenant_id = $1', [TENANT_A])
    await setTenant(client, TENANT_B)
    await client.query('delete from items where tenant_id = $1', [TENANT_B])
  })

  afterAll(async () => {
    await client?.end()
  })

  it('a session scoped to tenant A cannot read rows written by tenant B', async () => {
    await setTenant(client, TENANT_A)
    await client.query('insert into items (tenant_id, name) values ($1, $2)', [
      TENANT_A,
      'tenant-a-item',
    ])

    await setTenant(client, TENANT_B)
    await client.query('insert into items (tenant_id, name) values ($1, $2)', [
      TENANT_B,
      'tenant-b-item',
    ])

    // Still scoped to tenant B: a plain "select * from items" (no WHERE
    // tenant_id clause at all) must return ONLY tenant B's row. If the
    // policy were missing or misconfigured, this would return both rows.
    const result = await client.query('select name, tenant_id from items')

    expect(result.rows).toHaveLength(1)
    expect(result.rows[0]).toMatchObject({ name: 'tenant-b-item', tenant_id: TENANT_B })
  })

  it('a session with no tenant set sees zero rows, never everything', async () => {
    // No set_config call for app.tenant_id at all in this test -- simulates
    // a request that forgot to set the tenant. nullif(current_setting(...),
    // '') must resolve to NULL, and the policy's NULL comparison must match
    // zero rows: the fail-closed guarantee this migration exists to provide.
    await setTenant(client, null)

    const result = await client.query('select * from items')

    expect(result.rows).toHaveLength(0)
  })

  it('a write attempted for another tenant is rejected by the WITH CHECK clause', async () => {
    await setTenant(client, TENANT_A)

    // Attempts to insert a row tagged with TENANT_B while the session is
    // scoped to TENANT_A. The policy's WITH CHECK clause (not just USING)
    // is what blocks this -- USING alone would only filter reads.
    await expect(
      client.query('insert into items (tenant_id, name) values ($1, $2)', [
        TENANT_B,
        'cross-tenant-write-attempt',
      ]),
    ).rejects.toThrow(/row-level security/i)
  })
})
