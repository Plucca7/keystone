## What changes?

<!-- Describe what this PR does in 1-3 sentences -->

## Quality Checklist (Engineering Handbook)

### Code
- [ ] JSDoc on all new/modified public methods
- [ ] Explanatory comments on non-obvious decisions (trade-offs, workarounds, business rules)
- [ ] `tryCatch()` + `toast.error()` in hooks (no `console.error`)
- [ ] aria-labels on new interactive components
- [ ] Pagination on listing queries (`.range()` or `.limit()`)
- [ ] Tests for new logic (services, hooks, libs)
- [ ] `events.emit()` on write operations (create/update/delete)
- [ ] Backend endpoints with `require_scope()`

### Design System
- [ ] Design System tokens used (no hardcoded Tailwind colors: `bg-emerald-600`, `text-blue-500`)
- [ ] No `dark:` prefix (CSS variables switch automatically)
- [ ] Toasts with Lucide icons (no emojis)
- [ ] Components from `@/components/ui/` (no raw HTML tags)

### Data Fetching
- [ ] React Query for server data (no `useState` + `useEffect` for fetching)
- [ ] Query keys registered in `query-keys.ts`
- [ ] Mutations with optimistic `onMutate` + `onError` rollback

### Navigation
- [ ] Back buttons use `router.back()` (never `router.push('/fixed-route')`)

### Validation
- [ ] `npm run design:audit` passes (0 errors)
- [ ] `npm run build` passes (0 errors)
- [ ] `npm run test` passes
- [ ] `npm run lint` with no new errors
