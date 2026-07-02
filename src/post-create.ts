// After the mould is copied into place, the create command can take the project
// the last mile: start version control, install dependencies, and — through that
// install — switch on the git hooks that ship inside the mould. This module decides
// and orders those steps; the actual execution goes through an injected CommandRunner
// (see exec.ts) so the flow is testable without running git or a package manager.
//
// See docs/commands.md Step 4 ("Repository" / "Automatic checks"): these were the
// planned-but-unbuilt pieces of the create command.

import { access } from 'node:fs/promises'
import { join } from 'node:path'
import type { CommandRunner, CommandResult } from './exec.ts'

/** The package managers a mould can declare, in the order we detect them. */
export type PackageManager = 'pnpm' | 'npm' | 'yarn'

/** Which lockfile proves which manager. Lockfile beats guessing — it is what the mould was built with. */
const LOCKFILE_BY_MANAGER: Record<PackageManager, string> = {
  pnpm: 'pnpm-lock.yaml',
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/**
 * Detect the manager the project expects, from its lockfile. Falls back to npm —
 * the one manager always present with Node — when no lockfile is found, so install
 * never picks a tool the machine may not have just because we guessed.
 */
export async function detectPackageManager(projectDir: string): Promise<PackageManager> {
  for (const manager of ['pnpm', 'npm', 'yarn'] as PackageManager[]) {
    if (await fileExists(join(projectDir, LOCKFILE_BY_MANAGER[manager]))) {
      return manager
    }
  }
  return 'npm'
}

/** What the caller wants the post-create phase to do. Both default on; flags turn them off. */
export interface PostCreateOptions {
  initGit: boolean
  installDeps: boolean
}

export const DEFAULT_POST_CREATE: PostCreateOptions = { initGit: true, installDeps: true }

/** One post-create step and whether it succeeded — reported back so the CLI can be honest about each. */
export interface StepOutcome {
  step: string
  ok: boolean
  /** Present only on failure: the tool's own output, so the user sees why. */
  detail?: string
}

/**
 * Take a freshly copied project the last mile.
 *
 * Order matters and is deliberate:
 *   1. git init → add → commit happens BEFORE install. The mould's commit-msg and
 *      pre-commit hooks are activated by husky, which only runs during install; doing
 *      the first commit first means the baseline commit is never blocked by hooks that
 *      aren't set up yet, while every commit AFTER install is properly guarded.
 *   2. install runs last, and its `prepare` script is what switches the hooks on.
 *
 * Never creates a remote repository or a hosting account — that stays the owner's,
 * regardless of where they said they'd version the code (docs/commands.md, Step 4).
 * Steps are independent: a later failure does not undo an earlier success — the copied
 * project is valid either way — so each outcome is reported rather than rolled back.
 */
export async function runPostCreate(
  projectDir: string,
  options: PostCreateOptions,
  runner: CommandRunner,
): Promise<StepOutcome[]> {
  const outcomes: StepOutcome[] = []

  if (options.initGit) {
    outcomes.push(...(await initGit(projectDir, runner)))
  }

  if (options.installDeps) {
    const manager = await detectPackageManager(projectDir)
    const result = await runner.run(manager, ['install'], projectDir)
    outcomes.push(toOutcome(`install dependencies (${manager})`, result))
  }

  return outcomes
}

/** Start version control and record the baseline commit. Three ordered git calls. */
async function initGit(projectDir: string, runner: CommandRunner): Promise<StepOutcome[]> {
  const outcomes: StepOutcome[] = []

  const init = await runner.run('git', ['init'], projectDir)
  outcomes.push(toOutcome('initialize version control', init))
  // If git itself is missing or init failed, the add/commit cannot succeed — skip them
  // rather than emit two more confusing failures for the same root cause.
  if (!init.ok) return outcomes

  const add = await runner.run('git', ['add', '-A'], projectDir)
  outcomes.push(toOutcome('stage the initial files', add))
  if (!add.ok) return outcomes

  // Conventional-commit message so that once the commit-msg hook is live (after
  // install), the project's own history already matches the format the hook enforces.
  const commit = await runner.run(
    'git',
    ['commit', '-m', 'chore: scaffold project with keystone'],
    projectDir,
  )
  outcomes.push(toOutcome('record the first commit', commit))

  return outcomes
}

/** Map a raw command result to a user-facing step outcome, keeping output only on failure. */
function toOutcome(step: string, result: CommandResult): StepOutcome {
  return result.ok ? { step, ok: true } : { step, ok: false, detail: result.output }
}
