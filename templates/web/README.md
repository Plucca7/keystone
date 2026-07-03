# Web app

A production-ready web app on **Next.js App Router**.

## Stack

| Technology       | Role                               |
| ---------------- | ---------------------------------- |
| **Next.js 15**   | Framework (App Router)             |
| **React 19**     | UI (Server Components by default)  |
| **TypeScript**   | Language (strict mode, zero `any`) |
| **Tailwind CSS** | Styling                            |
| **React Query**  | Client-side caching / polling      |
| **Zod**          | Schema validation at boundaries    |
| **Vitest**       | Unit tests                         |
| **Playwright**   | End-to-end tests                   |

## Quick start

Install dependencies and run the dev server:

```bash
pnpm install
cp .env.example .env.local
pnpm dev
# → http://localhost:3000
```

## Folder structure

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (renders the items worked example)
│   ├── providers.tsx        # Client providers (React Query)
│   └── api/v1/              # API routes
│       ├── health/route.ts
│       └── items/           # Worked-example endpoint backing features/items
├── components/               # React components
│   ├── ui/                   # Reusable UI primitives (ErrorState, LoadingSkeleton)
│   └── ItemsPanel.tsx         # Worked example consuming the items query + mutation
├── features/                 # Domain logic per feature (pure business rules)
│   └── items/                # api.ts, use-items.ts, archive-policy.ts
├── hooks/                    # Custom hooks
├── lib/                      # Utilities and config
│   ├── events.ts             # Decoupled event bus
│   ├── fetch.ts               # Fetch wrapper (result pattern)
│   ├── logger.ts              # Central structured logger (no raw console.*)
│   ├── query-keys.ts          # Central React Query key registry
│   ├── query-config.ts        # Cache presets per data volatility
│   ├── query-invalidation.ts  # Cross-entity invalidation helpers
│   └── types.ts               # Shared types
├── types/                    # Shared cross-cutting types (pagination, Result)
├── utils/                    # Small standalone helpers (cn, etc.)
├── __tests__/                # Mirrors src/, one test layer per subfolder
└── styles/
    └── globals.css           # Tailwind + CSS variables
db/
└── migrations/               # Ordered SQL migrations (NNNN_description.sql)
scripts/
├── db-migrate.sh              # Apply pending migrations (schema_migrations tracking)
└── setup-branch-protection.sh # Server-side branch protection via gh api
docs/
├── deploy.md                  # Staging/production pipeline guide
└── project-board.md           # Manual/opt-in GitHub Project board setup
```

## Conventions

| Convention            | Where                                           |
| --------------------- | ----------------------------------------------- |
| **Server Components** | Default — `'use client'` only for interactivity |
| **React Query**       | Client caching via `providers.tsx`              |
| **Zod**               | Schema validation at trust boundaries           |
| **Result pattern**    | `apiFetch()` in `lib/fetch.ts`                  |
| **RFC 9457**          | Errors as Problem Details                       |
| **Security headers**  | Configured in `next.config.ts`                  |
| **Design tokens**     | CSS variables in `globals.css`                  |

## Performance (Core Web Vitals)

| Metric | Target  |
| ------ | ------- |
| LCP    | < 2.5s  |
| INP    | < 200ms |
| CLS    | < 0.1   |

- Always use `next/image` with `sizes`
- Server Components by default
- Lazy-load heavy components

## Scripts

| Script                   | What it does                                   |
| ------------------------ | ---------------------------------------------- |
| `pnpm dev`               | Dev server                                     |
| `pnpm build`             | Production build                               |
| `pnpm typecheck`         | Type check                                     |
| `pnpm lint`              | ESLint + Next.js lint                          |
| `pnpm test`              | Unit tests (Vitest)                            |
| `pnpm run test:coverage` | Unit tests with coverage (thresholds enforced) |
| `pnpm test:e2e`          | End-to-end tests (Playwright)                  |

## Working with the agent

This project ships with a harness for an AI coding agent (see
[CLAUDE.md](CLAUDE.md) and [docs/agent-harness.md](docs/agent-harness.md)). Two
commands drive session hand-off, so an agent session's context is never
silently lost between turns:

- **"resume session"** (or "continue") — starts a session: reads long-term
  memory and the newest hand-off briefing, surveys the real codebase, and
  opens a timed entry in the coder's daily log.
- **"close session"** (or "wrap up") — ends a session: writes the next
  briefing, stamps the daily log with what was done, and saves any durable
  decision to long-term memory.

Full sequence in `.claude/rules/session-lifecycle.md`.

## Reference

- [Next.js Docs](https://nextjs.org/docs)
- [React Query](https://tanstack.com/query)
