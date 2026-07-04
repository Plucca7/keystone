# Test-first by risk -- spec

> Phase 3 of enriching Keystone. Tracked by issue #3. Built rules-first: one harness rule the agent
> follows. This spec is the source of truth; when it and the code diverge, the spec wins. The
> adversarial acceptance contract is in `acceptance.md`.

## The request, restated

The constitution already says every change ships with a test, and the gates already block shipping
on a red test. What is missing is the judgment in between: **which** changes must be written
test-first (the test watched to fail before any code), which need a regression test, and which are
judged by risk. Without it, either everything is gold-plated with up-front tests or the risky paths
are proven only after the fact. This phase adds that matrix as a harness rule, tied to the
work-level router and the constitution.

## Done-target (verifiable)

1. Every generated project ships `.claude/rules/test-first-by-risk.md`: a risk matrix stating, per
   kind of change, whether it is test-first (business rule/money/data and security/auth/permissions:
   always), regression-test (a bug fix: always), test-by-risk (general feature, simple UI), automatic
   validation (config), or optional (a throwaway spike) -- with real guidance, not a stub.
2. The rule declares its enforcement honestly in two tiers: the **hard floor** (nothing ships on a
   red gate) already exists via the pre-push gate, `check`, and the verify step -- this rule does not
   re-implement or fake it; the **matrix** (classifying a change, judging the risk) is a **rule** the
   agent follows, because no script can tell a "business rule" change from a "simple UI" one.
3. The rule connects to what is already built: the work-level router turns `tdd-by-risk` on from
   level 2 up, and the constitution's "a change ships with a test" is the baseline this refines,
   never loosens.
4. A test proves the rule ships in every generated project (both templates) with its real matrix,
   not a placeholder. `keystone check .` green.

## Out of scope (now)

- Turning the matrix into a hard hook -- classifying a change is judgment; a hook there would be
  false confidence.
- Any new CLI command.
- Measuring coverage or enforcing a coverage percentage -- the constitution already rejects
  coverage-percentage as the measure; focus is on the critical paths.

## Enforcement tiers (declared honestly)

- The rule **shipping** is deterministic mechanics -- a test proves the file and its matrix exist.
- The **hard floor** it points to (no shipping on a failing test) is a real, pre-existing guarantee
  (pre-push + `check` + verify), not something this phase invents.
- **Applying the matrix** (is this change a business rule? did the risk warrant test-first?) is a
  **rule** the agent follows in the open -- judgment, not a machine check.
