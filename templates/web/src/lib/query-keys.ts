/**
 * Central query-key registry.
 *
 * EVERY React Query key used in the app MUST be declared here -- never written
 * inline at a call site. Why: query keys are the cache's addressing scheme.
 * When they are scattered as string literals, two call sites drift apart
 * ('items' vs 'item'), invalidation silently misses entries, and refactoring a
 * key means grepping the whole codebase. A single registry makes every key
 * typo-proof, typed, and greppable in one place.
 *
 * Companion modules (the ONLY entry points for query concerns):
 *   - query-config.ts       -> staleTime/gcTime presets per data volatility
 *   - query-invalidation.ts -> cross-entity invalidation helpers
 *
 * Pattern: hierarchical key factories. Each entity exposes a tree where every
 * level is a prefix of the levels below it, so invalidating a parent key
 * (e.g. `items.all`) matches every child query via React Query's default
 * prefix matching. Adding a new entity = copying the `items` block and
 * renaming.
 */

/**
 * Filters accepted by item list queries. Declared next to the key factory so
 * the key and the parameters that shape it evolve together -- a filter that is
 * not part of the key would serve stale data across filter changes.
 */
export interface ItemListFilters {
  search?: string
  page?: number
}

export const queryKeys = {
  /**
   * Worked example entity: `items` (mirrors the example entity used by the
   * event bus in events.ts). Replace/extend with your real entities, keeping
   * the same shape.
   */
  items: {
    // Root of the entity's key tree. Invalidating this wipes every item
    // query (lists and details) in one call -- the blunt instrument.
    all: ['items'] as const,

    // All list-shaped queries, regardless of filters. Invalidate this after
    // a mutation that may change which items appear in any list.
    lists: () => [...queryKeys.items.all, 'list'] as const,

    // One concrete list. The filters object is part of the key on purpose:
    // different filters are different server states and must not share a
    // cache entry.
    list: (filters: ItemListFilters) => [...queryKeys.items.lists(), filters] as const,

    // All detail-shaped queries. Kept as a level of its own so lists can be
    // invalidated without touching details (and vice versa).
    details: () => [...queryKeys.items.all, 'detail'] as const,

    // One item by id.
    detail: (id: string) => [...queryKeys.items.details(), id] as const,
  },
} as const
