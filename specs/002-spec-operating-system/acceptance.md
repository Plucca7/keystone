# Acceptance contract -- adversarial verification map (Phase 2)

> Written before the build, so scope cannot drift to fit the delivery. Reviewer's mandate:
> **assume a hollow shell and try to prove it.** Only self-produced evidence counts — no "trust
> me", no "almost". A single REFUTED item drops the milestone until fixed. Run tests with
> `node --test tests/*.test.ts` and the gate with `node src/index.ts check .`.

## Milestone 1 -- Constitution

| #    | Promise                                                                 | How the adversary verifies (objective)                                                                 | Hollow-shell trap -> how it is caught                                                                                                                                                                                                |
| ---- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M1.1 | Every generated project ships `specs/constitution.md` with real content | Scaffold a service AND a site; open `specs/constitution.md` in each; count the non-negotiable sections | An empty stub or a one-line placeholder -> reviewer confirms the real sections (architecture, security, data, testing/definition-of-done, accessibility, performance) are present with actual guidance, not headers over blank space |
| M1.2 | The workflow names the constitution the top authority                   | Read `docs/agent-harness.md` (part B2) in a generated project                                          | The constitution is mentioned but not as the authority, or the "constitution wins on conflict" line is missing -> reviewer confirms B2 states the constitution outranks an individual spec and points to `specs/constitution.md`     |
| M1.3 | A test proves it ships in both templates, non-placeholder               | Run the harness test; read it                                                                          | A test that only checks the file exists but not its content, or `assert.ok(true)` -> reviewer confirms it asserts real section content for BOTH service and site                                                                     |

## Global checks

| #   | Promise                                      | How the adversary verifies                                                                                                                                                                               |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | Nothing broke: zero errors AND zero warnings | `npm run check` + `npm run build`; require 0/0 across the repo                                                                                                                                           |
| G2  | Honest scope                                 | M2/M3/M4 (clarify, plan→tasks, verify) are NOT claimed as delivered. Check `git log` and the working tree: only the constitution milestone landed. If a later milestone is claimed but absent -> REFUTED |
| G3  | Honest tiers                                 | The spec/docs do NOT claim a hard machine-check that a spec "conforms" to the constitution (that is a rule). If a faked hard check is claimed -> REFUTED                                                 |

## Verdict

Each row: **CONFIRMED** (with pasted evidence) or **REFUTED** (with what was missing). No row on
narration. One REFUTED = milestone not delivered until corrected.
