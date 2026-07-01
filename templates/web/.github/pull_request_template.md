## What changes?

<!-- Describe what this PR does in 1-3 sentences -->

## Quality Checklist

- [ ] JSDoc on all new/modified public methods
- [ ] Toasts via `messages.ts` (nothing hardcoded)
- [ ] `tryCatch()` + `toast.error()` in hooks (no `console.error`)
- [ ] aria-labels on new interactive components
- [ ] Pagination on listing queries (`.range()` or `.limit()`)
- [ ] Tests for new logic (services, hooks, libs)
- [ ] `events.emit()` on write operations (create/update/delete)
- [ ] Backend endpoints with `require_scope()`
- [ ] `npm run build` passes (0 errors)
- [ ] `npm run test` passes
- [ ] `npm run lint` with no new errors
