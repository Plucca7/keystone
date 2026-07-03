/**
 * Integration test: withTransaction is all-or-nothing, proven against a REAL Postgres (PGlite).
 *
 * This is universal — every project ships it, single-tenant or multi-tenant — so it stands up its
 * OWN tiny table rather than depending on the tenant schema (which differs between the single- and
 * multi-tenant variants). A mock could not prove BEGIN/COMMIT/ROLLBACK actually work; only a real
 * database engine does. Two properties: a successful unit commits every write, and a unit that
 * throws midway leaves NOTHING behind.
 */
import { PGlite } from '@electric-sql/pglite'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { withTransaction, type TransactionalConnection } from '../../src/shared/db/transaction.js'

describe('withTransaction — all-or-nothing (in-process Postgres via PGlite)', () => {
  let db: PGlite
  let connection: TransactionalConnection

  beforeAll(async () => {
    db = new PGlite()
    // A throwaway table independent of the app schema — this proves the transaction wrapper,
    // not any particular domain table.
    await db.exec('create table tx_demo (id serial primary key, n int not null)')
    connection = { query: (sql, params) => db.query(sql, params) }
  })

  afterAll(async () => {
    await db.close()
  })

  beforeEach(async () => {
    await db.exec('delete from tx_demo')
  })

  async function countRows(): Promise<number> {
    const { rows } = await db.query<{ c: number }>('select count(*)::int as c from tx_demo')
    return rows[0]?.c ?? -1
  }

  it('commits: every write inside the unit persists', async () => {
    await withTransaction(connection, async (tx) => {
      await tx.query('insert into tx_demo (n) values (1)')
      await tx.query('insert into tx_demo (n) values (2)')
    })

    expect(await countRows()).toBe(2)
  })

  it('rolls back: a failure midway persists nothing', async () => {
    await expect(
      withTransaction(connection, async (tx) => {
        await tx.query('insert into tx_demo (n) values (1)')
        // A later step in the same unit fails — the earlier insert must not survive.
        throw new Error('boom')
      }),
    ).rejects.toThrow('boom')

    expect(await countRows()).toBe(0)
  })
})
