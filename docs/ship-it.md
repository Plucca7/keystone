# Ship it — the rule in full

> The full rule for the Ship-it pillar. Skeleton in [pillars.md](pillars.md).
>
> **Status:** partially built. What ships today: both templates carry a **two-environment deploy
> pipeline** (staging from `develop`, production from `main`) — quality gates first, then database
> migrations applied **before** the code, then the deploy step, then a post-deploy smoke check —
> with per-environment secrets held by the hosting service's environment feature. The single
> host-specific deploy command is deliberately left for the owner to fill when choosing a host
> (hosting is the developer's choice by design); until filled, that step fails with instructions
> rather than green-lighting a no-op. Still **planned, not built**: the one-step rollback. The
> secret scan (item 4) also runs today. Items marked 🔧 are backed by something that actually runs.

## Principle

The intended final destination, where the blocking checks already in place (tests, gates) prove their worth.
The goal is a project that ships itself _because_ it is safe — not in spite of it.

## 1. Ships itself once the checks pass — _built up to the host line_

- 🔧 The pipeline exists in every generated project: a merge to `develop` triggers the staging
  pipeline, a merge to `main` triggers production. Each runs the quality gates, applies the
  database migrations, deploys, and smoke-checks the result — in that order, failing loudly at any
  step.
- The one deliberately unfilled piece is the host-specific deploy command (see item 5). Everything
  around it — ordering, gating, environments, secrets — is real and in place.

## 2. A staging environment before real production — _built as pipeline + convention_

- 🔧 Every change is meant to be seen working in a staging copy before any customer sees it. The
  generated project ships the staging pipeline (triggered from the integration branch) and
  per-environment secrets — including a **separate database per environment** (each environment's
  own connection string, migrations applied to each in order).
- Creating the actual second environment (the staging host and database) is the owner's one-time
  setup, guided by the project's deploy document.

## 3. Fast rollback (planned)

- **Planned, not yet built.** The intended behavior: if a change breaks in production, undo it in one
  step and return to the version that worked — the safety net for production.

## 4. Secrets kept out of the code

- Each environment's keys (staging, production) stay **out of the code**, stored securely. Every
  environment has its own. Ties into [security.md](security.md), item 1.3.
- 🔧 An automatic check scans the code for exposed secrets and flags any it finds. This scan is built
  today — it is the same deterministic secret scan described in the Security pillar. Turning that flag
  into a hard block before a change ships is planned, not built.

## 5. Hosting is the developer's choice — _by design_

- The deploy pipeline and the environment structure are set up inside the project, while the real
  deploy target is left for when you decide where to host (not at project creation). The pipeline
  marks exactly **one line** to fill with your host's command, with worked examples for common
  hosts in the workflow file and the deploy document.
- The scaffold **never creates an account** on any hosting service — it uses a key you provide
  once, when you choose your host. Until you fill the line, the deploy step fails with instructions
  — an honest red, never a fake green.
