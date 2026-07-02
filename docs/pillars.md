# Keystone — Two Layers, Eight Pillars

> **What this document is:** the blueprint that defines what every project scaffolded by Keystone is
> meant to be born with. An open, unbranded standard any team can adopt as a common foundation.
>
> **Status — what is actually built today:** three commands exist. `new` scaffolds a new project
> (asks setup questions, then copies a template). `check` runs **three** deterministic file
> guards: an exposed-secret scan, an oversized-file check, and a dangerous-pattern scan
> (injection/XSS vectors: dynamic code execution, raw HTML injection, shell commands built with
> interpolation) — nothing else. `analyze` is read-only
> (reports only) and runs exactly **six** checks: exposed secrets, `.gitignore` completeness,
> presence of tests, presence of a README, basic database-convention text checks (plain string
> matching over `.sql` files), and oversized files. **Layer B — the agent harness — is built and ships
> in every scaffolded project (see below).** Everything else in this document — every other pillar
> behavior, the whole publish/CI gate, and the edge protection — is the target, not yet delivered.
> Where a capability is planned, this document says so; it is never described as running today.

---

## The DNA — two complementary layers

Keystone is **two complementary layers** — one for _what_ gets built, one for _who_ builds it.

**Layer A — Product Foundation (deterministic, zero-cost).** The design goal is that none of the
quality pillars depend on AI inference: the deterministic parts should work for free — checks,
written rules, configuration. The aim is a project that is secure, tested, and well-built even
without using any AI at all. Today only a small slice of Layer A exists (see the status line above);
the rest is the target.

**Layer B — Agent Harness (built).** The project is built by an AI coding agent — the assistant the
developer already uses — and Layer B is that agent's harness: what shapes its context, the spec it
follows, the specialists it consults, and the guardrails that stop it from going wrong. It runs
entirely on the developer's own AI, with no external paid service required. **Layer B ships today:
every scaffolded project is born with it** (see the four parts below), distilled from the house's own
working practice rather than copied from elsewhere.

The two layers keep AI in its place: Layer A's quality guarantees are deterministic and run at zero
AI cost, so AI is never the basis of the quality guarantee; Layer B gives the coding agent a
first-class harness that runs on the developer's own AI. In short, the AI harness applies to
_building_ the code, not to _guaranteeing_ its quality.

---

## Layer A — the 8 pillars

Each pillar has its rule in full. Except for the specific checks named in the status line above
(secret scan + size in `check`; the six presence checks in `analyze`), the behaviors below describe
the **target** a scaffolded project aims for — they are not running today.

1. [Foundation](foundation.md)
2. [Code quality](code-quality.md)
3. [Database](database.md)
4. [Tests](tests.md)
5. [Workflow](workflow.md)
6. [Ship it](ship-it.md)
7. [Security](security.md)
8. [Documentation](documentation.md)

### 1. Foundation

_Target — not yet enforced by any command._

- The same internal organization in every project (a fixed place for each thing).
- Accessible by default (usable by people with disabilities — sight, hearing, keyboard-only).
- Dates, money, and numbers in the user's country format, automatically.
- Starting language and screen priority (mobile / desktop / both) are **always asked** at setup —
  never assumed. (The `new` command already asks setup questions; the full foundation this implies
  is the target.)
- Responsiveness is foundation, always. Visual identity (color, font, accent) belongs to the
  project, not to the template.

### 2. Code quality

_Target — not yet built. `check` today only scans for exposed secrets and oversized files._

- A single format that fixes itself on save (no manual style decisions) — **planned**.
- Any error or warning should **block shipping** — a "zero errors, zero warnings" rule — **planned**;
  no publish/ship gate is built today.
- An automatic warning when a file/section grew too large. The oversized-file check exists today in
  both `check` 🔧 and `analyze` 🔧; wiring it into a shipping gate is the target.
- Comment only where it isn't obvious: explain the _why_ (a decision, a business rule), never the
  trivial.

### 3. Database

_Target — not yet enforced. `analyze` today does only basic text checks over `.sql` files (plain
string matching) 🔧; none of the guarantees below are implemented._

- Automatic created/updated timestamps on every record.
- Delete = hide and stay recoverable (nothing truly disappears) — reversible deletion.
- Every structural change through recorded, repeatable steps; nobody edits directly.
- Shuffled, unguessable identifiers (not sequential 1, 2, 3).
- Internal names always in English. Every record carries the owner tag (tenant isolation) — see
  Pillar 7. (No owner-filter or tenant-isolation query check is built; this is the target.)

### 4. Tests

_Target — not yet enforced. `analyze` today only checks that tests are **present** 🔧; it does not
run them, measure them, or block anything._

- A test is born with the feature, from day one (the suite grows with the project).
- Covers the happy path **and** the unhappy paths (invalid input, abuse, no permission).
- A failing test should **block shipping** — **planned**; no shipping gate exists today.
- Measured by focus on the critical (money, login, customer data), not by a coverage percentage.

### 5. Workflow

_Target — none of the workflow machinery below is built._

- Three levels: official → staging → daily work, with tests on every delivery.
- Every change passes a review gate before entering the official branch.
- A task board (to do / doing / done).
- Session hand-off: a way to close a work session (recording what was done and where things stand)
  and resume it later without re-explaining context, so context survives from one session to the
  next.
- Every delivery records its author (person or AI agent).

### 6. Ship it

_Target — no auto-deploy, staging, or rollback is built._

- Ships itself once it passes the gates (tests + checks).
- A staging environment (an identical copy) before production.
- Fast rollback if something breaks in production.
- Each environment's secrets and keys always kept out of the code.

### 7. Security

> Full rule in [security.md](security.md).

_What runs today:_ the exposed-secret scan in `check` 🔧 and in `analyze` 🔧, plus a
dangerous-pattern scan in `check` 🔧 (injection/XSS vectors). Everything else in this pillar is the
**target**.

- **Security in code, not in a paid agent** — the intent is that deterministic checks run on their
  own at zero cost, and that the developer's own AI (Layer B) can hunt deeper via a metered hook that
  stays off by default. Today only the secret scan is deterministic and running; the deeper hunting
  is planned.
- **Two fronts, different weights:**
  - _Inner lock_ (the core) — each customer sees only their own, firm login, correct permissions,
    never trust incoming input, secrets kept. This is where mistakes most often occur, and it is
    squarely the application's own responsibility to get right. (Design goal; not yet checked
    automatically beyond the secret scan.)
  - _Wall and gate_ (the smaller front) — block abuse / excess access at the edge. **Planned**; no
    edge/abuse/rate-limit protection is wired up today.
- **Closed decisions (design intent):**
  - Essential at birth; reinforced as the project grows.
  - The aim is that automatic checks block on the dev machine **and** again before going live (a
    double net) — the automatic before-going-live/CI gate is **planned**; today the local `check`
    runs the text guards and the project's own gates, on demand.
  - Abuse protection (edge) on by default — **planned**, not built.
  - AI-driven vulnerability hunting — a **planned** integration point, off by default, zero cost
    until someone turns it on. Not built.

### 8. Documentation

_Target — not enforced by any command. `analyze` today only checks that a README is **present** 🔧._

- Every important architectural decision becomes a short permanent record (the _why_).
- Documentation of how the system works is generated from the code itself whenever possible.
- Born with the project, in the moment — not at the end.
- Any interface exposed to other systems (an API) comes with a clear usage guide.
- Technical documentation in English; the front-end in the product's language.

---

## Layer B — the agent harness (built)

The project is built by an AI coding agent, with Layer B as the scaffolding around that agent — four
parts. Like Layer A, it runs on the developer's own AI, with no external paid service required. **All
four parts ship today**, copied into every scaffolded project (`templates/agent-harness/`, laid on
top of the mould by `new`), and each is distilled from a working house practice, not invented.

> How it lands: `new` copies the shared harness on top of the chosen mould, so a fresh project is
> born with `.claude/` (agents, hooks, settings, scoped rules), `specs/` (the spec ritual), and
> `docs/agent-harness.md` (the map). The guardrail hooks are proven to block by an automated test.

### B1. Context engineering — _built_

The agent works with the right context and its working memory stays focused.

- The agent loads a lean set of always-on instructions (`CLAUDE.md`) and pulls deeper knowledge only
  when a task needs it, so its context stays focused.
- Rules activate only where they apply — a scoped rule under matching files (`.claude/rules/`), not
  everywhere.
- Docs (`docs/`, `.claude/`) are consulted on demand, never auto-loaded.
- _Still the target:_ an automatic check that flags an always-on instruction set that has grown too
  large, and cross-session working-memory persistence.

### B2. Spec-driven development — _built_

The spec is the source of truth and code derives from it.

- Every feature opens with a **spec** (`specs/<slug>/spec.md`): the request restated + a **verifiable
  "done" target**, approved before any code is written.
- On completion, the delivered work is checked against the "done" target point by point, and any gap
  is reported explicitly rather than glossed over.
- When code and spec diverge, the spec wins.

### B3. Subagents — _built_

Isolated-context specialists, in `.claude/agents/`.

- Reviewers and auditors that work in their own context window and return a focused verdict, keeping
  the main thread clean.
- Shipped: a **spec reviewer**, a **code reviewer** (the house review rubric), and a **security
  auditor** (the house security pillars).
- Division of labor with B2: spec-driven development defines _what_ to check (the "done" target); the
  subagents are _who_ checks it in isolation — the spec reviewer validates the target, the code
  reviewer validates the diff.
- A failed verdict is meant to be **enforced by a guardrail** (B4), not left to the main agent's
  discretion.

### B4. Guardrails — _built_

Rails that block, not ones that merely warn. Deterministic hooks in `.claude/hooks/`, registered in
`.claude/settings.json`.

- **Lifecycle hooks** that deterministically block off-standard behavior before a tool runs.
- They are the harness's real teeth: a guarantee enforced by the system, not a promise by the agent.
- Shipped and proven by test: `block-secret` (blocks staging/reading a `.env` secret) and
  `block-protected-branch` (blocks a commit/push straight onto a protected branch).
- Deliberately **not** a hard hook: "block declaring work done that isn't". Whether a "done" claim is
  honest is a judgment, not a regex — so it lives in the B2 ritual (the point-by-point check against
  the done-target), not in a hook that would give false confidence. Being honest about which
  guarantees are hard and which are judgment is itself part of the standard.

---

## How the layers and pillars are meant to interlock (not loose boxes)

_This section describes the intended design; most of the mechanisms it references are still the
target._

- _Tenant isolation_ (Security) is meant to live in the _Database_ vault (owner tag + shuffled
  identifiers).
- The _"always blocks"_ of _Code quality_ is meant to have teeth because of _Tests_.
- The _"ships itself"_ of _Ship it_ is meant to be safe only because of the _Code quality_ and
  _Tests_ gates.
- The **same automatic-check mechanism is meant to recur across three pillars** — Code quality,
  Tests, and Security — as the deterministic teeth of Layer A. Today that mechanism runs as the text
  guards (secret, size, dangerous) plus the project's own gates (format, lint, types, tests, audit).
- **Layer A's deterministic checks and Layer B's guardrails are the same idea at two levels:** A
  guards the code, B guards the agent that writes it. Both ship today — A's secret/size/dangerous
  scans, B's block-secret and block-protected-branch hooks.
- The spec-driven **"done" target** (B2) is meant to feed the _Tests_ (A4) and the completion check.
- **Session hand-off** (A5) is meant to be where the agent's cross-session memory (B1) persists.

---

## Build phases — start with Security

_Roadmap. Phase 1 is only partially delivered (the local secret scan and size check exist; the
publish-time gate and template-embedded rules do not). Phases 2–4 are not started._

| Phase                      | Delivery                                                                                                                                       | AI cost           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **1 — Rules + checks**     | Written pillar rules + automatic checks embedded in the project template, blocking flawed code on the machine (a publish-time gate is planned) | Zero              |
| **2 — Edge protection**    | Edge abuse-blocking pre-tuned and on by default                                                                                                | Zero              |
| **3 — Test dummy**         | A target deliberately full of holes, to prove the pillar catches the failures                                                                  | Zero              |
| **4 — (optional, future)** | AI-driven vulnerability-hunting integration point, off by default                                                                              | Only if turned on |

---

## References behind the Security pillar (chosen for relevance to typical web-app projects)

_These are reference standards and tools the Security pillar is designed around. Except for the
exposed-secret scan, none is integrated into Keystone's commands today — they mark the direction, not
the current implementation._

"Inner lock" front — guides for what must exist:

- OWASP ASVS — application security verification standard (base #1)
- OWASP Cheat Sheet Series — how to do each thing the secure way
- OWASP Web Security Testing Guide — how to test security

"Inner lock" front — find the flaw automatically (no AI) — **planned integrations, not built:**

- Semgrep — automatically flags dangerous patterns in your code
- OWASP Dependency-Check — warns when a third-party piece has a known flaw

"Wall and gate" front — **planned, not built:**

- express-rate-limit — a mature reference for blocking excess access

Validation (future):

- OWASP Juice Shop — a site deliberately full of holes, to prove the pillar works

Conceptual reference: Anthropic's public guidance on AI-assisted code defense.
