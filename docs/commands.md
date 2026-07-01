# Project-creation flow — end to end

> **What this is:** the sequence the `create a new project` command runs, from the initial
> command to a project folder on disk. It also describes the setup decisions the command records
> and the many pieces that are still the standard the scaffold aims for, not delivered behavior.
> See [pillars.md](pillars.md) and [setup-wizard.md](setup-wizard.md).
>
> **Status:** the `create a new project` command is implemented, but narrowly. What it actually
> does is: copy the official mould (web or api) into a new folder, rename the package, write a
> `keystone.json` record, and deduce two settings (whether a database is needed, and the security
> level) from the answers. **That is the whole command.** The mould it copies already _contains_ the
> quality setup — the delivery-pipeline files, the git hooks, the lint/format/type configs, and
> example end-to-end tests — so a new project is **born with those files present**, but the command
> **does not run, install, or switch on any of them**. Those only take effect once the developer
> installs dependencies and starts using git. Everything else this document references — creating a
> repository, the first commit and push, provisioning and connecting a database, the stored service
> key, migrations, and the guided design step — is **planned, not built**. Each is flagged inline
> below.

---

## Step 0 — Start

Run the command from anywhere. **No folder or repository needs to exist first.**

## Step 1 — Round A: product briefing (minimal wizard)

Questions, one at a time:

1. Project name
2. Project type
3. Starting language
4. Screen priority (mobile / desktop / both)
5. Visual identity → **guided design step** _(planned)_ · **import an existing design** _(planned)_ ·
   **decide later**
6. Does it handle sensitive data or money?

## Step 2 — Round B: technical setup

- Where to version (with a cloud remote, or local-only) — recorded as a preference; the command
  does **not** create or connect a repository (see Step 4)
- Visibility (public / private) — recorded, not applied
- Parent folder (where on the machine to create the project folder)

## Step 3 — Deductions (decided automatically, not asked)

- **Needs a database?** — inferred from project type + sensitivity, and recorded
- **Security level** — essential, or reinforced if sensitive, and recorded
- **Visual foundation** — fonts, spacing, accessibility, locale formatting: these live in the mould,
  so every copied project starts with them in place

## Step 4 — Creation (what the command actually does)

The command does exactly four things:

1. **Copies the project folder** into the parent folder — a byte-for-byte copy of the official
   mould (web or api), skipping installed dependencies.
2. **Renames the package** — changes only the `name` in `package.json` to the project name.
3. **Writes a record** (`keystone.json`) noting the mould used, the answers, and the deductions.
4. **Deduces two settings** (database needed?, security level) and stores them in that record.

Nothing else runs. In particular:

- **Repository.** _Planned._ The command does **not** create a repository, initialize git, make a
  commit, or push anywhere. The "where to version" answer is only recorded.
- **Three version levels** (official / staging / working), the review gate, and the protection
  rules on the official branch. _Planned._ These are the standard the scaffold aims for — not built.
- **Standard organization** — the task board and session hand-off (close a session / resume it, plus
  a daily log and a hand-off record). _Planned._ None of these run today, and the folders that would
  hold them are not created as working behavior.
- **Database.** _Planned._ The command does **not** provision a database, connect one, store or
  reuse a service key, or run migrations. When a database is inferred, that fact is only recorded in
  `keystone.json`; setting it up is left to the developer.
- **Visual identity.** _Planned._ The guided design step and the import-an-existing-design path are
  not built. Every project simply starts with the mould's default look and its visual foundation
  (fonts, spacing, accessibility, locale formatting), which ship inside the mould.
- **Deploy / hosting.** _Planned._ The delivery pipeline, the staging environment, and the automated
  deploy are the standard the scaffold aims for — not built. The mould **contains** the
  delivery-pipeline files, but the command does not wire up or trigger any deploy. Deploy and hosting
  are entirely up to the developer, who decides where and how to host.
- **Automatic checks** (quality, tests, security). The mould **contains** them: the git hooks
  (a pre-commit that runs the staged-file linter, a commit-msg check, and a pre-push that runs the
  type-check and the tests), the lint / format / type configs, and example end-to-end tests are all
  present in the copied folder. But the command does **not** install dependencies or activate the
  hooks. They start working only after the developer installs dependencies and uses git — that is
  when the checks run on the machine. _Planned:_ re-running the same checks as a blocking gate at
  publish time is the standard the scaffold aims for — not built.

## Step 5 — Final confirmation

A summary of what was created: the local folder (a renamed copy of the mould), the recorded
answers and deductions, and whether a database was inferred as needed — plus the developer's next
steps (install dependencies, initialize git, and so on). No repository, database, or deploy exists
yet; those are the developer's to set up.

---

## Principles the flow honors

- **Only asks about taste** (the user's own preferences); infers the project shape; and copies a
  foundation that already carries the standard files. See [setup-wizard.md](setup-wizard.md).
- **Runs on its own, at zero AI cost.** The command today uses no AI at all — it copies, renames,
  and records. AI would enter only in the optional design step, which is planned, not built.
- **Secrets out of the code.** The intended design keeps service keys in the user's environment,
  reusable — but the command does not yet take, store, or use any key.
- **The command never creates a third-party account** (database, hosting) — that stays the user's.
  Today the command does not touch third-party services at all.
