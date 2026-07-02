# Project board (manual, opt-in)

This template does not ship an automated GitHub Project board integration.
Wiring issues and pull requests to a board is optional, host-specific, and
easy to get wrong in a way that breaks CI for everyone the first time an
issue or PR opens -- so it is left as a manual setup step instead of a
workflow bundled by default.

## Setting one up

1. Create a [GitHub Project (v2)](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
   in your user or organization account.
2. Add a `Status` single-select field with the columns your team wants
   (e.g. `Backlog`, `In progress`, `In review`, `Done`).
3. Automate movement with GitHub's own built-in [project workflows](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations)
   (Settings -> Workflows on the Project) -- these cover "item added",
   "item closed", "pull request merged", and similar triggers without any
   custom code or secrets to manage.
4. If the built-in automations are not expressive enough for your workflow,
   write a repository-specific GitHub Actions workflow using
   [`actions/github-script`](https://github.com/actions/github-script) and
   the [Projects GraphQL API](https://docs.github.com/en/graphql/reference/objects#projectv2).
   Keep it in this repository (not a shared reusable workflow) so a mistake
   in project routing cannot fail CI for other repositories.

## Why this is not automated by default

An earlier version of this template included a reusable "project router"
workflow that moved issues and PRs between board columns automatically.
It required a placeholder project owner/number to be filled in before first
use and a `PROJECT_TOKEN` secret with `project` scope (`GITHUB_TOKEN` cannot
access Projects v2). Left unconfigured, it ran a red job on the very first
issue or PR -- broken CI out of the box is a worse default than no board
automation at all. If you want the automation, use the built-in project
workflows in step 3 above, or adapt the workflow-script pattern in step 4 --
own it in your repository so its failure mode is scoped to you.
