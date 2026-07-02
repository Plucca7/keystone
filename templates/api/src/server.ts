import { buildApp } from './app.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'

/**
 * Process bootstrap: reads the environment, builds the app, starts listening,
 * and wires graceful shutdown.
 *
 * Decision: everything that touches the real process (ports, signals,
 * process.exit) lives here and ONLY here, so app.ts stays pure and testable.
 * This file is excluded from coverage for exactly that reason (see
 * vitest.config.ts).
 */
export async function startServer(): Promise<void> {
  const app = await buildApp()

  // Graceful shutdown: stop accepting new connections and drain in-flight
  // requests before exiting. SIGTERM is what container orchestrators send on
  // scale-down/redeploy; SIGINT covers local Ctrl+C.
  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutdown signal received, closing server')
    await app.close()
    process.exit(0)
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))

  try {
    await app.listen({ port: env.PORT, host: env.HOST })
    logger.info(`Server listening on http://${env.HOST}:${env.PORT}`)
  } catch (err) {
    logger.fatal(err, 'Failed to start server')
    process.exit(1)
  }
}
