import { describe, expect, it } from 'vitest'

import { HTTP } from '../../../shared/constants/http.js'
import { createHealthService } from '../health.service.js'

import type { HealthRepository } from '../health.repository.js'

// Unit test: the repository is replaced by an in-memory fake, so these tests
// exercise ONLY the service's business logic — no process state, no clock.
describe('healthService', () => {
  it('returns ok with the runtime info mapped to the health shape', () => {
    const fakeRepository: HealthRepository = {
      getRuntimeInfo: () => ({ uptimeSeconds: 42, checkedAt: '2026-01-01T00:00:00.000Z' }),
    }
    const service = createHealthService(fakeRepository)

    const result = service.getHealth()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({
        status: 'ok',
        uptimeSeconds: 42,
        timestamp: '2026-01-01T00:00:00.000Z',
      })
    }
  })

  it('returns fail with a 503 error when the data source blows up', () => {
    const brokenRepository: HealthRepository = {
      getRuntimeInfo: () => {
        throw new Error('data source down')
      },
    }
    const service = createHealthService(brokenRepository)

    const result = service.getHealth()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.status).toBe(HTTP.SERVICE_UNAVAILABLE)
      // The error handed to the transport layer must not leak the internal
      // cause ('data source down') — clients get a generic detail.
      expect(result.error.detail).toBe('Health check failed')
    }
  })

  it('uses the real repository by default', () => {
    // Guards the factory's default wiring — a regression here would ship a
    // service with no data source.
    const service = createHealthService()

    const result = service.getHealth()

    expect(result.success).toBe(true)
  })
})
