# Subagent-driven development -- spec

> Phase 4 of enriching Keystone. Tracked by issue #4. Built rules-first: one harness rule the agent
> follows, using the reviewer subagents that already ship. This spec is the source of truth; when it
> and the code diverge, the spec wins. The adversarial acceptance contract is in `acceptance.md`.

## The request, restated

Keystone already ships three reviewers in isolated context (spec, code, security -- harness part B3),
but nothing describes how substantial work is _executed_: doing every task in one long-running
context lets earlier work blur later judgment and fills the window. This phase adds the loop --
dispatch each task to a fresh subagent with clean context, then put its result through two reviews
before it counts as done -- so the main thread stays a clean coordinator. It ties to the work-level
router (the `subagents` capability), the task list (`plan-and-tasks`), and the reviewers (B3).

## Done-target (verifiable)

1. Every generated project ships `.claude/rules/subagent-driven-development.md` describing the
   per-task loop with real guidance (not a stub): dispatch a fresh implementer per task, review in
   two stages (spec compliance then code quality, plus the security auditor for security-sensitive
   tasks), a critical issue sends the task back, one task through the loop before the next.
2. The rule scopes itself: used from work level 3 up (product feature and above), skipped for a
   quick fix or small feature where the overhead is not worth it -- consistent with
   `work-level-routing.md`'s `subagents` capability.
3. The rule references the reviewer agents that already ship (`.claude/agents/spec-reviewer.md`,
   `code-reviewer.md`, `security-auditor.md`) rather than inventing new ones, and the harness map
   (`docs/agent-harness.md`, part B3) points to this loop.
4. A test proves the rule ships in every generated project (both templates) with its real loop, not
   a placeholder. `keystone check .` green.

## Out of scope (now)

- Making the loop a hard hook -- dispatching a subagent and judging a review are not things a script
  can do; a hook there would be false confidence.
- New agent persona files -- the implementer is a fresh subagent given the task, not a new persona.
- Any new CLI command.

## Enforcement tiers (declared honestly)

- The rule **shipping** and its **reference** to the existing reviewers are deterministic mechanics
  -- a test proves the file and the reference exist.
- The reviewers themselves are real (isolated context, a returned verdict), but **whether the loop
  is followed**, and whether a "critical issue" truly blocks, is a **rule** the agent runs in the
  open -- judgment, not a machine check.
