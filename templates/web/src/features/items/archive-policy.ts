/**
 * Worked example of the BUSINESS-RULE layer of the test pyramid.
 *
 * Domain rules live as PURE FUNCTIONS: no framework, no I/O, no clock or
 * randomness reaching in from the outside. Everything the rule needs arrives
 * as an argument, so the test calls the function with plain data and asserts
 * the decision -- no mocks, no setup, sub-millisecond runs. This file is the
 * concrete model new features imitate; its test lives at
 * src/__tests__/features/items/archive-policy.test.ts.
 */

/**
 * The slice of an item this rule needs. Deliberately minimal: depending on a
 * narrow shape instead of the full entity keeps the rule reusable and the
 * tests tiny.
 *
 * Boundary convention: the DATABASE stores snake_case columns (deleted_at,
 * updated_at -- see db/migrations/), while TYPESCRIPT uses camelCase. The
 * mapping happens once, at the data-access layer; domain code like this only
 * ever sees camelCase.
 */
export interface ArchivableItem {
  /** ISO timestamp of the last update (column: updated_at). */
  updatedAt: string
  /** ISO timestamp of the soft delete, or null if alive (column: deleted_at). */
  deletedAt: string | null
}

/**
 * The rule returns a decision object instead of a bare boolean so the UI can
 * tell the user WHY archiving is blocked -- a boolean would force the caller
 * to re-derive the reason and duplicate the rule.
 */
export interface ArchiveDecision {
  allowed: boolean
  /** Present only when blocked; human-readable, ready for display. */
  reason?: string
}

/**
 * Business rule: items must be inactive for this many days before archiving.
 * Product decision: 30 days matches the retention review cycle -- archiving
 * something still in active use would surprise its owners.
 */
export const ARCHIVE_INACTIVITY_DAYS = 30

const MS_PER_DAY = 24 * 60 * 60 * 1000

/**
 * Decides whether an item can be archived.
 *
 * Rules (in evaluation order -- the first violation wins so the user sees the
 * most fundamental problem first):
 *   1. Soft-deleted items cannot be archived: they are already out of
 *      circulation, and archiving them would resurrect a record the user
 *      chose to remove.
 *   2. Recently updated items cannot be archived: activity within the
 *      inactivity window means the item is still in use.
 *
 * @param item The item under evaluation (narrow shape, see ArchivableItem).
 * @param now  The reference instant. Injected instead of calling new Date()
 *             inside, so tests control time without mocking globals.
 */
export function canArchiveItem(item: ArchivableItem, now: Date): ArchiveDecision {
  if (item.deletedAt !== null) {
    return { allowed: false, reason: 'Item has been deleted and cannot be archived.' }
  }

  const idleMs = now.getTime() - new Date(item.updatedAt).getTime()
  const idleDays = idleMs / MS_PER_DAY

  // Strict comparison: exactly 30 days idle qualifies. "< threshold" blocks,
  // ">= threshold" allows -- the boundary case is pinned by a test.
  if (idleDays < ARCHIVE_INACTIVITY_DAYS) {
    return {
      allowed: false,
      reason: `Item was updated less than ${ARCHIVE_INACTIVITY_DAYS} days ago and is still considered active.`,
    }
  }

  return { allowed: true }
}
