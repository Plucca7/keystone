# Tests Pillar — full rule

> The Tests pillar rule in full. Outline in [pillars.md](pillars.md).
> Essential level. 🔧 = backed by an automatic check that runs today.
>
> **Status:** only three commands are built — `new` (scaffold a project), `check`, and `analyze`.
> `check` runs exactly two deterministic guards over files: an exposed-secret scan and an
> oversized-file check. `analyze` is read-only and runs six presence checks — exposed secrets,
> `.gitignore` completeness, presence of tests, presence of a README, basic database-convention text
> checks, and oversized files. Nothing else is built. In particular, **no command runs the test
> suite**: `analyze` only checks whether test files _exist_, and there is no runner and no
> publish-time gate. Everything below about running the suite, blocking on failures, or re-running
> before publishing is the **target** this pillar aims for, not a delivered pipeline.

## Principle

The safety net that gives everything else its teeth: without tests, Code quality's "always blocks"
and Ship it's "ships itself" would have nothing to stand on. It is an adversarial verifier that runs
at zero cost.

## 1. A test is born with the feature

- Every new feature **comes with its test**, from day one. The net grows with the project.
- No "test it later" (which turns into "later, never").

## 2. Cover the happy path AND the unhappy paths

- Test normal use **and** the bad situations: invalid input, abuse, no permission, boundary cases.
- This is where robustness and security live (it connects to "never trust incoming input").

## 3. If it fails, it doesn't ship

- A failing test should **block shipping**, automatically. The net has teeth.
- **Planned:** an automatic check that runs the suite on the machine and re-runs it before
  publishing. Today no command runs the suite — `analyze` only reports whether test files exist. The
  runner and the publish-time gate are the **target**, not built yet.

## 4. Focus on what matters, not on a number

- Cover the **critical paths** well (money, login, customer data) without chasing a coverage percentage.
- Quality over quantity — no useless tests written just to hit a target.

## 5. Reliable tests

- Tests are **stable** (no random failures) and **independent** (order does not matter).
- A flaky test is treated as a bug, not ignored.

## References

Established testing guides. The **planned** automatic suite runner would grow the net with every
delivery. Today the only test-related check that runs is `analyze`'s presence check — it reports
whether the project has any test files, and does **not** run them.
