import Fastify from 'fastify'
import { afterEach, describe, expect, it } from 'vitest'

import { HTTP } from '../../constants/http.js'
import { createApiKeyAuth, hashApiKey } from '../api-key-auth.js'

import type { ApiKeyContext } from '../api-key-auth.js'
import type { FastifyInstance, FastifyRequest } from 'fastify'

type KeyRecord = {
  id: string
  name: string
  scopes: string[]
  isActive: boolean
  expiresAt: string | null
}

const VALID_KEY = 'test-api-key'

// In-memory lookup standing in for the database: the middleware receives the
// lookup as a dependency precisely so tests never need a real key store.
function lookupFor(record: KeyRecord | null): (hash: string) => Promise<KeyRecord | null> {
  return async (hash) => (hash === hashApiKey(VALID_KEY) ? record : null)
}

function activeRecord(overrides: Partial<KeyRecord> = {}): KeyRecord {
  return {
    id: 'key-1',
    name: 'ci',
    scopes: ['read'],
    isActive: true,
    expiresAt: null,
    ...overrides,
  }
}

describe('api-key-auth', () => {
  let app: FastifyInstance | undefined

  afterEach(async () => {
    await app?.close()
    app = undefined
  })

  async function buildProtectedApp(record: KeyRecord | null, requiredScope?: string) {
    app = Fastify({ logger: false })
    app.get(
      '/protected',
      { preHandler: createApiKeyAuth(lookupFor(record), requiredScope) },
      // Echo the attached context so the success test can assert it.
      async (request: FastifyRequest) =>
        (request as FastifyRequest & { apiKey?: ApiKeyContext }).apiKey,
    )
    return app
  }

  it('hashes keys deterministically with sha256', () => {
    expect(hashApiKey('abc')).toBe(hashApiKey('abc'))
    expect(hashApiKey('abc')).not.toBe(hashApiKey('abd'))
    expect(hashApiKey('abc')).toMatch(/^[0-9a-f]{64}$/)
  })

  it('rejects a request with no X-API-Key header with 401', async () => {
    const server = await buildProtectedApp(activeRecord())

    const response = await server.inject({ method: 'GET', url: '/protected' })

    expect(response.statusCode).toBe(HTTP.UNAUTHORIZED)
  })

  it('rejects an unknown key with 401', async () => {
    const server = await buildProtectedApp(activeRecord())

    const response = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { 'x-api-key': 'wrong-key' },
    })

    expect(response.statusCode).toBe(HTTP.UNAUTHORIZED)
  })

  it('rejects a deactivated key with 403', async () => {
    const server = await buildProtectedApp(activeRecord({ isActive: false }))

    const response = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { 'x-api-key': VALID_KEY },
    })

    expect(response.statusCode).toBe(HTTP.FORBIDDEN)
  })

  it('rejects an expired key with 403', async () => {
    const server = await buildProtectedApp(activeRecord({ expiresAt: '2000-01-01T00:00:00.000Z' }))

    const response = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { 'x-api-key': VALID_KEY },
    })

    expect(response.statusCode).toBe(HTTP.FORBIDDEN)
  })

  it('rejects a key without the required scope with 403', async () => {
    const server = await buildProtectedApp(activeRecord({ scopes: ['read'] }), 'write')

    const response = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { 'x-api-key': VALID_KEY },
    })

    expect(response.statusCode).toBe(HTTP.FORBIDDEN)
  })

  it('accepts the wildcard scope for any required scope', async () => {
    const server = await buildProtectedApp(activeRecord({ scopes: ['*'] }), 'write')

    const response = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { 'x-api-key': VALID_KEY },
    })

    expect(response.statusCode).toBe(HTTP.OK)
  })

  it('attaches the key context to the request on success', async () => {
    const server = await buildProtectedApp(activeRecord(), 'read')

    const response = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { 'x-api-key': VALID_KEY },
    })

    expect(response.statusCode).toBe(HTTP.OK)
    expect(response.json<ApiKeyContext>()).toEqual({ keyId: 'key-1', name: 'ci', scopes: ['read'] })
  })
})
