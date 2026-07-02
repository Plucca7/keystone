import { ItemsPanel } from '@/components/ItemsPanel'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-s6 p-s8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-text-1">App</h1>
        <p className="mt-s4 text-lg text-text-2">Next.js App Router — ready to build</p>
        <a
          href="https://nextjs.org/docs"
          className="mt-s5 inline-block text-accent underline transition-colors duration-fast hover:text-accent-hi"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js Docs
        </a>
      </div>
      {/* Worked example: React Query registry (query-keys/query-config/query-invalidation)
          wired into a real query + optimistic mutation. See src/features/items/. */}
      <div className="w-full max-w-md">
        <ItemsPanel />
      </div>
    </main>
  )
}
