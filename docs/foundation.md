# Foundation Pillar — full rule

> The Foundation pillar, in full. Overview in [pillars.md](pillars.md).
> Essential level. 🔧 = backed by an automatic check that runs today.

> **Status — what is built today:** only three commands exist. `new` scaffolds a new project.
> `check` runs three text guards over files (exposed secrets, oversized files, dangerous patterns)
> plus the project's own gates (format, lint, types, tests, dependency audit). `analyze` is
> read-only (reports only) and runs exactly six
> presence checks: exposed secrets, `.gitignore` completeness, presence of tests, presence of a
> README, basic database-convention text checks, and oversized files. Everything else in this
> pillar — including the structure-verification and accessibility checks below — is the **standard
> the scaffold aims for**, not behavior already delivered. The 🔧 symbol marks only what runs today
> (in `check`: the text guards and the project's own gates, plus the six `analyze` checks); treat
> every non-🔧 point as the target, not as something implemented.

## Principle

The base everything else is built on. The goal is a base that is identical in every project, so
nobody has to relearn where things live. It covers the platform decisions (fixed) and the things
asked of the user at setup.

## 1. The same organization in every project

- The intent is a single internal structure (a fixed place for each kind of thing) that is **the
  same in every project**, so anyone opening any project already knows their way around.
- Planned: an automatic check that verifies the expected structure exists. Not built yet.

## 2. Accessible by default

- The target: usable by people with disabilities (sight, hearing, keyboard-only navigation).
- Contrast, alt text, visible focus, large touch targets — meant to be the default, not an option.
- Planned: an automatic check that flags the most common accessibility errors. Not built yet.

## 3. Local formatting

- The aim is for dates, money, numbers, IDs, and phone numbers to appear **in the user's country
  format** through a shared formatting layer, rather than each screen formatting by hand.

## 4. Localization

- The plan is for the translation layer to be in place, with a **starting language** (asked at
  setup) and room to add more with no rework.
- The standard: no hardcoded strings on screen — everything routes through the translation layer.

## 5. Responsiveness is foundation

- The target is a project that works well on any screen. The only choice is the **priority**
  (mobile / desktop / both), asked at setup.

## 6. Visual identity belongs to the project

- The intent is a shared visual foundation (base fonts, spacing, rhythm), with the **personality**
  (color, brand font) belonging to each project — generated for the project, imported, or a neutral
  default.

## Asked of the user at setup

Name, project type, starting language, screen priority, look and feel. See
[setup-wizard.md](setup-wizard.md).
