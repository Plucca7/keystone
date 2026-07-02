import { fileURLToPath } from 'node:url'

import { defineConfig, configDefaults } from 'vitest/config'

/**
 * Vitest config.
 *
 * Playwright E2E lives in e2e/ and runs separately (pnpm test:e2e). Without
 * excluding it here, Vitest tries to interpret specs using Playwright's
 * test.describe (incompatible) and breaks `pnpm test`.
 */
export default defineConfig({
  // tsconfig sets "jsx": "preserve" because Next's own compiler owns the JSX
  // transform in the app build. Vitest runs on Vite/esbuild instead, which
  // has no such downstream step, so it needs an explicit transform here --
  // "automatic" auto-imports the JSX runtime instead of requiring `import
  // React` in every test file.
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: {
      // Mirrors the "@/*" -> "./src/*" path mapping in tsconfig.json.
      // TypeScript's `paths` is a type-checker-only construct -- it does not
      // rewrite imports at runtime, so Vite (which Vitest runs on) needs its
      // own alias or every "@/..." import fails to resolve during tests.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // jsdom: hook tests (e.g. use-items.test.ts) render through
    // @testing-library/react's renderHook, which mounts via react-dom/client
    // and needs a `document` -- plain Node has none. Pure business-rule
    // tests (archive-policy.test.ts) do not need it, but a single global
    // environment is simpler than annotating files individually, and jsdom
    // has no meaningful runtime cost for logic-only tests.
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    coverage: {
      // v8 reads coverage straight from Node's built-in instrumentation --
      // no source transformation step, so it stays accurate for TypeScript
      // without a separate Istanbul-instrumented build.
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**'],
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'e2e/**',
        // Bootstrap/framework glue: these files wire libraries together and
        // hold no branching logic of their own -- App Router requires them
        // to exist as thin default exports, so there is nothing meaningful
        // to unit-test (that behavior is covered by e2e/smoke instead).
        'src/app/layout.tsx',
        'src/app/providers.tsx',
        'src/app/page.tsx',
        // Route handlers: thin HTTP adapters over the worked-example
        // in-memory store (src/app/api/v1/items/store.ts). The pyramid
        // (CLAUDE.md, e2e/README.md) puts request/response wiring in the
        // integration/e2e layers, not unit -- e2e/smoke already exercises
        // GET /api/v1/health as the pattern to extend.
        'src/app/api/**',
        // Presentational components: no business logic of their own (the
        // decisions they render live in features/items, which IS covered).
        // Component rendering belongs in e2e/critical once a real screen
        // depends on them -- see e2e/README.md's layer table.
        'src/components/**',
        // Type-only modules: erased at compile time, so v8's runtime
        // instrumentation has nothing to record and would report a
        // permanent false 0%, skewing the aggregate.
        'src/lib/types.ts',
        'src/types/**',
      ],
      // Thresholds are deliberately modest for a template: it ships with a
      // handful of worked examples, not a full product. They exist so a
      // project that adopts this template starts with coverage enforced
      // from commit one, instead of bolting it on after the codebase has
      // already grown past the point where anyone wants to. Raise them as
      // real features (and their tests) land. Measured only over the files
      // above (business logic, hooks, lib) -- UI rendering and route
      // handlers are excluded on purpose, see the comments above.
      thresholds: {
        lines: 60,
        statements: 60,
        functions: 60,
        branches: 60,
      },
    },
  },
})
