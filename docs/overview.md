# Overview

> **What this is:** a plain-language overview of the project-scaffolding command family — who it
> serves, what it aims to deliver, and how far it reaches. See [pillars.md](pillars.md),
> [setup-wizard.md](setup-wizard.md) and [commands.md](commands.md).
>
> An open, unbranded standard: any team can adopt it as a common foundation.
>
> **Status:** three commands are implemented today — create a new project (`new`), run the
> automatic checks (`check`), and analyze an existing project (`analyze`, read-only). Everything
> else described below is a planned direction, not a delivered feature, and is flagged as such.

---

## Who it's for

**A solo developer getting started + a small team / startup.**
Someone who can code (or is learning), working alone or in a lean team. **Not** a total beginner,
**not** an agency. They want **speed and quality without the work of assembling the foundation**.

This sets the register: it speaks the language of people who code, without explaining the basics,
but stays welcoming to those just starting out.

## What it aims to deliver

**Start a project whose folder already carries a high-standard foundation — without assembling it by
hand.** The standard lives inside the template (the `web` and `api` templates): the quality configs,
git hooks, CI workflow files, example tests and project structure are all part of the template. The
`new` command copies that template into place, so a fresh project is born with those files present —
then starts version control, installs dependencies, and switches on the git hooks. Running the
tests and wiring up CI remain steps the developer takes afterward.

## How far it reaches

The aim is a **command family that follows the life of the project** — not a one-shot scaffolder
that disappears after setup.

Implemented today:

- **`new`** — copies the standard template into a new folder and adjusts the few variable points: it
  renames the package, records how the project was created (`keystone.json`), and deduces two
  choices from what the user already said (whether it needs a database, and its security level). It
  then starts version control with a first commit, installs dependencies, and — through that
  install — activates the git hooks (both steps skippable with `--no-git` / `--no-install`). It does
  **not** create a _remote_ repository, push, provision or connect a database, or run migrations —
  those stay the developer's to set up.
- **`check`** — the fast text guards (exposed secrets, oversized files, dangerous patterns) plus the
  project's own gates: its formatter, linter, type-checker, tests, and a dependency audit, run and
  blocking on failure (`--no-gates` runs only the guards). Zero AI cost.
- **`analyze`** — read-only analysis of an existing project: six presence checks that report which
  parts of the standard are and aren't there.

Planned (in development, not yet built):

- **Guided design step** — a step that generates the project's visual identity through the
  developer's own assistant.
- **Deep upgrade plan** — `analyze` already prints its three-part report (state, prioritized plan,
  and fixed indicative effort/risk classes per check); what remains planned is the deeper,
  project-specific cost/risk judgement, done by the developer's own assistant.
- **Session hand-off / resume** — one action to close a work session (recording what was done and
  where things stand), another to resume it (reading that record so the next session picks up
  without re-explaining context).
- **Ship-it assistance** — help getting a project live once the developer chooses the hosting.

The distinction that holds this together: the **quality files are born inside the project and stand
on their own** — once the developer installs dependencies and uses git, the deterministic checks and
tests run from the project itself, with no command present. The **command family acts again when
called**, to do new work. One is not the other.

## The quality pillars

The **8 pillars**, end to end: Foundation, Code quality, Database, Tests, Workflow, Ship it,
Security, Documentation. Detail in [pillars.md](pillars.md).

---

## The AI is the developer's own, not a hosted service

The commands **bring no AI of their own and charge nothing for AI**. Any intelligence used — such
as the planned design step that generates the project's visual identity, or a future upgrade plan
built on `analyze` — is designed to run on the **assistant the developer already uses to code**
(Claude, or another). There is no separate service cost. (Today's shipped commands are all
deterministic: `new` copies and records, `check` scans for secrets and oversized files, and
`analyze` runs its presence checks — none of them call an AI.)

Any optional AI on top is **always the one in the developer's own environment** — never a separate
paid layer. The commands that exist today are deterministic and free — they call no AI. Only optional, planned
work (a visual-identity step, a deeper analysis) would lean on the assistant that is already there.
