import { queryKeys } from './query-keys'

import type { QueryClient } from '@tanstack/react-query'

/**
 * Central cross-entity invalidation helpers.
 *
 * Mutations NEVER call `queryClient.invalidateQueries` with an inline key --
 * they invalidate through these helpers. Why: which caches a mutation must
 * refresh is domain knowledge ("creating an item changes every item list";
 * later, maybe "and the dashboard counters too"). Centralizing it means that
 * when a new dependent cache appears, ONE helper changes and every mutation
 * that goes through it is correct -- instead of hunting down each mutation's
 * private invalidation list.
 *
 * The helpers take the QueryClient as an argument (instead of importing a
 * singleton) so they work in components (`useQueryClient()`), tests, and any
 * future non-React context.
 */

/**
 * After creating or deleting an item: every list may have changed (the item
 * appears in / disappears from result sets), so invalidate all list queries.
 * Detail queries of OTHER items are untouched on purpose -- they are still
 * valid, and refetching them would be wasted bandwidth.
 */
export function invalidateItemLists(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: queryKeys.items.lists() })
}

/**
 * After updating one item: its detail cache is stale, and any list showing it
 * may render stale fields -- so both are invalidated together. This pairing is
 * exactly the kind of cross-entity knowledge this module exists to own.
 */
export async function invalidateItem(queryClient: QueryClient, itemId: string): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.items.detail(itemId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.items.lists() }),
  ])
}

/**
 * Nuclear option: wipe every item query. For rare events that change
 * everything at once (tenant switch, bulk import).
 */
export function invalidateAllItems(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: queryKeys.items.all })
}

/*
 * ---------------------------------------------------------------------------
 * Worked example: mutation with OPTIMISTIC UPDATE + ROLLBACK.
 *
 * The standard pattern for mutations: apply the change to the cache immediately
 * (the UI feels instant), keep a snapshot to roll back on error, and settle by
 * invalidating through the helpers above so the server state wins in the end.
 *
 *   import { useMutation, useQueryClient } from '@tanstack/react-query'
 *   import { queryKeys } from '@/lib/query-keys'
 *   import { invalidateItem } from '@/lib/query-invalidation'
 *
 *   function useRenameItem(itemId: string) {
 *     const queryClient = useQueryClient()
 *     return useMutation({
 *       mutationFn: (name: string) => api.renameItem(itemId, name),
 *
 *       onMutate: async (name) => {
 *         // Cancel in-flight fetches so a late response does not overwrite
 *         // the optimistic value.
 *         await queryClient.cancelQueries({ queryKey: queryKeys.items.detail(itemId) })
 *         // Snapshot BEFORE mutating the cache -- this is the rollback point.
 *         const previous = queryClient.getQueryData(queryKeys.items.detail(itemId))
 *         queryClient.setQueryData(queryKeys.items.detail(itemId), (old: Item | undefined) =>
 *           old ? { ...old, name } : old,
 *         )
 *         return { previous }
 *       },
 *
 *       onError: (_err, _name, context) => {
 *         // Server rejected: restore the snapshot so the UI never lies.
 *         queryClient.setQueryData(queryKeys.items.detail(itemId), context?.previous)
 *       },
 *
 *       onSettled: () => {
 *         // Success or failure, re-sync with the server through the central
 *         // helper -- never with an inline key.
 *         void invalidateItem(queryClient, itemId)
 *       },
 *     })
 *   }
 * ---------------------------------------------------------------------------
 */
