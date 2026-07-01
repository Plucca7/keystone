# Workflow Pillar — full rule

> The full rule behind the Workflow pillar. Skeleton in [pillars.md](pillars.md).
> Open collaboration in [the open-project guide](README.md). 🔧 = automatic check.
>
> **Status:** this pillar is the **standard the scaffold aims for** — mostly **planned, not yet
> built**. What runs today are three commands: creating a new project, running the automatic checks,
> and analyzing an existing project read-only. Everything below about branch levels, review gate,
> task board, worktrees, authorship recording, session hand-off, and community-contribution intake
> describes the target design — none of it ships as a working gesture yet.

## Principle

The "how work happens" is meant to come pre-assembled, so a project would be born organized and never
lose the thread between sessions. The same structure is what would let a project open up to a
community without turning into chaos.

## 1. Three levels (planned)

- The design calls for three lines: **official** (what is live / done), **staging** (what is being
  integrated), and **daily work** (each person's active branch). The intent is that the official line
  is never edited directly.
- The standard also calls for each independent line of work to get its own isolated workspace. This
  is part of the planned design, not a built behavior.

## 2. Review gate before the official branch (planned)

- The standard is that every change would pass a **review** before entering the official line — the
  gate existing even for a solo developer, with the automatic checks reviewing alongside it.
- This gate is not yet built. When it exists, the aim is that only what passes the checks and the
  review reaches the official line. Community proposals are meant to run through the same kind of
  filter — see the contribution flow in [README.md](README.md) — but that intake is likewise part of
  the planned design, not something that receives contributions today.

## 3. Task board (planned)

- The design is for a project to be born with a **board** (to do / doing / done) already set up, so
  progress is visible from day one. This is planned, not yet part of what the scaffold produces.

## 4. Session hand-off (planned)

- The design calls for two paired actions: one that closes a work session, recording what was done and
  where things stand, and one that resumes it, reading that record and picking up without re-explaining
  context. The goal is that each session would leave the path ready for the next. Not yet built.

## 5. Author on every delivery (planned)

- The standard is for every delivery to record **who did it** (a person or an AI agent), since several
  contributors may work on the same project. It is meant to tie into the database audit trail. This
  authorship recording is part of the planned design, not a built behavior.

## 6. Tests on every delivery (planned)

- The design is for the check suite to run on every delivery, with the suite growing over time. See
  [tests.md](tests.md).
- 🔧 The automatic checks (code quality + tests) exist and can run today; wiring them into a review
  gate on every delivery is the planned part.
