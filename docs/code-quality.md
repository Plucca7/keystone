# Code Quality Pillar — full rule

> The full rule behind the Code quality pillar. Skeleton in [pillars.md](pillars.md).
> Essential level. 🔧 = backed by an automatic check that runs **today**.
>
> **Status — what is actually built:** three commands exist: `new`, `check`, and `analyze`. `check`
> runs two layers — fast text guards (exposed secrets, oversized files, dangerous patterns) and the
> project's own gates (its `format:check`, `lint`, `typecheck`, `test`, and a dependency audit), each
> blocking on failure. For this Code quality pillar, that means the **oversized-file** text guard plus
> the **formatting, lint, and type** gates run today. Still the **target**, not built: complexity
> measurement, and re-running the gates automatically at publish time. This is enforcement on demand,
> not yet an automatic publish-time pipeline.

## Principle

The machine should handle the tedium — formatting, checking, blocking — so people can focus on what
matters. The aim is for everything to run on its own, deterministically, at zero AI cost.

## 1. Formatting that fixes itself

- The template ships a formatter config, so an editor set to format on save applies it as you write.
- 🔧 The `check` command enforces it either way: its project gates run the project's own
  `format:check` script and **block** when formatting drifts.
- The goal is that no one decides or debates style — the formatter handles it.

## 2. Any error or warning blocks shipping

- 🔧 The `check` command runs the project's own linter and type-checker as blocking gates
  (`lint`, `typecheck`), so an error or warning stops the check. This is the **zero errors, zero
  warnings** rule, enforced on demand.
- **Planned:** wiring that same gate to re-run automatically before a project is published (a
  publish-time gate) is still the target, not built.

## 3. Flags anything that grew too large

- A file that got large and hard to follow **triggers a warning** to split it into smaller pieces,
  before it snowballs.
- 🔧 The oversized-file check measures size and runs today — it is one of the text guards `check`
  runs, and it is also one of the six checks `analyze` reports. (It measures file size only; complexity
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
