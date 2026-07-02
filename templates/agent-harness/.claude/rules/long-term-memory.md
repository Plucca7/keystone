# Long-term memory -- permanent facts across sessions

> Sessions forget; the project must not. The `memory/` directory at the project root is
> the agent's long-term memory: durable decisions, preferences, and invariants that have
> to survive any single conversation.
>
> (No `paths` scope on purpose: memory discipline applies to every session, not to a
> file type, so this rule must load every session.)

## Shape

- **One fact per file**, markdown, under `memory/`. One file per fact keeps each fact
  addressable: it can be linked, updated, or deleted on its own, instead of accreting
  into a monolith where nothing can be retired without archaeology.
- Each memory file opens with short frontmatter:

  ```markdown
  ---
  name: <kebab-case-identifier>
  description: <one line -- what this memory says>
  type: decision | preference | project-state | reference
  ---
  ```

  The four types, so a future session knows how to weigh the fact:
  - `decision` -- a choice that was made and its why (architecture, product, process)
  - `preference` -- how the user wants things done
  - `project-state` -- durable state of an ongoing effort (not in-flight detail -- that
    belongs in a briefing)
  - `reference` -- a fact worth not re-deriving (an API quirk, an environment detail,
    a hard-won gotcha)

- **`memory/MEMORY.md` is the index**: one line per memory -- a link plus a hook, the one
  phrase that tells a future session whether the memory is worth opening. This project's
  tooling does not auto-inject `memory/` into context the way it does `.claude/rules/`,
  so the read side is a step in the resume sequence, not automatic: the agent opens the
  index at the start of every session (`.claude/rules/session-lifecycle.md`, resume step
  2) and only opens the full memory files whose hook looks relevant that day. This keeps
  the always-on context cost proportional to the number of memories, not to their total
  size -- never load full contents wholesale, and never skip opening the index itself.

## Discipline

- **Save proactively, the moment it happens.** A durable decision goes to memory when it
  is made, not at session close. Waiting risks losing it to a crash, a filled context
  window, or plain omission during the close sequence.
- **Check before creating.** Before writing a new memory, scan the index for an existing
  one that covers the topic -- update it instead of duplicating. Two files on one fact
  will eventually disagree, and a future session cannot tell which one is true.
- **Delete what is proven wrong.** A falsified memory is worse than no memory: it is
  confident misinformation. Remove the file and its index line the moment reality
  contradicts it.
- **Absolute dates only.** Convert "yesterday", "last week", "next sprint" into absolute
  dates (YYYY-MM-DD) before saving -- a relative date rots the moment the session that
  wrote it ends.

## Boundary with briefings

|          | Briefings                                          | Memory                                        |
|----------|----------------------------------------------------|-----------------------------------------------|
| Holds    | in-flight state (open PR, pending validation, next step) | permanent facts (rules, decisions, invariants) |
| Lifetime | one hand-off, then deleted                         | until proven wrong                            |
| Location | `knowledge/project-journal/briefings/`             | `memory/`                                     |

Never store in one what belongs in the other. A permanent fact parked only in a briefing
dies when the briefing is absorbed and deleted; in-flight state stored as a memory
becomes stale clutter that the index drags into every future session.
