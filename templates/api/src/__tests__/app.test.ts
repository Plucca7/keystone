import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '../app.js'
import { HTTP } from '../shared/constants/http.js'
import { ValidationError } from '../shared/types/error.js'

import type { FastifyInstance } from 'fastify'

// App-level test: the whole HTTP surface (hooks, error handler, routes) is
// exercised through fastify's inject() — full request lifecycle, no sockets.
describe('app', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()

    // Test-only routes to drive the global error handler down both of its
    // paths. Registered here (before ready) because buildApp intentionally
    // ships no route that fails on demand.
    app.get('/__test__/app-error', () => {
      throw new ValidationError('email must be a valid address')
    })
    app.get('/__test__/unexpected-error', () => {
      throw new Error('secret internal detail')
    })
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /api/v1/health', () => {
    it('returns 200 with the health payload', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/v1/health' })

      expect(response.statusCode).toBe(HTTP.OK)
      const body = response.json<{ status: string; uptimeSeconds: number; timestamp: string }>()
      expect(body.status).toBe('ok')
      expect(body.uptimeSeconds).toBeGreaterThan(0)
      expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp)
    })

    it('sets the OWASP security headers on every response', async () => {
      const response = await app.inject({ method: 'GET', url: '/api/v1/health' })

      expect(response.headers['x-content-type-options']).toBe('nosniff')
      expect(response.headers['x-frame-options']).toBe('DENY')
      expect(response.headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
      expect(response.headers['x-xss-protection']).toBe('0')
    })
  })

  describe('error handler (RFC 9457)', () => {
    it('maps an AppError to a Problem Details response with its own status', async () => {
      const response = await app.inject({ method: 'GET', url: '/__test__/app-error' })

      expect(response.statusCode).toBe(HTTP.UNPROCESSABLE_ENTITY)
      expect(response.headers['content-type']).toContain('application/problem+json')
      const body = response.json<{ title: string; detail: string; trace_id: string }>()
      expect(body.title).toBe('Validation Error')
      expect(body.detail).toBe('email must be a valid address')
      expect(body.trace_id).toBeTruthy()
    })

    it('maps an unexpected error to a generic 500 without leaking internals', async () => {
      const response = await app.inject({ method: 'GET', url: '/__test__/unexpected-error' })

      expect(response.statusCode).toBe(HTTP.INTERNAL_SERVER_ERROR)
      expect(response.headers['content-type']).toContain('application/problem+json')
      const body = response.json<{ detail: string }>()
      // The unhappy-path contract: the client must NEVER see the internal
      // message, stack, or path of an unexpected failure.
      expect(body.detail).toBe('An unexpected error occurred')
      expect(JSON.stringify(body)).not.toContain('secret internal detail')
    })
  })

  it('returns 404 for an unknown route', async () => {
    const response = await app.inject({ method: 'GET', url: '/nope' })

    expect(response.statusCode).toBe(HTTP.NOT_FOUND)
  })
})
