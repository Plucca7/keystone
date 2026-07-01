# Platform Roadmap

> Master document for **platform** improvements — everything that affects how we build code (templates, shared configs, reusable CI, the `/new-project` skill, governance).
>
> This is NOT the product backlog. Those live in each product's own repo.

## Philosophy

The platform exists to **speed the team up, not slow it down**. We invest in improvements when:

1. **There is real pain** — some product has felt the impact of its absence
2. **The ROI is clear** — implementation effort << operational gain
3. **Product maturity calls for it** — there is no point in having Lighthouse CI before you have a paying customer

> Falling into "platform engineering" before the product has traction is a classic antipattern. This roadmap is deliberately **demand-driven**, not aspirational.

## Categorization

Each improvement lands in one of 3 layers:

| Layer | When to tackle | Criterion |
|--------|---------------|----------|
| 🔴 **Critical** | When the first product has 2-3 paying customers | "Without this, the product can break in prod with nobody noticing" |
| 🟡 **Important** | When the first product has 10+ customers or a second product is active | "Greatly raises perceived quality and team velocity" |
| 🟢 **Refinements** | When there is specific pain or a dedicated platform team | "Optional excellence, cost-benefit varies a lot" |

## Roadmap by layer

> The items below are placeholder examples. Replace them with your own, referencing each tracking issue as `#NUMBER`.

### 🔴 Critical

- **#1** Security baseline in the templates — Dependabot + CodeQL + dependency audit
- **#2** Coverage threshold in the reusable `ci.yml` (minimum 80%, fail PRs below it)

### 🟡 Important

- **#3** Bundle size tracking + Lighthouse CI — enforced performance budget
- **#4** Preview deployments per PR — documented in the templates

### 🟢 Refinements

- **#5** Dev container (`.devcontainer.json`) in the templates — onboarding in <10 min

## How to use this document

- **Add an item**: open an issue in `github-ops` with the label `platform` + `priority:critical|important|refinement` + the appropriate `area:*`. Update this doc with `#NUMBER`.
- **Tackle an item**: move the issue to `In progress` on the platform roadmap board. The project-router workflow does this automatically when you open a linked PR.
- **Reprioritize**: edit this doc + the issue label. The doc is the storyteller; the board is the operational tracker.

## Conventions

### Labels

- `platform` — all platform improvement issues (vs `bug`, `feat`, etc.)
- `priority:critical` / `priority:important` / `priority:refinement`
- `area:ci` / `area:templates` / `area:skill` / `area:observability` / `area:security` / `area:testing` / `area:performance`

### Definition of Done for a platform item

1. Change propagated to the templates (web + api) where applicable
2. Change propagated to the `/new-project` skill if it is a setup-time change
3. Documentation in the Engineering Handbook (or an ADR if it is an architectural decision)
4. Handbook version bumped (governance changelog)
5. Issue closed → automatically moves to `Done` on the board
