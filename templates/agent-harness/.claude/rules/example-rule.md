---
paths: '**/*.{tsx,jsx}'
---

# Component conventions (example scoped rule)

> This rule auto-loads only when the agent touches a matching file (here, React
> components). That is the point of a scoped rule (B1): guidance that is present exactly
> where it applies and invisible everywhere else, so the always-on context stays lean.
> A rule without a `paths` line loads every session instead -- that form is for rules
> that govern the session itself rather than a file type (see `session-lifecycle.md`
> and `long-term-memory.md` in this folder).
> Rename and adapt -- or delete -- this example for your project.

- Named exports, never default.
- Props type declared above the component.
- No business logic in the component; call into `src/lib/` for it.
