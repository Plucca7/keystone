import { useEffect, useState } from 'react'

/**
 * Hook to check whether the component is mounted (client-side).
 * Useful to avoid hydration mismatches with Server Components.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
