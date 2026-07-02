import type { DefaultOptions } from '@tanstack/react-query'

/**
 * Central React Query cache configuration.
 *
 * Cache timing is a product decision, not a per-hook detail -- so it lives
 * here, in one place, expressed as presets per DATA VOLATILITY CLASS. A query
 * picks the preset that matches how fast its data goes stale, instead of
 * inventing ad-hoc numbers at the call site.
 *
 * Vocabulary:
 *   - staleTime: how long a cached result is served WITHOUT refetching.
 *   - gcTime:    how long an unused cache entry survives before eviction
 *                (it must be >= staleTime, or entries die while still fresh).
 */

const SECOND = 1000
const MINUTE = 60 * SECOND

export const cachePresets = {
  /**
   * Data that changes under the user's feet (live dashboards, notification
   * counters). staleTime 0 = always refetch on mount/focus; short gcTime
   * because a stale snapshot of volatile data has no reuse value.
   */
  realtime: { staleTime: 0, gcTime: 5 * MINUTE },

  /**
   * The default for regular entity data (lists, details). One minute of
   * staleness is invisible to users in CRUD screens and removes most
   * redundant refetches. This preset feeds the QueryClient defaults below.
   */
  standard: { staleTime: 1 * MINUTE, gcTime: 10 * MINUTE },

  /**
   * Slow-moving reference data (categories, settings, user profile).
   * Refetching every navigation would be waste.
   */
  stable: { staleTime: 15 * MINUTE, gcTime: 30 * MINUTE },

  /**
   * Data that only changes on deploy (feature descriptions, static option
   * lists). Infinity = never refetch within the session; invalidate
   * explicitly (via query-invalidation.ts) if it ever changes at runtime.
   */
  immutable: { staleTime: Infinity, gcTime: 60 * MINUTE },
} as const satisfies Record<string, { staleTime: number; gcTime: number }>

/**
 * Defaults applied to every query via the QueryClient in app/providers.tsx.
 * Per-query overrides pick a preset: `useQuery({ ..., ...cachePresets.stable })`.
 */
export const defaultQueryClientOptions: DefaultOptions = {
  queries: {
    ...cachePresets.standard,
    // One retry absorbs transient network blips; more than that turns a real
    // outage into a slow, confusing spinner.
    retry: 1,
  },
}
