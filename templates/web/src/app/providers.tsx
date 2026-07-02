'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { defaultQueryClientOptions } from '@/lib/query-config'

import type { ReactNode } from 'react'

/**
 * Client-side providers wrapper.
 * React Query handles client-side caching and polling.
 *
 * Cache defaults come from the central registry (lib/query-config.ts) -- the
 * provider only instantiates the client. Timing decisions never live here, so
 * there is exactly one place to tune cache behavior.
 */
export function Providers({ children }: { children: ReactNode }) {
  // useState initializer keeps a single QueryClient instance across re-renders
  // without recreating the cache (a new client per render would wipe it).
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: defaultQueryClientOptions }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
