import pino from 'pino'

import { env } from './env.js'

/**
 * Structured logger — JSON in production, pretty in dev.
 *
 * Format:
 * {
 *   "timestamp": "...",
 *   "level": "error",
 *   "message": "...",
 *   "service": "api",
 *   "trace_id": "..."
 * }
 *
 * NEVER log: passwords, tokens, full personal identifiers, card data.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  base: {
    service: 'api',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err: pino.stdSerializers.err,
  },
})
