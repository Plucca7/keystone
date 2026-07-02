import { healthService } from './health.service.js'

import type { FastifyReply, FastifyRequest } from 'fastify'

/**
 * Health controller — HTTP shape only.
 *
 * Decision: the controller's single job is translating between HTTP and the
 * service's Result. No business logic lives here; if a handler grows an `if`
 * about the domain, that `if` belongs in the service.
 */
export async function getHealthHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const result = healthService.getHealth()

  if (!result.success) {
    // Decision: throwing the AppError here is transport-level dispatch, not
    // business flow control — the global error handler owns the RFC 9457
    // response shape, so every error leaves the API through one door.
    throw result.error
  }

  await reply.send(result.data)
}
