# Work-level routing -- match the process to the size of the work

> Not every change deserves the same ceremony. A one-line fix treated like a new product
> is wasted process; a payment flow treated like a typo is a hazard. This rule classifies
> each unit of work into one of five levels and turns on only what that level needs.
>
> (No `paths` scope on purpose: this governs how any work is approached, not a file type,
> so it must load every session.)

## The five levels

Pick the level for the unit of work in front of you, then apply the row's flow -- nothing
heavier, nothing lighter.

| Level | It is | Flow to apply |
|-------|-------|---------------|
| 1. Quick fix | a small correction to something that already exists (a typo, a copy tweak, a one-line bug) | a regression test that pins it + a review before it lands |
| 2. Small feature | a modest new behaviour inside an existing project | a short spec + a plan + tasks + test-first where the risk warrants it + review |
| 3. Product feature | a substantial capability with product/UX weight | discovery (product/UX) + spec + plan + tasks + TDD-by-risk + per-task subagents + review |
| 4. New product | a project built from nothing | discovery + spec + plan + tasks + TDD-by-risk + subagents + review (this is a project's *birth* level) |
| 5. Critical system | regulated, or handling money / sensitive data | everything in level 4 **plus** compliance (audit trail, regulatory checks) |

The scale is additive: each level does everything the lighter one does and more. The floor
is never "nothing" -- even a quick fix is pinned by a test and reviewed.

## Birth level vs work level

Levels 1--3 describe a unit of work *inside a project that already exists*. Levels 4--5 are
the only ones that describe a project's *birth*. When Keystone creates a project it records
that birth level in `keystone.json` (`deduced.birthLevel`) -- `new-product` normally, or
`critical-system` when the project handles sensitive data or money. That recorded baseline is
where this router starts; individual later changes are then classified 1--5 on their own merit.

## How to use it

1. Before starting, state the level out loud and why (one line) -- so the choice is visible
   and can be corrected before work begins.
2. Apply exactly that row's flow. Do not quietly downgrade a level-3 change to a level-1 flow
   to move faster, and do not gold-plate a quick fix with a full spec.
3. When unsure between two levels, take the heavier one -- under-processing a change that
   turns out to matter is the more expensive mistake.

## Enforcement tier

A **rule**: the agent classifies and applies the flow on its own discipline. No hook can judge
what level a change truly is -- that is a judgment, and pretending a script could make it would
be the false confidence this harness refuses. The canonical machine-readable taxonomy (the same
five levels and their capability map) lives in Keystone's own `src/levels.ts`; this rule is its
plain-language counterpart for the agent working inside a generated project.
