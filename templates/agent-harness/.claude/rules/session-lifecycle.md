# Session lifecycle -- resume, work, close, hand off

> An agent session has no memory of the previous one. This rule turns that limitation
> into a routine: every session starts by picking up a hand-off and ends by writing one.
> The permanent record lives in the daily log and in long-term memory; the briefing is
> the disposable hand-off note passed between sessions.
>
> (No `paths` scope on purpose: this rule governs the session itself, not any file type,
> so it must load every session.)

## Trigger commands

The lifecycle runs on explicit words, so a new user needs to know them up front:

- **"resume session"** (or **"continue"**) -- starts a session and runs the resume
  sequence below. Opening a chat without saying it is just an open window, not a session.
- **"close session"** (or **"wrap up"**) -- ends the session and runs the close sequence.

## On resume -- in this order

1. **Identify the coder.** Read the user name from version control
   (`git config user.name`), lowercased, no spaces. That name keys the briefing folder
   and the daily log. Never ask the user who they are -- the config already knows, and
   deriving the name from version control keeps the same person the same coder on every
   machine (a manual answer per machine would fork one person's history in two).
2. **Locate and read the newest briefing** under
   `knowledge/project-journal/briefings/<coder>/` (newest by the date in the filename).
   Read it in full, not skimmed.
3. **Survey the codebase beyond the briefing -- mandatory, before any action or summary.**
   The briefing describes intent; the repository holds the truth. At minimum:
   - version-control status and recent history: current branch, uncommitted changes,
     the last ~20 commits, open branches
   - the project `README` and the root agent-context file
   - the project structure: top-level folders, and where the code the briefing talks
     about actually lives
   - every file the briefing mentions explicitly -- open and read it; never act on the
     briefing's summary of a file instead of the file
   Skipping this to "save reading" is false economy: one action taken on a stale
   assumption costs more than the whole survey.
4. **Open today's entry in the daily log**
   `knowledge/project-journal/daily-log/<coder>.md`. Count today's existing sessions in
   the log -- the new one is N+1 (numbering restarts each day) -- and append the header
   with the START time stamped now:

   ```markdown
   ## YYYY-MM-DD -- Session N
   - Coder: <coder>
   - Start: HH:MM
   - End: (in progress)
   - Duration: (in progress)
   - Working branch: <branch>

   ### Summary
   (filled at close)
   ```

   The open header lives directly in the log until close -- no separate scratch file,
   which would just be a second place for the same state to go stale.
5. **Delete the absorbed briefing.** Briefings are disposable by design: once absorbed,
   the useful part is in your working context and the permanent part already lives in
   the daily log and long-term memory. A pile of stale briefings is noise that a future
   session will one day mistake for current truth.
6. **Present a short summary** (3-5 lines: what was open, the briefing's "first question
   to ask", the likely paths) and wait for the user's answer before any destructive
   action.

### Edge cases

- **No briefing, or a new coder:** say so honestly, create the coder's briefing folder
  and daily-log file, and still run the survey (step 3) before asking the user for
  context -- never ask what version control can answer.
- **A previous session left open** (an entry still reading `End: (in progress)` from an
  earlier day): ask whether to close it with the elapsed time or discard it. Never
  silently overwrite it.

## On close -- in this order

1. **Write the hand-off briefing** at
   `knowledge/project-journal/briefings/<coder>/briefing-YYYY-MM-DD-<short-slug>.md`
   using the embedded template below. `<short-slug>` is 2-4 words naming the session's
   work (e.g. `auth-flow-fix`). Fill it from the whole session yourself -- do not ask the
   user what to put in it.
2. **Close the daily-log entry:** stamp the END time, compute the TOTAL duration, and
   fill the Summary with what was done and what is open -- detailed enough to
   reconstruct the session six months later.
3. **Save durable decisions to long-term memory** (see
   `.claude/rules/long-term-memory.md`). The boundary: the briefing carries in-flight
   state (an open PR, a pending validation, the next step); memory carries permanent
   facts (rules, decisions, invariants). Anything that should still be true next month
   goes to memory -- a permanent fact parked only in a briefing dies when the briefing is
   absorbed and deleted.

## Context budget -- wind down at roughly 60%

When roughly 60% of the context window is consumed, stop taking on new work: finish the
current step, then run the close sequence and hand off. The reasoning quality of an agent
degrades as its window fills, so a clean hand-off to a fresh session beats a long
degraded one. The 60% mark is deliberate: the close sequence itself reads and writes
several files, and it must run while there is still headroom to do it well.

## During the session

Do not write to the daily log for every small step -- the open header stays untouched
until close. Long-term memories are the one exception: save those the moment the durable
decision happens (see the memory rule), not at close.

## Briefing template (embedded)

```markdown
# Briefing -- <session title>

> Origin: session N of YYYY-MM-DD, coder <coder>.
> How to use: read at the start of the next session, then delete -- briefings are
> disposable; the permanent record lives in the daily log and long-term memory.
> Status at close: <one line -- what is open or waiting right now>

## Session summary
<What was done: commits, branches, PRs, decisions taken -- concise narrative.>

## Open branches / PRs
<Each with name or URL, current state, and what blocks it.>

## State of external systems / data
<Changes made outside the repository during the session: database, third-party
services, deployed environments. Empty is fine -- say "none".>

## What remains
- Immediate: <what is waiting right now, with any validation checklist>
- Medium term: <next work items, by priority>

## Where to resume
<The first question to ask the user, and the 2-3 likely paths depending on the answer.>

## Decisions captured
<Numbered. Mark explicitly which ones were saved to long-term memory.>
```
