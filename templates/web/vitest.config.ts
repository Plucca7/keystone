import { defineConfig, configDefaults } from 'vitest/config'

/**
 * Minimal Vitest config — its only scope is to exclude e2e/ from discovery.
 *
 * Playwright E2E lives in e2e/ and runs separately (pnpm test:e2e). Without
 * this exclusion, Vitest tries to interpret specs using Playwright's
 * test.describe (incompatible) and breaks `pnpm test`.
 *
 * Each project adopting the template can add an environment ('jsdom'),
 * globals, coverage, etc. — install jsdom as a devDep first.
 */
export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})
