# Acceptance contract -- adversarial verification map (Phase 3)

> Written before the build, so scope cannot drift to fit the delivery. Reviewer's mandate:
> **assume a hollow shell and try to prove it.** Only self-produced evidence counts -- no "trust
> me", no "almost". A single REFUTED item drops the milestone until fixed. Run tests with
> `node --test tests/*.test.ts` and the gate with `node src/index.ts check .`.

## The rule

| #   | Promise                                                                                  | How the adversary verifies (objective)               | Hollow-shell trap -> how it is caught                                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | Every generated project ships `.claude/rules/test-first-by-risk.md` with the real matrix | Scaffold a service AND a site; open the rule in each | A stub -> reviewer confirms all the rows are present: business rule/money/data and security/auth as **test-first always**, bug fix as **regression test**, simple UI as **test by risk**, config as **automatic validation**, spike as **optional** |
| T2  | Enforcement is declared in two honest tiers                                              | Read the rule's enforcement section                  | It claims the matrix is a hard hook, or re-implements the failing-test block -> reviewer confirms it names the hard floor as pre-existing (pre-push/check/verify) and the matrix as a rule/judgment                                                 |
| T3  | A test proves the rule ships, non-placeholder, both templates                            | Run the harness test; read it, then mutate           | A presence-only or `assert.ok(true)` test -> reviewer confirms it asserts real matrix content for BOTH service and site, and that gutting the rule makes the test fail                                                                              |

## Global checks

| #   | Promise                                      | How the adversary verifies                                                                                                                                                                                      |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | Nothing broke: zero errors AND zero warnings | `npm run check` + `npm run build`; require 0/0 across the repo                                                                                                                                                  |
| G2  | No new faked hard hook                       | `.claude/hooks/` still holds only block-secret and block-protected-branch; `settings.json` wires no test-first hook. The failing-test block is the pre-existing gate, not a new invention claimed by this phase |
| G3  | Honest scope                                 | No new CLI command, no coverage-percentage enforcement claimed. Check `src/` and the spec's out-of-scope                                                                                                        |

## Verdict

Each row: **CONFIRMED** (with pasted evidence) or **REFUTED** (with what was missing). No row on
narration. One REFUTED = not delivered until corrected.
