import { describe, expect, it, vi } from 'vitest'

import { events } from '../events.js'

// Declaration merging is the documented way for a feature to register its
// events (see events.ts) — this test doubles as a living example of it.
declare module '../events.js' {
  interface EventMap {
    'test.fired': { n: number }
  }
}

describe('events', () => {
  it('delivers the payload to every subscribed handler', async () => {
    const first = vi.fn()
    const second = vi.fn()
    const offFirst = events.on('test.fired', first)
    const offSecond = events.on('test.fired', second)

    await events.emit('test.fired', { n: 1 })

    expect(first).toHaveBeenCalledWith({ n: 1 })
    expect(second).toHaveBeenCalledWith({ n: 1 })

    offFirst()
    offSecond()
  })

  it('stops delivering after unsubscribe', async () => {
    const handler = vi.fn()
    const off = events.on('test.fired', handler)
    off()

    await events.emit('test.fired', { n: 2 })

    expect(handler).not.toHaveBeenCalled()
  })

  it('does nothing when emitting an event nobody listens to', async () => {
    // Must not throw — emitting into the void is a normal situation
    // (a feature emits before any consumer registered).
    await expect(events.emit('test.fired', { n: 3 })).resolves.toBeUndefined()
  })

  it('isolates a failing handler: the others still run', async () => {
    // The bus logs the failure via console.error by design (fire-and-forget
    // events must never take the emitter down); silence it for the test.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const failing = vi.fn(() => {
      throw new Error('handler exploded')
    })
    const healthy = vi.fn()
    const offFailing = events.on('test.fired', failing)
    const offHealthy = events.on('test.fired', healthy)

    await events.emit('test.fired', { n: 4 })

    expect(healthy).toHaveBeenCalledWith({ n: 4 })
    expect(consoleError).toHaveBeenCalled()

    offFailing()
    offHealthy()
    consoleError.mockRestore()
  })
})
