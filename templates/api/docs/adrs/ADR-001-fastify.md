# ADR-001: Fastify as the HTTP framework

**Status:** Accepted
**Date:** 2026-03-27
**Authors:** your team

## Context

We need a performant HTTP framework for TypeScript/Node services.

## Options considered

### Express

- **Pros:** Mature ecosystem, plenty of material
- **Cons:** Lower performance, weak typing, legacy middleware

### Fastify

- **Pros:** High performance, TypeScript-first, native schema validation, built-in logging (pino)
- **Cons:** Smaller ecosystem than Express

### Hono

- **Pros:** Ultra-light, multi-runtime
- **Cons:** Ecosystem still young

## Decision

**Fastify** — the best balance of performance, typing, and maturity for services.

## Consequences

- All API templates use Fastify
- Logging via pino (already integrated)
- Schema validation via Zod (plugin available)
