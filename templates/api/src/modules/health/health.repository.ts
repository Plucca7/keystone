/**
 * Health repository — the data access boundary of the health module.
 *
 * Decision: the template ships with zero database dependencies, so this
 * repository reports process runtime information instead of querying a
 * database. Real data access (for example a `SELECT 1` ping through the
 * database driver) plugs in HERE, behind the same interface — the service
 * and controller above never learn where the data comes from. That is the
 * whole point of the repository layer: swapping the data source never
 * touches business logic or HTTP code.
 */

export interface RuntimeInfo {
  /** Seconds the current process has been alive. */
  uptimeSeconds: number
  /** ISO 8601 timestamp of when the info was read. */
  checkedAt: string
}

export interface HealthRepository {
  getRuntimeInfo(): RuntimeInfo
}

// Decision: a plain object (not a class) — there is no state to encapsulate,
// and an object literal satisfying the interface keeps mocking trivial in tests.
export const healthRepository: HealthRepository = {
  getRuntimeInfo(): RuntimeInfo {
    return {
      uptimeSeconds: process.uptime(),
      checkedAt: new Date().toISOString(),
    }
  },
}
