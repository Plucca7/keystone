# The spec operating system -- spec

> Phase 2 of enriching Keystone. Tracked by issue #2. Built rules-first: documents and harness
> rules the agent follows, not new CLI commands. This spec is the source of truth; when it and
> the code diverge, the spec wins. The adversarial acceptance contract is in `acceptance.md`.

## The request, restated

Keystone already opens every feature with a spec and a verifiable "done" target (harness part B2).
That is the seed of a spec-driven workflow, but three pieces are missing that separate a spec
habit from a spec _operating system_: a **constitution** (the non-negotiables that sit above every
individual spec), a **clarification** step (catch ambiguity before building, not after), and an
explicit **plan → tasks → verify** shape. This phase adds them, built as documents and harness
rules — the cheap, method-first path, consistent with Phase 1 — leaving CLI commands for later if
they ever earn their place.

## Done-target (verifiable), by milestone

### M1 -- Constitution (this milestone)

1. Every generated project ships a `specs/constitution.md`: a project-level statement of
   non-negotiables (architecture, security, data, testing + definition-of-done, accessibility,
   performance), with real starter content and guidance to adapt it — not an empty stub.
2. The spec workflow documents the constitution as the **top authority**: when an individual spec
   and the constitution disagree, the constitution wins. This is stated in the harness map
   (`docs/agent-harness.md`, part B2) so the agent knows to consult it.
3. A test proves the constitution ships in every generated project (both templates) and carries
   its real sections, not a placeholder.

### M2 -- Mandatory clarification (later)

4. A harness rule requires the agent, before implementing a spec, to surface ambiguities,
   conflicts, undefined rules, edge cases, and untestable requirements, and to ask rather than
   guess. Ships in every project.

### M3 -- Plan → tasks (later)

5. A harness rule + template turning an approved spec into a plan, and the plan into small,
   individually trackable tasks, each traceable to the spec's done-target.

### M4 -- Verify (later)

6. The completion check (deliver vs done-target, point by point — already sketched in B2)
   formalized as an explicit step in the workflow.

## Out of scope (now)

- New CLI commands — rules-first; a `keystone` subcommand for any of these comes only if it earns
  its place later.
- The convergence/coverage command, and multi-agent adapters — separate, later bets.
- Enforcing that a clarification was _thorough_ or a plan _sound_ by machine — that is judgment,
  kept as a rule (see tiers below).

## Enforcement tiers (declared honestly)

- The constitution shipping, and the workflow referencing it, are **deterministic mechanics** —
  a test proves the file and the reference exist.
- Whether a spec actually _conforms_ to the constitution, whether a clarification caught the real
  ambiguities, and whether a plan is sound are **rules** the agent follows — a script cannot judge
  them, and faking a hard check there would be the false confidence this project refuses.

## Notes

The constitution is unbranded on purpose: Keystone is an open standard, so the starter content is
generic professional practice a team adapts, never one company's house rules.
