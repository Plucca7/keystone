# Keystone

> Start a project that is born to professional standards — without building the foundation by hand.

*Keystone — the stone that holds the whole arch together. A project's foundation, in place from day one.*

**Status: in development — a stage, not a permanent state.** The scope is fully specified (8 quality
pillars, command flow, behavior, identity), and implementation is underway toward a finished release.
A LZR-specific version of the `new-project` command already works today against internal templates;
this repository documents the generic product it is becoming.

---

## What it is

A family of commands that scaffolds a new software project with professional foundations already
built in, and stays with the project through its life. It is aimed at **solo developers and small
teams** who want to start right and fast, without having to be experts in project setup.

It is **not an AI product and does not charge for AI.** Everything that ships by default is
deterministic and free — formatters, linters, tests, rules, configuration. When intelligence is
genuinely useful (for example, deriving the project's visual identity, or analyzing an existing
project), it uses the **AI assistant the developer already codes with** — never a paid layer of
its own.

## What it covers — the 8 pillars

A project created with it is born covering, end to end:

- **Foundation** — one consistent structure; accessible by default; locale-aware dates and money;
  starting language and screen priority asked up front, never assumed.
- **Code quality** — auto-formatting on save; blocks any error or warning before it ships; flags
  files that grew too large; comments the *why*, not the obvious.
- **Database** — created/updated timestamps on everything; soft delete (nothing truly disappears);
  versioned, repeatable migrations; unguessable identifiers.
- **Tests** — born with each feature; cover the happy path *and* the failures; a failing test
  blocks shipping; focus on what matters, not a coverage number.
- **Workflow** — three branch levels (official / staging / working); a review gate; a task board and
  session hand-off out of the box; authorship recorded on every delivery.
- **Ship it** — auto-deploy after the checks pass; a staging copy before production; one-gesture
  rollback; secrets kept out of the code.
- **Security** — essential at birth, reinforced when needed; checks on the dev machine *and* before
  shipping; abuse protection on by default; the AI-driven layer optional and off.
- **Documentation** — decisions become short records; docs generated from code where possible; born
  with the project; entry points get a clear manual.

## The commands (the family)

- **`new-project`** — scaffold a new project, ready to work.
- **`analyze-project`** *(designed, not built)* — measure an existing, living project against the
  pillars: distance to the standard, an upgrade plan, and an estimate of cost and risk.
- **session hand-off** — pick up where you left off; reads the project's own journal.
- **ship help** — assist going live once hosting is chosen.

## How it works, in short

1. **Product briefing** — name, type, language, screen priority, look, sensitivity (six quick questions).
2. **Technical setup** — where to version (GitHub / GitLab / local only), visibility, parent folder.
3. **It deduces what it can** — whether a database is needed (from type + sensitivity), the security
   level, the visual foundation. It does not ask what it can figure out.
4. **It builds everything** — folder, repository, three branches, task board, database (if needed),
   visual identity, ship pipeline scaffold, automated checks, first commit.
5. **Confirmation** — a summary of what was created and the next steps.

## Honest boundaries

- It **does not create accounts on third-party services** for you (database, hosting). Those are
  yours; it uses a key you provide **once**, stores it safely outside the code, and reuses it on the
  next project.
- Migrations run through the database's **own official tooling**, with no AI involved.
- The generic version is **still being built**. What is real today is the LZR-specific `new-project`;
  the rest of this document is the specified design, not shipped software.

## Roadmap

- ✅ Scope specified — pillars, wizard, end-to-end flow, product soul
- 🚧 Generic implementation — in progress
- ⬜ `analyze-project` — designed, not yet built
- ⬜ Each pillar's detailed ruleset — to be written
- ✅ License — MIT

## Contributing

This project is **open**: anyone can read it, use it, and propose improvements. Contributions never
land directly in the official version. A proposal is made on a **separate copy**, runs through the
**automated checks** (formatting, tests, standards), and only what passes reaches a **maintainer**,
who has the final say — approve, request changes, or decline. The automated gates filter most issues
before review; the maintainer is the gate for the rest. This keeps the project open to the community
without letting quality drift.

## License

MIT — free to use, modify, and distribute (including commercially), as long as the copyright notice
is kept. See [LICENSE](LICENSE).
