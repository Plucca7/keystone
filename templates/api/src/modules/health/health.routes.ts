import { getHealthHandler } from './health.controller.js'

import type { FastifyInstance } from 'fastify'

/**
 * Route registration for the health module.
 *
 * Decision: routes are a separate file (not inlined in the controller) so the
 * URL surface of a module is readable at a glance, and controllers stay
 * import-free of FastifyInstance — they only know request/reply.
 */
export async function healthRoutes(app: FastifyInstance): Promise<void> {
  // GET /api/v1/health — liveness/readiness probe target.
  app.get('/api/v1/health', getHealthHandler)
}
