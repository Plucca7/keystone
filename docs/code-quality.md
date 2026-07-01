# Code Quality Pillar — full rule

> The full rule behind the Code quality pillar. Skeleton in [pillars.md](pillars.md).
> Essential level. 🔧 = backed by an automatic check that runs **today**.
>
> **Status — what is actually built:** only three commands exist: `new` (scaffold a project),
> `check` (run deterministic guards over files), and `analyze` (read-only report on an existing
> project). Today `check` runs exactly **two** guards — an exposed-secret scan and an oversized-file
> check — and nothing else. `analyze` runs six presence/convention checks (exposed secrets, `.env`
> ignored, has tests, has a README, basic database-convention text checks, oversized files). For this
> Code quality pillar, the only guard that runs today is the **oversized-file check**. Everything else
> described below — automatic formatting, a zero-errors/zero-warnings blocker, complexity measurement,
> and any publish-time gate — is the **target**, not built yet. This is the standard the scaffold aims
> for, not a delivered pipeline.

## Principle

The machine should handle the tedium — formatting, checking, blocking — so people can focus on what
matters. The aim is for everything to run on its own, deterministically, at zero AI cost.

## 1. Formatting that fixes itself

- **Planned.** The target: the scaffold ships a formatter config so an editor set to format on save
  applies it as you write, and the `check` command enforces it either way.
- The goal is that no one decides or debates style — the formatter handles it.
- **Not built yet:** there is no formatter config in the scaffold today and the `check` command does
  not enforce formatting. The two guards `check` runs today are the secret scan and the oversized-file
  check.

## 2. Any error or warning blocks shipping

- **Planned.** The target: a **zero errors, zero warnings** rule so nothing flawed goes out, covering
  code errors, warnings, and leftover cruft (commented-out blocks, debug markers).
- **Not built yet:** the `check` command does not run a lint/error/warning blocker today. Its two
  guards are the exposed-secret scan and the oversized-file check. Re-running checks automatically
  before a project is published (a publish-time gate) is also **planned**, not built.

## 3. Flags anything that grew too large

- A file that got large and hard to follow **triggers a warning** to split it into smaller pieces,
  before it snowballs.
- 🔧 The oversized-file check measures size and runs today — it is one of the two guards `check` runs,
  and it is also one of the six checks `analyze` reports. (It measures file size only; complexity
  measurement is **planned**, not built.)

## 4. Comment the "why," not the obvious

- Comment where the logic **isn't self-explanatory**: an architectural decision, a trade-off, a
  business rule, a workaround for a library or framework limitation.
- Don't comment the trivial (the variable name already says it).

## 5. Clear names and readable code

- Descriptive names; short functions with a single responsibility.
- Code that reads on its own, without a comment for the obvious — comments are reserved for the "why."

## References

Established style guides, plus (as it is built out) a formatter config and the `check` command's
deterministic checks. Today the `check` command's Code-quality contribution is the single
oversized-file guard; the rest of the check suite is the target and grows with the project.
