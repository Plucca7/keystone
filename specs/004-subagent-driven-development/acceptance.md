# Acceptance contract -- adversarial verification map (Phase 4)

> Written before the build, so scope cannot drift to fit the delivery. Reviewer's mandate:
> **assume a hollow shell and try to prove it.** Only self-produced evidence counts -- no "trust
> me", no "almost". A single REFUTED item drops the milestone until fixed. Run tests with
> `node --test tests/*.test.ts` and the gate with `node src/index.ts check .`.

## The rule

| #   | Promise                                                                                                 | How the adversary verifies (objective)                        | Hollow-shell trap -> how it is caught                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | Every generated project ships `.claude/rules/subagent-driven-development.md` with the real loop         | Scaffold a service AND a site; open the rule in each          | A stub -> reviewer confirms all four steps: fresh implementer per task, two-stage review (spec compliance then code quality), a critical issue sends the task back, one task before the next                  |
| S2  | It scopes itself to level 3+ and reuses the existing reviewers                                          | Read the rule                                                 | It applies the loop to a quick fix, or invents new reviewer personas -> reviewer confirms it names level 3 up and points to the shipped spec-reviewer/code-reviewer/security-auditor, not new agents          |
| S3  | The harness map references the loop, and a test proves the rule ships (both templates, non-placeholder) | Read `docs/agent-harness.md` B3; run the harness test; mutate | B3 doesn't point to the loop, or the test is presence-only/`assert.ok(true)` -> reviewer confirms B3 references it and the test asserts real loop content for BOTH templates, failing when the rule is gutted |

## Global checks

| #   | Promise                                      | How the adversary verifies                                                                                                                                                              |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | Nothing broke: zero errors AND zero warnings | `npm run check` + `npm run build`; require 0/0 across the repo                                                                                                                          |
| G2  | No new faked hard hook, no new agent persona | `.claude/hooks/` still holds only block-secret and block-protected-branch; `.claude/agents/` still holds only the three existing reviewers (no new implementer/planner persona claimed) |
| G3  | Honest scope                                 | No new CLI command; the loop is declared a rule, not a hook. Check `src/` and the spec's out-of-scope                                                                                   |

## Verdict

Each row: **CONFIRMED** (with pasted evidence) or **REFUTED** (with what was missing). No row on
narration. One REFUTED = not delivered until corrected.
