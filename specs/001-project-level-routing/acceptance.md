# Acceptance contract -- adversarial verification map (Phase 1)

> Written before the build, so the scope cannot quietly shift to fit what was delivered.
> The reviewer's mandate: **assume the delivery is a hollow shell (exists but empty) and try
> to prove it.** Only evidence the reviewer can run themselves counts -- no "trust me", no
> "almost", no screenshot without the command that produced it. A single REFUTED item drops
> the whole phase until it is fixed (no advancing with a red pending).
>
> All checks run from the repo root unless stated. Run the suite with
> `node --test tests/*.test.ts` and the gates with `node src/index.ts check .`.

## Milestone 1 -- the level router

| #    | Promise                                                             | How the adversary verifies (objective)                                                                                | Expected green                                                                                                         | Hollow-shell trap -> how it is caught                                                                                                                       |
| ---- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1.1 | One canonical definition of the 5 levels + a routing map            | Open `src/levels.ts`; count the levels; read the map                                                                  | 5 levels named; a map entry per level, each with a non-empty capability list                                           | Fewer than 5, or empty/placeholder entries -> reviewer confirms 5 non-empty entries and that the completeness test actually asserts (not `assert.ok(true)`) |
| M1.2 | `keystone new` deduces + records the birth level in `keystone.json` | Read the two `deduce` tests; scaffold a service with `sensitive:false` and one with `true`; open both `keystone.json` | non-sensitive -> `deduced.birthLevel: "new-product"`; sensitive -> `"critical-system"`                                 | Field missing, or hardcoded the same for both -> reviewer diffs the two `keystone.json` and sees the birth level differ by the sensitive flag               |
| M1.3 | Routing map is complete (5 levels, no gap, known capabilities)      | Run the levels test; read it                                                                                          | The completeness test passes and genuinely asserts every level is present, non-empty, and uses only known capabilities | A test that passes trivially -> reviewer reads it and confirms it fails if a level is removed or emptied                                                    |
| M1.4 | Tests prove it + `keystone check .` green                           | `node --test tests/*.test.ts`; `node src/index.ts check .`; read the new tests                                        | Both green; the new tests assert real behaviour                                                                        | Trivial/empty tests -> reviewer opens them and confirms they check the deduction and the map, not nothing                                                   |

## Milestone 2 -- the guardrails that actually block (each: red then green)

| #    | Promise                                                | How the adversary verifies (red -> green)                                                                                                                  | Hollow-shell trap -> how it is caught                                                                                                                                  |
| ---- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M2.1 | Pre-push blocks when `keystone check` fails            | **Red:** plant a type/lint error in a generated project and attempt a push -> the push is **blocked** (non-zero exit). **Green:** fix it, push -> proceeds | Pre-push exists but only warns, or never runs the check -> reviewer confirms the push is _blocked_ (exit != 0), not merely a printed warning                           |
| M2.2 | CI blocks a PR with no linked issue                    | **Red:** open a PR that references no issue -> the CI check **fails**. **Green:** link an issue -> passes                                                  | CI job exists but always passes -> reviewer confirms the no-issue PR actually fails the job                                                                            |
| M2.3 | CODEOWNERS review required on migration/security paths | **Red:** open a PR touching a migration path -> merge is **blocked** without the code-owner's review. **Green:** owner approves -> unblocks                | CODEOWNERS present but branch protection off, or paths do not match -> reviewer confirms the merge is actually blocked and the globs cover the migration/security dirs |

## Global checks (where most of the lie would hide)

| #   | Promise                                               | How the adversary verifies                                                                                                                                                                                                                                               |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| G1  | Nothing else broke: zero errors **and** zero warnings | Run the format/lint/type/test/build gates across the repo; require 0/0 everywhere, not only in touched files                                                                                                                                                             |
| G2  | No faked hard block for the two judgment items        | Search the hooks/settings for anything that claims to block "critical change without test" or "dependency without justification". If present as a hard hook -> **REFUTED** (they were promised as rules). If present, it must be clearly a rule/doc, not a blocking hook |
| G3  | Scope did not silently drift                          | Diff the delivered `src/levels.ts`, tests, rule, and CI against this map and `spec.md`. Any promise that shrank or vanished between spec and delivery -> **REFUTED**                                                                                                     |

## Verdict

Each row is recorded **CONFIRMED** (with the pasted command output / file excerpt as evidence)
or **REFUTED** (with what was missing). No row is accepted on narration. One REFUTED = Phase 1
not delivered until corrected.
