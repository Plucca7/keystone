import type { Page } from '@playwright/test'

/**
 * Mock helpers for external APIs — keeps E2E tests from hitting real services
 * (third-party data providers, email senders, hosting APIs, etc.) during runs.
 *
 * Typical usage in specs:
 *   import { mockExternalApi } from '../fixtures/api-mocks'
 *   test('creates a record', async ({ page }) => {
 *     await mockExternalApi(page, { name: 'ACME Inc' })
 *     // ...
 *   })
 *
 * It does not mock the database — that one DOES hit the real dev project
 * (your-project-ref) to validate access rules and schema. To isolate it,
 * set up a dedicated test project in the future.
 */

interface ExternalRecord {
  id?: string
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  region?: string
  postalCode?: string
  status?: string
}

/**
 * Intercepts calls to an external data provider — returns a mocked payload.
 * Useful for specs that create a record without depending on a live external lookup.
 */
export async function mockExternalApi(page: Page, data: ExternalRecord = {}): Promise<void> {
  await page.route('**/api.example.com/lookup/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'example-id',
        name: 'ACME Inc',
        email: 'contact@example.com',
        status: 'active',
        ...data,
      }),
    })
  })
}

/**
 * Intercepts outgoing email sends. Useful for signup/recovery specs
 * without sending real emails.
 */
export async function mockEmailProvider(page: Page, response: { id?: string } = {}): Promise<void> {
  await page.route('**/api.email-provider.example.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: response.id ?? 'mock-email-id', ...response }),
    })
  })
}

/**
 * Intercepts calls to a hosting provider (DNS, servers). Generic mock — add
 * variants as specs need them.
 */
export async function mockHostingProvider(page: Page): Promise<void> {
  await page.route('**/api.hosting-provider.example.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok' }),
    })
  })
}
