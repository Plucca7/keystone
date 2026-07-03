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
    // Registers RTL's cleanup(afterEach) -- see vitest.setup.ts for why this
    // cannot rely on RTL's own auto-registration in this project.
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      // v8 reads coverage straight from Node's built-in instrumentation --
      // no source transformation step, so it stays accurate for TypeScript
      // without a separate Istanbul-instrumented build.
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // The whole source tree is the coverage surface. A narrow allow-list
      // of directories was the old shape, and it had a silent hole: a file
      // in a brand-new folder (e.g. src/services/) fell outside every listed
      // path and so counted for nothing -- 100% green while shipping
      // untested code. Covering src/** closes that hole: any new file is in
      // the denominator the moment it exists, and the only way to green is a
      // real test. Genuinely untestable files are removed below, by name,
      // each with its own reason -- never by excluding a whole directory
      // "to be safe".
      include: ['src/**'],
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'e2e/**',
        // Test files themselves are not part of the measured surface.
        'src/__tests__/**',
        // Framework bootstrap / pure presentation: these render static markup
        // or wire up providers, hold no branching logic worth a unit test,
        // and are exercised end-to-end by Playwright instead. Listed one by
        // one so a NEW file here is never silently swept in.
        'src/app/layout.tsx',
        'src/app/page.tsx',
        'src/app/providers.tsx',
        // Type-only modules: erased at compile time, so v8's runtime
        // instrumentation has nothing to record and would report a
        // permanent false 0%, skewing the aggregate.
        'src/lib/types.ts',
        'src/types/**',
      ],
      // 100%: every file under src/** is exercised on every line, branch,
      // function, and statement. The only files kept out of the denominator
      // are the ones named in `exclude` above, each with its own reason
      // (framework bootstrap / pure presentation, test files, and type-only
      // modules). Everything else that ships -- hooks, features, api routes,
      // the in-memory store, query-keys/config/invalidation, utilities, any
      // component with logic, and any file added under a new folder like
      // src/services/ -- is tested to 100%, no broad carve-outs.
      thresholds: {
        lines: 100,
        statements: 100,
        functions: 100,
        branches: 100,
      },
    },
  },
})
