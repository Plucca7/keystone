# Project board automation (planned, opt-in)

This template does not ship an automated task board. A per-project GitHub
Projects board — one column per contributor, items moved automatically as
issues and pull requests progress — is a useful addition, but it depends on
resources that only exist once you, the owner, decide to create them:

- A GitHub Project (v2) for this repository.
- A `Status` field on that Project with the columns you want to track.
- A personal access token with `project` and `repo` scope, stored as a
  repository secret (for example `PROJECT_TOKEN`) — the default
  `GITHUB_TOKEN` cannot write to Projects v2.

Because none of that exists in a freshly generated repository, this template
deliberately does not ship a workflow that assumes it does. A workflow with
placeholder values that runs on every issue and pull request would fail on
day one and train you to ignore red CI — worse than not having the
automation at all.

## Setting it up yourself

If you want the board:

1. Create a GitHub Project (v2) in your account or organization and add a
   single-select `Status` field with the columns your team uses (for
   example `In progress`, `In review`, `Done`).
2. Generate a personal access token with `project` and `repo` scope and add
   it to this repository's secrets.
3. Write a workflow, triggered on `issues` and `pull_request` events, that
   uses [`actions/github-script`](https://github.com/actions/github-script)
   and the Projects v2 GraphQL API to add the item to your Project and set
   its `Status` based on the event (`opened` -> "In progress",
   `ready_for_review` -> "In review", `closed`/merged -> "Done").
   GitHub's own
   [Projects v2 automation guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)
   covers the GraphQL calls needed.

Until you do this, issues and pull requests still work exactly as GitHub
provides them out of the box — you simply track status by hand or with
GitHub's built-in Project board UI instead of an automated router.
