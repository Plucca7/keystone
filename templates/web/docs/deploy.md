# Deploy pipeline

Two environments, two workflows, one contract.

| Environment    | Branch    | Workflow                                  | Purpose                                                                                                                            |
| -------------- | --------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **staging**    | `develop` | `.github/workflows/deploy-staging.yml`    | Integration environment -- every merge to develop deploys here for validation.                                                     |
| **production** | `main`    | `.github/workflows/deploy-production.yml` | What users see. `main` only moves through a reviewed PR (branch protection), so every production deploy is a deliberate promotion. |

## Pipeline contract

Both workflows run the same four jobs, in this order:

```
gates -> migrate -> deploy -> smoke
```

1. **gates** -- reuses the CI workflow (`_ci-reusable.yml`): typecheck, lint,
   unit tests, build. The definition of "green" is identical for PRs and
   deploys; nothing broken ships.
2. **migrate** -- runs `scripts/db-migrate.sh` against the target
   environment's database. **Migration before code**: the schema the new code
   needs must exist before that code serves traffic. The script is idempotent
   (tracked in `schema_migrations`), so a run with no pending migrations is a
   fast no-op. See `db/migrations/README.md`.
3. **deploy** -- the host-specific step (see "The one line to fill" below).
4. **smoke** -- curls the health endpoint (`HEALTH_URL`) and fails the run
   unless it answers HTTP 200. A deploy is not "done" when the host accepts
   it; it is done when the app answers.

Deploys are serialized per environment (`concurrency`, never cancelled
mid-flight): interrupting a migration or a half-rolled-out release is how
environments end up half-updated.

## Per-environment secrets and databases

Each GitHub Environment (repo Settings -> Environments -> `staging` /
`production`) owns its configuration. **Environments never share credentials,
and each has its own database** -- staging must be safe to break.

| Name           | Kind                | Used by        | Example                                      |
| -------------- | ------------------- | -------------- | -------------------------------------------- |
| `DATABASE_URL` | secret              | migrate job    | `postgres://user:pass@host:5432/app_staging` |
| `HEALTH_URL`   | variable            | smoke job      | `https://staging.example.com/api/v1/health`  |
| `APP_URL`      | variable (optional) | GitHub UI link | `https://staging.example.com`                |

Plus whatever secrets your host's deploy command needs (e.g. `VERCEL_TOKEN`).

On the `production` environment, consider enabling **required reviewers** so
production jobs wait for a manual approval -- the pipeline supports it without
changes because every environment-bound job already declares
`environment: production`.

## The one line to fill

Everything in the pipeline is host-agnostic except the **"Deploy to host"**
step in each workflow, which is marked `TODO(owner)` and fails on purpose
until replaced -- an unconfigured pipeline must not pretend it deployed.

Replace that step with your host's command. The workflows carry commented
examples: Vercel (the typical managed host CLI for Next.js), Netlify, a
container registry push, or rsync+SSH to a self-managed VPS. Anything works as
long as it deploys the app and exits non-zero on failure.

## Runbook: what a failed job means

| Failed job | Meaning                                                                                            | First move                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| gates      | The branch is broken -- same failure a PR would show.                                              | Fix on a feature branch; the deploy re-runs on the next merge.                                                   |
| migrate    | A migration failed; the transaction rolled back, database unchanged and no false "applied" record. | Fix the migration SQL (new file if the bad one was already applied elsewhere).                                   |
| deploy     | Host-specific: credentials, quota, build.                                                          | Check the step's log; nothing reached users yet if your host deploys atomically.                                 |
| smoke      | Code is live but not answering 200.                                                                | Treat as an incident: check the health endpoint manually and the host's logs; roll back via your host if needed. |
