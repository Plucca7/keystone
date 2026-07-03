// The five levels of a unit of work, from a one-line fix to a regulated system, and the
// canonical map of which capabilities each level turns on. Defined once here so a test can
// PROVE the map is complete (no level left without a workflow) instead of trusting prose, and
// so Keystone can deduce a new project's birth level from the same taxonomy.
//
// Two runtimes, two consumers (see spec 001): this module is authoritative for Keystone's own
// birth-level deduction; the harness rule work-level-routing.md is authoritative for the agent
// inside a generated project, which never has this file. Same taxonomy, two contexts — keep the
// level names in step between the two.

/** A unit-of-work level, ordered from lightest (1) to heaviest (5). */
export type WorkLevel =
  | 'quick-fix'
  | 'small-feature'
  | 'product-feature'
  | 'new-product'
  | 'critical-system'

/**
 * Every work level, in ascending weight. This is the canonical order AND the anchor the
 * completeness test checks the routing map against — the map must have exactly these keys.
 */
export const WORK_LEVELS: readonly WorkLevel[] = [
  'quick-fix',
  'small-feature',
  'product-feature',
  'new-product',
  'critical-system',
] as const

/** A capability the routing map can switch on for a level. */
export type Capability =
  | 'regression-test' // a test that pins the bug/behaviour so it cannot come back
  | 'review' // a review pass before it lands
  | 'spec' // a written spec with a verifiable done-target
  | 'plan' // an implementation plan derived from the spec
  | 'tasks' // the plan broken into small, trackable tasks
  | 'tdd-by-risk' // test-first where the change's risk demands it
  | 'subagents' // per-task implementer + isolated reviewers
  | 'discovery' // product / UX / business discovery before the technical spec
  | 'compliance' // regulatory / audit obligations

/** The full set of known capabilities — the completeness test rejects any level that names one outside this. */
export const CAPABILITIES: readonly Capability[] = [
  'regression-test',
  'review',
  'spec',
  'plan',
  'tasks',
  'tdd-by-risk',
  'subagents',
  'discovery',
  'compliance',
] as const

/**
 * The routing table: each level -> the capabilities it activates. Deliberately additive up the
 * scale — a heavier level does everything a lighter one does and more — which is why the lists
 * grow as the level rises. Two decisions worth stating:
 *   - The floor is never "nothing": even a quick fix is pinned by a regression test and reviewed,
 *     so a one-line change can still not slip in unproven and unseen.
 *   - Only the heaviest level adds `compliance`; that cost (audit trail, regulatory checks) is
 *     justified only for regulated or critical work, not imposed on every feature.
 * The `Record<WorkLevel, ...>` type makes TypeScript require an entry for all five at compile
 * time; the runtime test additionally proves none is empty and every capability is a known one.
 */
export const ROUTING: Record<WorkLevel, readonly Capability[]> = {
  'quick-fix': ['regression-test', 'review'],
  'small-feature': ['regression-test', 'spec', 'plan', 'tasks', 'tdd-by-risk', 'review'],
  'product-feature': [
    'regression-test',
    'discovery',
    'spec',
    'plan',
    'tasks',
    'tdd-by-risk',
    'subagents',
    'review',
  ],
  'new-product': [
    'regression-test',
    'discovery',
    'spec',
    'plan',
    'tasks',
    'tdd-by-risk',
    'subagents',
    'review',
  ],
  'critical-system': [
    'regression-test',
    'discovery',
    'spec',
    'plan',
    'tasks',
    'tdd-by-risk',
    'subagents',
    'review',
    'compliance',
  ],
} as const

/**
 * Deduce a brand-new project's birth level from what the wizard already learned — never a
 * separate question (Keystone deduces what it can infer rather than asking). Creating a project
 * is always at least a `new-product`; when it handles sensitive data or money it is a
 * `critical-system` from day one — the same signal (`sensitive`) that already raises the
 * security level. Levels 1–3 describe later units of work inside an existing project, so they
 * are never a birth level.
 */
export function deduceBirthLevel(sensitive: boolean): WorkLevel {
  return sensitive ? 'critical-system' : 'new-product'
}
