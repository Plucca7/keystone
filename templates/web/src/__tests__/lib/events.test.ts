import { describe, it, expect, vi } from 'vitest'
import { events } from '../../lib/events'

// The event bus carries real logic (subscribe, emit, unsubscribe, error isolation),
// so it ships with its own test — the pattern a generated project follows for its code.
describe('event bus', () => {
  it('delivers an emitted event to a subscribed handler', async () => {
    const handler = vi.fn()
    events.on('item.created', handler)
    await events.emit('item.created', { itemId: 'a1' })
    expect(handler).toHaveBeenCalledWith({ itemId: 'a1' })
    events.clear()
  })

  it('stops delivering after unsubscribe', async () => {
    const handler = vi.fn()
    const off = events.on('item.created', handler)
    off()
    await events.emit('item.created', { itemId: 'a1' })
    expect(handler).not.toHaveBeenCalled()
    events.clear()
  })

  it('emitting an event with no handlers is a no-op', async () => {
    await expect(events.emit('item.deleted', { itemId: 'x' })).resolves.toBeUndefined()
  })

  it('an error in one handler does not stop the others', async () => {
    const bad = vi.fn(() => {
      throw new Error('boom')
    })
    const good = vi.fn()
    events.on('item.updated', bad)
    events.on('item.updated', good)
    await events.emit('item.updated', { itemId: 'a1', fields: ['name'] })
    expect(good).toHaveBeenCalled()
    events.clear()
  })
})
