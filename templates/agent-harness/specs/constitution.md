# Project constitution

> **What this is.** The project's non-negotiables — the rules that hold across every feature. It
> sits **above** every individual spec in this folder: when a `specs/<slug>/spec.md` and this
> constitution disagree, **the constitution wins**, and the spec must change. A feature spec says
> what _this_ change does; the constitution says what _everything_ must always honor.
>
> **How to use it.** This ships with sensible, generic defaults. Read it, then **adapt it to your
> project** — delete what does not apply, tighten what does, add your own. An unedited constitution
> is a smell: it means no one has decided what this project will not compromise on. Keep it short;
> a constitution nobody reads governs nothing.

## Architecture

- One clear place for each responsibility; a reader can predict where a thing lives.
- No logic copied in two places — extract it once the second copy appears, not before.
- A dependency is added only when it earns its place (a real need, maintained, not trivially
  replaceable). Prefer the platform and what is already here.

## Security

- Every input from outside (user, network, another system) is untrusted until validated.
- Authentication and authorization are checked on the server, on every protected path — never
  assumed from the client.
- Secrets live in the environment, never in the code or the repository.
- An error shown to the outside never leaks internal detail (stack traces, which record exists,
  why a login failed).

## Data

- Every structural change to the database goes through a recorded, repeatable migration; nobody
  edits the schema by hand.
- Records carry created/updated timestamps; deletion hides and stays recoverable (soft delete)
  wherever losing data would hurt.
- In a multi-tenant system, every row carries its tenant and every query is scoped to it — no path
  can read across tenants.

## Testing and the definition of done

- A change ships with a test. A bug fix ships with a test that fails before the fix and passes
  after (so it cannot come back).
- Tests cover the unhappy paths too: invalid input, missing permission, the thing that fails.
- **Done** means: the done-target in the spec is met point by point, the tests pass, the gates are
  green (types, lint, format, tests), and any gap is stated plainly — never "done" for a hollow
  shell that exists but does not work.

## Accessibility and UX

- Usable by keyboard alone; meets at least WCAG AA contrast; touch targets are comfortable.
- Every screen handles its empty, loading, and error states — not only the happy path.
- Dates, money, and numbers are shown in the user's locale.

## Performance

- No query inside a loop; fetch what the screen needs, not the whole table.
- The hot path stays simple; optimize only what is measured to be slow, never on a hunch.

## Conflict resolution

If a spec, a convention, or a habit contradicts this document, this document wins and the other
changes — or this document is deliberately amended first, in the open, with the reason recorded.
