import { HTTP } from '../../shared/constants/http.js'
import { AppError } from '../../shared/types/error.js'
import { ok, fail } from '../../shared/types/result.js'

import { healthRepository } from './health.repository.js'

import type { HealthRepository } from './health.repository.js'
import type { Result } from '../../shared/types/result.js'

export interface HealthStatus {
  /**
   * Decision: a single string status instead of a per-dependency map, because
   * the template has no dependencies yet. When real checks (database, queue,
   * cache) plug into the repository, extend this to a map of named checks.
   */
  status: 'ok'
  uptimeSeconds: number
  timestamp: string
}

export interface HealthService {
  getHealth(): Result<HealthStatus, AppError>
}

/**
 * Builds the health service.
 *
 * Decision: a factory with the repository injected (defaulting to the real
 * one) instead of a hard import, so unit tests swap the data source for a
 * mock without module-level patching. This is the template's reference
 * pattern for wiring service -> repository.
 *
 * @param repository - Data access boundary; defaults to the real repository.
 */
export function createHealthService(
  repository: HealthRepository = healthRepository,
): HealthService {
  return {
    /**
     * Reports service health.
     *
     * Returns a Result instead of throwing (house convention: business
     * failures are values, not exceptions). Today the only failure mode is
     * the repository itself blowing up; once a real database ping lives in
     * the repository, a failing dependency lands on the same `fail` path.
     */
    getHealth(): Result<HealthStatus, AppError> {
      try {
        const info = repository.getRuntimeInfo()
        return ok({
          status: 'ok',
          uptimeSeconds: info.uptimeSeconds,
          timestamp: info.checkedAt,
        })
      } catch {
        // Decision: the caller gets a 503-shaped error with no internal
        // detail — the real cause is for logs, never for clients.
        return fail(
          new AppError(
            HTTP.SERVICE_UNAVAILABLE,
            'https://api.example.com/errors/health-check',
            'Service Unavailable',
            'Health check failed',
          ),
        )
      }
    },
  }
}

// Default instance used by the controller; tests build their own via the factory.
export const healthService: HealthService = createHealthService()
