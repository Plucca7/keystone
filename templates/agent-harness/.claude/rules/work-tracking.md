# Work tracking -- one branch, one issue, one pull request

> Every unit of work is traceable end to end: an issue states the intent, a branch and
> a pull request carry it out, and closing the pull request closes the issue. This rule
> distills that discipline into something an agent runs on its own, not something a
> human has to remember to ask for.
>
> (No `paths` scope on purpose: this governs how work gets organized, not any file
> type, so it must load every session.)

## The rule

Before starting a new unit of work (a feature, a fix, a refactor -- anything that will
become a commit), open an issue for it first if the project's tracker is reachable from
this environment:

1. **Open the issue first**, with a short title and enough description that someone
   reading only the issue understands what is being done and why.
2. **Branch from it.** One feature branch per issue -- do not fold unrelated work into
   a branch opened for something else, and do not split one issue across several
   branches.
3. **One pull request closes it.** The pull request references the issue (for example
   `Closes #<number>`) so merging the PR closes the issue automatically. Do not open a
   second PR against the same issue; if the scope changed enough to need one, open a
   new issue instead.

This is the same discipline whether the "unit of work" is a new capability or a small
fix -- the difference is only how much detail the issue needs, not whether one exists.
A batch of small, related polish items may share a single umbrella issue with a
checklist, with each item still going through its own commit; that is still one issue
driving the branch and the PR, just with a checklist instead of a single line.

## When the tracker is not reachable

If this environment has no configured access to the project's issue tracker, say so
plainly rather than skipping the step silently, and proceed with the branch and PR
alone. An issue-less PR is a degraded mode, not the default -- note in the PR
description that no issue was opened and why, so a reviewer is not left guessing
whether one was missed.
