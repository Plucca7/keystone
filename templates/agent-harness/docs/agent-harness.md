# The agent harness (Layer B)

> This project is meant to be built by an AI coding agent — the assistant you already use.
> The harness is the scaffolding around that agent: what shapes its context, the spec it
> follows, the specialists that review it, and the rails that stop it going wrong. It runs
> entirely on your own AI, with no external paid service. Everything here is deterministic
> configuration and written rules — it costs nothing until you invoke the agent.

The harness has four parts. Each is distilled from a working practice, not invented.

## B1 — Context in layers

What loads always must be small; what is detailed loads on demand.

- **`CLAUDE.md`** (root) — loaded every session. Kept lean: stack, commands, where-to-look.
- **Nested `CLAUDE.md`** — a folder's own conventions, loaded only when the agent works there.
- **`.claude/rules/`** — conventions scoped by path (a database rule under database files).
- **`docs/`** and **`.claude/`** — consulted on demand, never auto-loaded.

The point: the agent works with the right context and its working memory stays focused.

## B2 — Spec-driven, with a verifiable done-target

The spec is the source of truth; code derives from it.

- Every feature opens with `specs/<slug>/spec.md`: the request restated **plus a verifiable
  "done" target**, approved before any code is written.
- On completion, the delivered work is checked against that target point by point, and any
  gap is reported explicitly rather than glossed over.
- When code and spec diverge, the spec wins.

The template lives in `specs/000-example-feature/spec.md`.

## B3 — Reviewers in isolated context

Specialists that work in their own context window and return a focused verdict, keeping the
main thread clean. Under `.claude/agents/`:

- **`spec-reviewer`** — validates the done-target before any code (division of labor with B2).
- **`code-reviewer`** — checks the diff against the rubric (design, edge cases, tests,
  security, performance, reviewability, restraint).
- **`security-auditor`** — audits tenant isolation, auth, secrets, and input validation.

A failed verdict is meant to be enforced by a guardrail (B4), not left to goodwill.

## B4 — Guardrails that block, not warn

Deterministic hooks on the agent's tool lifecycle, registered in `.claude/settings.json`.
They are the harness's real teeth: a guarantee enforced by the system, not a promise by the
agent. Shipped in `.claude/hooks/`:

- **`block-secret`** — blocks staging/committing or reading a `.env` secret file.
- **`block-protected-branch`** — blocks a commit or push straight onto a protected branch;
  work goes through a feature branch and a reviewed pull request.

One rail this harness deliberately does **not** fake as a hard hook: "block declaring work
done that isn't". Whether a claim of "done" is honest is a judgment, not a regex — so it
lives in the B2 ritual (the point-by-point check against the done-target), not in a hook
that would give false confidence. Being honest about which guarantees are hard and which
are judgment is itself part of the standard.
