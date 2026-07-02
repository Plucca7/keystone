import { describe, it, expect } from 'vitest'

import { canArchiveItem, ARCHIVE_INACTIVITY_DAYS } from '../../../features/items/archive-policy'

// Business-rule layer of the pyramid: pure function in, decision out.
// No mocks, no framework, no I/O -- time itself is an argument. This test is
// the model to imitate whenever a feature ships a domain rule.
describe('archive policy', () => {
  // Fixed reference instant so every assertion is deterministic. Never use
  // the real clock in business-rule tests: "now" must be data.
  const now = new Date('2026-06-30T12:00:00.000Z')

  const daysBefore = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()

  it('allows archiving an item idle for longer than the inactivity window', () => {
    const decision = canArchiveItem(
      { updatedAt: daysBefore(ARCHIVE_INACTIVITY_DAYS + 1), deletedAt: null },
      now,
    )
    expect(decision).toEqual({ allowed: true })
  })

  it('allows archiving exactly at the inactivity boundary (>= threshold qualifies)', () => {
    // Pins the boundary decision documented in the rule: exactly 30 idle days
    // is enough. If someone flips < to <=, this test catches it.
    const decision = canArchiveItem(
      { updatedAt: daysBefore(ARCHIVE_INACTIVITY_DAYS), deletedAt: null },
      now,
    )
    expect(decision.allowed).toBe(true)
  })

  it('blocks archiving an item updated inside the inactivity window, with a reason', () => {
    const decision = canArchiveItem({ updatedAt: daysBefore(1), deletedAt: null }, now)
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toContain('still considered active')
  })

  it('blocks archiving a soft-deleted item even when idle long enough', () => {
    // Rule order matters: deletion outranks inactivity, so the reason must be
    // about deletion, not activity.
    const decision = canArchiveItem(
      { updatedAt: daysBefore(ARCHIVE_INACTIVITY_DAYS + 10), deletedAt: daysBefore(5) },
      now,
    )
    expect(decision.allowed).toBe(false)
    expect(decision.reason).toContain('deleted')
  })
})
