# Ship it — the rule in full

> The full rule for the Ship-it pillar. Skeleton in [pillars.md](pillars.md).
>
> **Status:** This whole pillar is **planned, not built**. The auto-deploy, the staging environment,
> the one-step rollback, and the deploy pipeline are the standard the scaffold aims for — none of
> them ship yet. The one piece that is already live is the secret scan (item 4), a deterministic
> Layer A check that flags an exposed secret in the code. Items marked 🔧 are backed by that
> automatic check; everything else here describes the intended end state.

## Principle

The intended final destination, where the brakes already in place (tests, checks) prove their worth.
The goal is a project that ships itself _because_ it is safe — not in spite of it.

## 1. Ships itself once the brakes pass (planned)

- **Planned, not yet built.** The intended behavior: once a change is approved and **passes
  everything** (tests, checks, the review gate), it goes live on its own.
- Meant to be fast and free of human error — because the brakes already held back anything broken.
- The trigger would fire only when everything is green. This gate is part of the planned harness, not
  a check that runs today.

## 2. A staging environment before real production (planned)

- **Planned, not yet built.** The intended behavior: every change is seen working in an **identical
  copy** before any customer sees it, catching surprises before they hurt.

## 3. Fast rollback (planned)

- **Planned, not yet built.** The intended behavior: if a change breaks in production, undo it in one
  step and return to the version that worked — the safety net for production.

## 4. Secrets kept out of the code

- Each environment's keys (staging, production) stay **out of the code**, stored securely. Every
  environment has its own. Ties into [security.md](security.md), item 1.3.
- 🔧 An automatic check scans the code for exposed secrets and flags any it finds. This scan is built
  today — it is the same deterministic secret scan described in the Security pillar. Turning that flag
  into a hard block before a change ships is planned, not built.

## 5. Hosting is the developer's choice (planned)

- **Planned, not yet built.** The intent: the deploy pipeline and the staging environment are set up
  inside the project, while the real deploy and the hosting service are left for when you decide
  where to host (not at project creation).
- The scaffold is designed to **not create an account** on any hosting service — the intent is that
  it uses a key you provide once, when you choose your host.
