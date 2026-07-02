## What changes?

<!-- Describe what this PR does in 1-3 sentences -->

## Related issue (required)

<!--
One branch = one issue = one PR. Every PR closes exactly one issue; work that
is not an issue yet becomes one first (.github/ISSUE_TEMPLATE/). The "Closes"
keyword links and auto-closes the issue on merge.
-->

Closes #

## Quality Checklist

- [ ] JSDoc on all new/modified public functions
- [ ] Logging through `src/lib/logger.ts` — no raw `console.*` in product code
- [ ] Query keys registered in `src/lib/query-keys.ts`; mutations invalidate via `src/lib/query-invalidation.ts` (never inline)
- [ ] aria-labels on new interactive components
- [ ] Pagination on listing queries
- [ ] Tests for new logic (the suite only grows — every feature ships with its test)
- [ ] `events.emit()` on write operations (create/update/delete)
- [ ] Database changes shipped as a new migration in `db/migrations/` (migration before code)
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass with 0 errors and 0 warnings
