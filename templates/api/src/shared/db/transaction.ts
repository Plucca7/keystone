/**
 * Run a set of writes as ONE all-or-nothing unit of work. Either every statement inside `work`
 * commits, or — if any of them throws — the whole thing rolls back and the database is left
 * exactly as it was. This is the atomic-transaction guarantee: a multi-step change (debit one
 * row, credit another; insert a record and its line items) can never be left half-applied.
 *
 * Why a helper instead of hand-writing BEGIN/COMMIT at each call site: forgetting the ROLLBACK on
 * the error path is the classic bug — a thrown error leaves the transaction open and the next
 * statement silently runs outside it. Centralizing the pattern means the rollback can never be
 * forgotten.
 *
 * Contract: `work` receives the SAME connection wrapped in the transaction and MUST run its
 * statements through it — a statement sent on a different connection is not part of the
 * transaction and would not roll back. In production with a connection pool, acquire ONE dedicated
 * client for the unit of work (never share the pool) and pass it here; the interface below is the
 * minimum both a pooled `pg` client and an in-process driver satisfy.
 */
export interface TransactionalConnection {
  query(sql: string, params?: unknown[]): Promise<unknown>
}

export async function withTransaction<T>(
  connection: TransactionalConnection,
  work: (tx: TransactionalConnection) => Promise<T>,
): Promise<T> {
  await connection.query('BEGIN')
  try {
    const result = await work(connection)
    await connection.query('COMMIT')
    return result
  } catch (error) {
    // Roll back on ANY failure so a half-applied change never persists, then re-throw so the
    // caller still sees the original error (the rollback is a side effect, not a swallow).
    await connection.query('ROLLBACK')
    throw error
  }
}
