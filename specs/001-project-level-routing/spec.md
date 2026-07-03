# Work-level routing + real deterministic guardrails -- spec

> Phase 1 of enriching Keystone. Tracked by issue #1. This spec is the source of truth;
> code derives from it, and when they diverge the spec wins. The acceptance contract an
> adversary runs against the delivery lives beside it in `acceptance.md`.

## The request, restated

Keystone applies the same weight of process to every piece of work, which is both too much
for a one-line fix and too little for a regulated system. It needs a **spine**: one place
that classifies a unit of work by level and turns on only what that level needs -- so a typo
fix is not treated like the NASA and a payment flow is not treated like a typo. Alongside it,
Keystone should gain the new guardrails that are genuinely enforceable, without pretending a
judgment call is a hard block.

A design correction made while reading the code: a "level" is two different things. Levels
1--3 (quick fix, small feature, product feature) describe a unit of work _inside an existing
project_; levels 4--5 (new product, critical system) are the only ones that describe a
project's _birth_. So the full five-level router lives in the harness (the agent consults it
per unit of work), and project creation only records the project's birth level -- it does not
ask for a level that does not apply to a just-born project.

## Done-target (verifiable)

### Milestone 1 -- the level router (the spine)

1. There is one canonical definition of the five levels -- `quick-fix`, `small-feature`,
   `product-feature`, `new-product`, `critical-system` -- with a routing map from each level
   to the capabilities it activates, held as a single testable source of truth
   (`src/levels.ts`).
2. `keystone new` **deduces and records** the project's birth level in `keystone.json`: a new
   project is a `new-product`, and one that handles sensitive data or money is a
   `critical-system` -- deduced from what the wizard already asked, never a new question.
3. A harness rule (`templates/agent-harness/.claude/rules/work-level-routing.md`) documents
   the per-unit-of-work router for the agent, stating that levels 1--3 apply to work inside an
   existing project.
4. Tests prove both the birth-level deduction and the routing map's completeness (all five
   levels present, none with an empty capability set, every capability a known one), and
   `keystone check .` is green.

> This milestone is where real velocity is measured before Milestone 2 begins.

### Milestone 2 -- the guardrails that actually block

5. Before a push, the push is blocked when `keystone check` fails (a local, hard guarantee).
6. In CI, a pull request with no linked issue fails the check (a server-side, hard guarantee).
7. A change to a database migration or a security-critical path requires a code-owner review
   via `CODEOWNERS` plus branch protection (a server-side, hard guarantee).
8. Each guardrail ships with a proof: a case that must be blocked (red) and a case that must
   pass (green).

## Out of scope (now)

- Multi-agent adapters, and emitting the portable `AGENTS.md` standard -- a separate, later
  bet.
- The convergence/coverage command -- a separate, AI-metered bet.
- Any downstream capability the router will later switch on (product/UX discovery, per-task
  subagents, TDD-by-risk enforcement): Phase 1 only stands up the router and the map they will
  read; it does not build them.
- Depth _within_ a capability (e.g. how deep discovery goes for a small project vs a regulated
  one) -- the map is a boolean per capability for now; graded depth is a later refinement.

## Enforcement tiers (declared honestly)

- Guardrails 5, 6, 7 are **hard** -- enforced by the system (pre-push exit code, CI job, branch
  protection), each proven by a red and a green case.
- The router and the routing map are **deterministic mechanics** -- they record and validate;
  a test proves the map is complete.
- Deliberately **not** faked as hard hooks, kept as **rules**: "block a critical change with no
  test" and "block a new dependency with no justification" -- whether a change is critical or a
  justification sufficient is judgment, not a regex, and a fake hard block there would be the
  false confidence this project refuses.

## Notes

The five-level taxonomy appears in two runtimes for two consumers: `src/levels.ts` is
authoritative for Keystone's own birth-level deduction, and the harness rule is authoritative
for the agent inside a generated project (which never has `src/levels.ts`). They are the same
concept serving two contexts, not redundant copies in one; keeping the level names in step
between them is a small maintenance note, called out where each lives.
