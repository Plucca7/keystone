// Why: the EventMap starts empty in the template; each feature should extend it
// via declaration merging (interface EventMap { 'user.created': UserCreatedPayload })
// to register its events.
export interface EventMap {
  // Example (uncomment in real features):
  // 'health.checked': { timestamp: number }
}

export type EventName = keyof EventMap

type EventHandler<T extends EventName> = (payload: EventMap[T]) => void | Promise<void>

// Why: we store handlers as `EventHandler<EventName>` (not `any`) in the Map
// and cast at the read points, because the Map loses the relationship between
// key and payload type. The public contract (`on`/`emit`) preserves per-event
// inference.
class EventBus {
  private handlers = new Map<EventName, Set<EventHandler<EventName>>>()

  on<T extends EventName>(event: T, handler: EventHandler<T>): () => void {
    let bucket = this.handlers.get(event)
    if (!bucket) {
      bucket = new Set()
      this.handlers.set(event, bucket)
    }
    bucket.add(handler as EventHandler<EventName>)
    return () => {
      this.handlers.get(event)?.delete(handler as EventHandler<EventName>)
    }
  }

  async emit<T extends EventName>(event: T, payload: EventMap[T]): Promise<void> {
    const handlers = this.handlers.get(event)
    if (!handlers) return
    await Promise.allSettled(
      Array.from(handlers).map(async (h) => {
        try {
          await (h as EventHandler<T>)(payload)
        } catch (e) {
          console.error('[events] handler failed', { event, error: e })
        }
      }),
    )
  }
}

export const events = new EventBus()
