# Documentation Pillar — full rule

> The Documentation pillar of Keystone, in full. Overview in [pillars.md](pillars.md).
>
> **Status:** three commands are built today — create a new project (`new`), run the automatic
> checks (`check`), and analyze an existing project (`analyze`, read-only). `check` runs three text
> guards (exposed secrets, oversized files, dangerous patterns) plus the project's own gates (format,
> lint, types, tests, dependency audit). `analyze` runs six
> presence checks (exposed secrets, `.gitignore` completeness, presence of tests, presence of a
> README, a basic text scan of database conventions, and oversized files). Everything else on this
> page — decision records, docs generated from the code, the API usage guide, the honesty of a
> presentation — is a **planned direction** describing the standard the scaffold aims for, not a
> delivered feature.
>
> 🔧 = backed by an automatic check that runs today. On this pillar, only one item qualifies: the
> `analyze` command checks that a project has a README at its root. Nothing else here is enforced by
> a check yet.

## Principle

Documentation is born with the project, written as the work happens, and kept alive without drifting
into fiction. It records the _why_ behind decisions, not only the _what_.

## 1. Decisions become permanent records

- Every important architectural decision becomes a **short record**: what was decided and **why**.
- A year later, anyone can understand the reasoning without reopening the same discussion.
- _Planned:_ this is a working convention, not something a check enforces today.

## 2. Documentation generated from the code

- Documentation of how the system works internally is **generated from the code itself** whenever
  possible. It travels with the code and never ages into a lie.
- _Planned:_ automatic generation is the target, not a delivered feature.

## 3. Born with the project

- Written **while the system is being built**, not at the end. The project starts with its
  presentation (what it is for) and accumulates records as decisions are made.
- 🔧 The only automatic guardrail today is the `analyze` command flagging a project that has **no
  README** at its root. It confirms the presentation exists; it does not judge what the README says.

## 4. Entry point with a usage guide

- If the system exposes an entry point for other systems to talk to it (an API), that entry point
  comes with a **clear usage guide** — whoever integrates never has to guess.
- _Planned:_ no check verifies the usage guide today; this is the standard the scaffold aims for.

## 5. Documentation language

- **Technical documentation in English** (the project presentation, decision records, API usage
  guides, code comments) — the international standard.
- Text the end user reads on screen stays **in the product's language**.

## 6. An honest presentation

- The project presentation describes what it **actually does**, what it covers, and where it does not
  yet reach. No empty promises. See the example in [README.md](README.md).
