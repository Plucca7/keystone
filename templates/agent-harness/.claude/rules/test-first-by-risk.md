# Test-first by risk -- match the proof to the stakes

> Not every change earns a test written before the code, and none may skip a test entirely. This
> rule sets which changes are test-first (the test is written and watched to fail before any code),
> which need a regression test, and which are judged by risk -- so a payment path is proven up front
> and a copy tweak is not gold-plated.
>
> (No `paths` scope on purpose: this governs how any change is proven, not a file type, so it loads
> every session.)

## The matrix

| Kind of change | The rule |
| --- | --- |
| Business rule, money, or data | **Test-first, always.** Write the test, watch it fail, then the minimal code, then watch it pass. |
| Security, auth, or permissions | **Test-first, always.** Same, plus the unhappy paths: no permission, bad input, abuse. |
| A bug fix | **Regression test, always.** A test that fails before the fix and passes after, so the bug cannot return. |
| A new feature (general) | **Test-first where the risk warrants it**; at a minimum a test ships with it. |
| Simple UI / presentation | **Test by risk** -- cover the states that can break (empty, loading, error); skip the trivial. |
| Configuration | **Automatic validation** -- a check that the config is well-formed, not a hand-written unit test. |
| Spike / prototype (throwaway) | **Test optional** -- proving an idea, not shipping it; when it becomes real, it re-enters the matrix. |

The top two rows are not negotiable: business rules and security are where a silent mistake is most
expensive, so the proof comes first, before the code exists to be wrong.

## How it connects

- The work-level router (`work-level-routing.md`) turns `tdd-by-risk` on from level 2 upward; this
  matrix is what that capability means in practice.
- The constitution's "a change ships with a test" is the baseline this refines, never loosens.
- The verify step (`verify-against-done-target.md`) is where the resulting tests are checked against
  the done-target before "done".

## Enforcement tier

Two tiers, honestly split -- do not confuse them:

- **Hard (already enforced, not invented here).** Nothing ships on a red gate: the pre-push gate and
  `check` block a failing test, and the verify step confirms the gates are green. That floor is a
  real guarantee this rule relies on but does not re-implement.
- **Rule (this matrix).** Whether a given change is "business rule" or "simple UI", and whether the
  risk warranted writing the test first, is judgment no script can make. The matrix is the agent's
  discipline, applied in the open -- a hook pretending to classify a change would be the false
  confidence this harness refuses.
