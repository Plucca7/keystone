# Daily log -- the permanent per-coder session record

One markdown file per coder, keyed by the version-control user name (lowercase, spaces
replaced with hyphens -- see the exact rule in `.claude/rules/session-lifecycle.md`):
`daily-log/<coder>.md`. Unlike briefings -- which are disposable -- the daily log
lives for the life of the project: it is the auditable history of who worked when, for
how long, and what came out of it.

## Entry format

Each session appends one entry, opened at resume and closed at close (the lifecycle is in
`.claude/rules/session-lifecycle.md`):

```markdown
## YYYY-MM-DD -- Session N
- Coder: <coder>
- Start: HH:MM
- End: HH:MM
- Duration: Hh MMmin
- Working branch: <branch>

### Summary
What was delivered, decided, and left open -- detailed enough to reconstruct the
session six months later.
```

## Conventions

- Session numbers restart each day (Session 1, 2, 3...). Multiple sessions on the same
  day stay separate entries -- never merged into one.
- While a session is open, `End` and `Duration` read `(in progress)`. That is the normal
  open state, not an error: the header lives directly in the log so there is no second
  scratch file to drift out of sync.
- Because every entry carries a duration, summing them gives a per-coder and total hours
  report with no extra tooling.
