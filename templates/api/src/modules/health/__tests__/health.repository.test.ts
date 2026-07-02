import { describe, expect, it } from 'vitest'

import { healthRepository } from '../health.repository.js'

describe('healthRepository', () => {
  it('reports process uptime as a positive number', () => {
    const info = healthRepository.getRuntimeInfo()

    expect(info.uptimeSeconds).toBeGreaterThan(0)
  })

  it('reports the check moment as a valid ISO 8601 timestamp', () => {
    const info = healthRepository.getRuntimeInfo()

    // Round-tripping through Date proves the string is parseable, not just
    // shaped like a date.
    expect(new Date(info.checkedAt).toISOString()).toBe(info.checkedAt)
  })
})
