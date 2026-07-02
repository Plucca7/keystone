import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchItems, renameItem, type Item } from './api'

import { cachePresets } from '@/lib/query-config'
import { invalidateItemLists } from '@/lib/query-invalidation'
import { queryKeys } from '@/lib/query-keys'

/**
 * Worked example: the React Query registry (query-keys.ts, query-config.ts,
 * query-invalidation.ts) wired into a real, running hook pair. This is the
 * pattern every feature hook should copy -- never call useQuery/useMutation
 * with an inline key or an inline invalidateQueries call.
 */

/**
 * Lists items. staleTime/gcTime come from the `standard` preset -- item lists
 * are regular CRUD data, not realtime and not immutable.
 */
export function useItems() {
  return useQuery({
    queryKey: queryKeys.items.list({}),
    queryFn: async () => {
      const result = await fetchItems()
      // apiFetch returns a Result instead of throwing; React Query's error
      // state needs a thrown error, so the boundary between the two
      // conventions is right here, in the queryFn.
      if (!result.success) throw new Error(result.error.detail)
      return result.data
    },
    ...cachePresets.standard,
  })
}

/**
 * Renames an item with an OPTIMISTIC UPDATE and ROLLBACK -- the pattern
 * documented in query-invalidation.ts, made concrete. The list is updated in
 * the cache immediately (instant UI feedback); on failure the snapshot taken
 * in onMutate restores the previous list so the UI never shows a lie.
 */
export function useRenameItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameItem(id, name),

    onMutate: async ({ id, name }) => {
      const listKey = queryKeys.items.list({})

      // Cancel in-flight fetches so a late response cannot overwrite the
      // optimistic value applied below.
      await queryClient.cancelQueries({ queryKey: listKey })

      // Snapshot BEFORE mutating the cache -- this is the rollback point if
      // the server rejects the mutation.
      const previousItems = queryClient.getQueryData<Item[]>(listKey)

      queryClient.setQueryData<Item[]>(listKey, (old) =>
        old?.map((item) => (item.id === id ? { ...item, name } : item)),
      )

      return { previousItems, listKey }
    },

    onError: (_err, _variables, context) => {
      // Server rejected the rename: restore the snapshot so the list goes
      // back to matching reality instead of the optimistic guess.
      if (context) {
        queryClient.setQueryData(context.listKey, context.previousItems)
      }
    },

    onSettled: () => {
      // Success or failure, re-sync with the server through the central
      // invalidation helper -- never an inline queryClient.invalidateQueries
      // call at the mutation site.
      void invalidateItemLists(queryClient)
    },
  })
}
