# Briefings -- the disposable hand-off between sessions

A briefing is the hand-off one work session passes to the next: what is open, what is
waiting, where to pick up. It is written by the close sequence and read -- then deleted --
by the resume sequence. The full lifecycle and the briefing template live in
`.claude/rules/session-lifecycle.md`.

## Layout

One subfolder per coder, keyed by the version-control user name (lowercase, spaces
replaced with hyphens -- see the exact rule in `.claude/rules/session-lifecycle.md`):

```
briefings/
  <coder>/
    briefing-YYYY-MM-DD-<short-slug>.md
```

Per-coder subfolders exist so several people can work the same project without their
hand-offs colliding: each coder resumes from their own last briefing, and version
control merges the folders without conflict.

## Disposable by design

A briefing lives exactly one hand-off: the next session reads it, absorbs it, and
deletes it. The permanent record lives elsewhere -- the daily log (`../daily-log/`) for
what happened, and long-term memory (`memory/` at the project root) for durable
decisions. Keeping old briefings around invites a future session to act on stale
in-flight state as if it were current.
