import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import * as api from '@/features/items/api'
import { useItems, useRenameItem } from '@/features/items/use-items'

import type { Item } from '@/features/items/api'
import type { ReactNode } from 'react'

// Exercises the worked example end to end: useItems (useQuery through the
// query-keys.ts registry) and useRenameItem (useMutation with the optimistic
// update + rollback documented in query-invalidation.ts). The HTTP layer
// (api.ts) is mocked -- this test is about the React Query wiring, not the
// fetch implementation, which src/lib/fetch.ts already owns.
vi.mock('@/features/items/api', async () => {
  const actual = await vi.importActual<typeof api>('@/features/items/api')
  return { ...actual, fetchItems: vi.fn(), renameItem: vi.fn() }
})

const sampleItems: Item[] = [
  { id: '1', name: 'Alpha', updatedAt: '2026-01-01T00:00:00.000Z', deletedAt: null },
  { id: '2', name: 'Beta', updatedAt: '2026-01-02T00:00:00.000Z', deletedAt: null },
]

// A fresh QueryClient per test avoids cross-test cache leakage; retry: false
// makes failures surface immediately instead of the default backoff-retry
// dragging out the test.
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
  return { Wrapper, queryClient }
}

describe('useItems', () => {
  beforeEach(() => {
    vi.mocked(api.fetchItems).mockReset()
  })

  it('loads items through the query-keys.ts registry key', async () => {
    vi.mocked(api.fetchItems).mockResolvedValue({ success: true, data: sampleItems })
    const { Wrapper } = createWrapper()

    const { result } = renderHook(() => useItems(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(sampleItems)
  })

  it('surfaces a Problem Detail failure as query error state', async () => {
    vi.mocked(api.fetchItems).mockResolvedValue({
      success: false,
      error: { type: 'about:blank', title: 'Server Error', status: 500, detail: 'boom' },
    })
    const { Wrapper } = createWrapper()

    const { result } = renderHook(() => useItems(), { wrapper: Wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('boom')
  })
})

describe('useRenameItem', () => {
  beforeEach(() => {
    vi.mocked(api.fetchItems).mockReset()
    vi.mocked(api.renameItem).mockReset()
  })

  it('applies the rename optimistically before the server responds', async () => {
    vi.mocked(api.fetchItems).mockResolvedValue({ success: true, data: sampleItems })
    // Never resolves during this test -- lets the assertion catch the
    // optimistic state (set in onMutate) before any server response arrives.
    vi.mocked(api.renameItem).mockReturnValue(new Promise(() => {}))
    const { Wrapper, queryClient } = createWrapper()

    const { result: itemsResult } = renderHook(() => useItems(), { wrapper: Wrapper })
    await waitFor(() => expect(itemsResult.current.isSuccess).toBe(true))

    const { result: mutationResult } = renderHook(() => useRenameItem(), { wrapper: Wrapper })
    mutationResult.current.mutate({ id: '1', name: 'Alpha (renamed)' })

    await waitFor(() => {
      const cached = queryClient.getQueryData<Item[]>(['items', 'list', {}])
      expect(cached?.find((item) => item.id === '1')?.name).toBe('Alpha (renamed)')
    })
    // The sibling item is untouched -- the optimistic update targets only
    // the mutated row, not the whole list.
    const cached = queryClient.getQueryData<Item[]>(['items', 'list', {}])
    expect(cached?.find((item) => item.id === '2')?.name).toBe('Beta')
  })

  it('rolls back the optimistic update when the server rejects the mutation', async () => {
    vi.mocked(api.fetchItems).mockResolvedValue({ success: true, data: sampleItems })
    vi.mocked(api.renameItem).mockRejectedValue(new Error('conflict'))
    const { Wrapper, queryClient } = createWrapper()

    const { result: itemsResult } = renderHook(() => useItems(), { wrapper: Wrapper })
    await waitFor(() => expect(itemsResult.current.isSuccess).toBe(true))

    const { result: mutationResult } = renderHook(() => useRenameItem(), { wrapper: Wrapper })
    mutationResult.current.mutate({ id: '1', name: 'Alpha (renamed)' })

    await waitFor(() => expect(mutationResult.current.isError).toBe(true))

    // Rollback restored the pre-mutation snapshot -- the UI never keeps
    // showing a change the server refused.
    const cached = queryClient.getQueryData<Item[]>(['items', 'list', {}])
    expect(cached?.find((item) => item.id === '1')?.name).toBe('Alpha')
  })
})
