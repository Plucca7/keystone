import { test, expect } from '@playwright/test'

/**
 * Smoke tests — verify that the app boots and responds at a basic level.
 * They do not depend on authentication (project: smoke uses an empty storageState).
 *
 * If this fails, NOTHING else works — it blocks the merge early.
 *
 * Add product-specific checks HERE as you implement public routes:
 *   - Does /pricing render? Does /about respond 200?
 *   - Does an authenticated route without a session redirect to the landing page?
 *   - Is the main CTA visible on the landing page?
 *
 * Keep the smoke suite LEAN: 3-5 tests max. The critical flow goes in e2e/critical/.
 */

test.describe('Health checks', () => {
  test('landing page (/) returns 200 and renders', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBeLessThan(400)
    // Body must have content — guards against a silent "blank page"
    await expect(page.locator('body')).not.toBeEmpty()
  })
})
