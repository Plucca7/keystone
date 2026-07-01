/**
 * Event system — a decoupled bus for business actions.
 * Ready for future integration with webhooks or external systems.
 *
 * Usage:
 *   import { events } from '@/lib/events';
 *   events.emit('item.created', { itemId });
 *   events.on('item.created', handler);
 */

// ============================================
// EVENT TYPES
// ============================================

export interface EventMap {
  'item.created': { itemId: string }
  'item.updated': { itemId: string; fields: string[] }
  'item.deleted': { itemId: string }
  'audit.logged': { entityType: string; entityId: string; action: string }
}

export type EventName = keyof EventMap
type EventHandler<T extends EventName> = (payload: EventMap[T]) => void | Promise<void>

// ============================================
// EVENT BUS
// ============================================

class EventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handlers = new Map<string, Set<EventHandler<any>>>()

  on<T extends EventName>(event: T, handler: EventHandler<T>): () => void {
    let bucket = this.handlers.get(event)
    if (!bucket) {
      bucket = new Set()
      this.handlers.set(event, bucket)
    }
    bucket.add(handler)

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler)
    }
  }

  off<T extends EventName>(event: T, handler: EventHandler<T>): void {
    this.handlers.get(event)?.delete(handler)
  }

  async emit<T extends EventName>(event: T, payload: EventMap[T]): Promise<void> {
    const handlers = this.handlers.get(event)
    if (!handlers || handlers.size === 0) return

    const promises = Array.from(handlers).map(async (handler) => {
      try {
        await handler(payload)
      } catch (error) {
        console.error(`[events] Error in handler for "${event}":`, error)
      }
    })

    await Promise.allSettled(promises)
  }

  clear(): void {
    this.handlers.clear()
  }
}

// Singleton
export const events = new EventBus()
