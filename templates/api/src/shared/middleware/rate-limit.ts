import { HTTP } from '../constants/http.js'

import type { FastifyRequest, FastifyReply, FastifyPluginCallback } from 'fastify'

interface RateLimitOptions {
  max: number
  windowMs: number
}

const DEFAULT_MAX_REQUESTS = 60
const DEFAULT_WINDOW_MS = 60_000

const requests = new Map<string, number[]>()

export const rateLimitPlugin: FastifyPluginCallback<RateLimitOptions> = (fastify, opts, done) => {
  const { max = DEFAULT_MAX_REQUESTS, windowMs = DEFAULT_WINDOW_MS } = opts
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const key = request.ip
    const now = Date.now()
    const timestamps = (requests.get(key) ?? []).filter((t) => now - t < windowMs)
    if (timestamps.length >= max) {
      reply.code(HTTP.TOO_MANY_REQUESTS).send({ error: 'Rate limit exceeded' })
      return
    }
    timestamps.push(now)
    requests.set(key, timestamps)
  })
  done()
}

// Why: Fastify encapsulates plugins — a hook added inside a plugin applies
// only to routes registered in that plugin's own context, so without this
// flag the limiter silently protected NOTHING (caught by the test suite).
// The skip-override symbol is exactly what the `fastify-plugin` package sets;
// inlining it avoids adding a dependency for one boolean.
;(rateLimitPlugin as FastifyPluginCallback<RateLimitOptions> & Record<symbol, boolean>)[
  Symbol.for('skip-override')
] = true
