// Barrel — the module's public surface. Other modules and the app builder
// import from here, never from the module's internal files.
export { healthRoutes } from './health.routes.js'
export { createHealthService, healthService } from './health.service.js'
export type { HealthService, HealthStatus } from './health.service.js'
export { healthRepository } from './health.repository.js'
export type { HealthRepository, RuntimeInfo } from './health.repository.js'
