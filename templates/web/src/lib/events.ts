/**
 * Event system — a decoupled bus for business actions.
 * Ready for future integration with webhooks or external systems.
 *
 * Usage:
 *   import { events } from '@/lib/events';
 *   events.emit('item.created', { itemId });
 *   events.on('item.created', handler);
 */

import { createLogger } from './logger'

// All product code logs through the central logger (lib/logger.ts) -- never
// raw console.*. The logger owns formatting (structured JSON in prod) and is
// the single point to wire an ingestion service later.
const log = createLogger('events')

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
        // A failing handler must not break the emitter or its siblings, so the
        // error is logged and swallowed here (see Promise.allSettled below).
        log.error(`Handler failed for event "${event}"`, {
          error: error instanceof Error ? error.message : String(error),
        })
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
