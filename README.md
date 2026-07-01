# Keystone

> Start a project born to professional standards — built by a well-harnessed AI agent, without building the foundation by hand.

_Keystone — the stone that holds the whole arch together. A project's foundation, in place from day one._

**Status: in development.** Three commands work today: `new` scaffolds a project, `check` runs the
automated checks over a project, and `analyze` measures an existing project against the standard
(read-only). Everything beyond these three is planned and not yet built.

## What it is

A family of commands that scaffolds a new software project with professional foundations already
built in — and is designed to stay with the project through its life. For **solo developers and
small teams** who want to start right and fast, without having to be experts in project setup.

Keystone **doesn't sell AI or charge for it**. The product foundation is deterministic and free
(formatting, checks, tests, rules) — quality never depends on paid inference. And the agent that
builds the project runs under a harness powered by **the AI you already code with** — never a
separate paid layer.

The full rationale, the **8 quality pillars**, the product design, and the build plan are in [docs/](docs/).

## Two layers

Keystone is two complementary layers — one for _what_ gets built, one for _who_ builds it.

- **Layer A — Product Foundation** _(deterministic, zero-cost)_. The product is born solid without
  depending on AI: the 8 pillars ship as deterministic verification — formatters, linters,
  type-checkers, tests, and CI/CD gates.
- **Layer B — Agent Harness** _(planned)_. The project is built by an AI coding agent — the
  assistant you already use. Layer B is the harness planned for that agent: context engineering,
  spec-driven development, subagents (isolated-context reviewers — spec, code, security), and
  guardrails (lifecycle hooks that block off-standard behavior). This layer is in development and
  not yet part of the three shipping commands.

The line is drawn deliberately: product quality (A) is deterministic and free, while the building
agent (B) is designed to get a first-class harness that runs on your own AI. The harness applies to
_building_ the code, not to _guaranteeing_ its quality.

## Requirements

- **Node.js 24+** — it runs the TypeScript sources directly. No build step, no dependencies.

## Usage

```bash
# create a new project (asks a few questions)
node src/index.ts new my-app

# run the automated checks over a project (exposed secrets, oversized files)
node src/index.ts check .

# measure an existing project against the standard (read-only)
node src/index.ts analyze .
```

Once published, these become `keystone new`, `keystone check`, `keystone analyze`.

## Development

```bash
node --test tests/*.test.ts   # run the test suite
node src/index.ts check src   # Keystone runs its own checks and passes
```

## Layer A — the 8 pillars

Foundation · Code quality · Database · Tests · Workflow · Ship it · Security · Documentation.
Each is detailed in [docs/pillars.md](docs/pillars.md).

## Contributing

Open to the community, with the maintainer in control — nothing lands unreviewed.
See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) — © 2026 Paulo de Lucca. Free to use, modify, and distribute, including commercially.
