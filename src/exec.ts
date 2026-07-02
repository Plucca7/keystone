// Running external commands (git, the package manager) goes through a CommandRunner,
// never through child_process directly. Why: the post-create steps and the project
// gates both shell out, and routing them through one injectable seam keeps them
// testable — a recording runner captures the calls in tests with no real process,
// no network, and no filesystem side effects. Same seam the wizard uses for input
// (see prompter.ts): the real path executes, the test path scripts.

import { spawn } from 'node:child_process'

// Two kinds of executable need two kinds of spawn, and they conflict:
//   • git is a real .exe — it spawns directly (shell:false), which keeps each argument
//     intact as an array element. That is what preserves a spaced value like a commit
//     message; a shell would concatenate the args and split it apart (Node DEP0190).
//   • Package managers on Windows are .cmd shims. Modern Node refuses to spawn a .cmd
//     without a shell (throws EINVAL) as a security measure, so those MUST go through a
//     shell — and there we quote each argument ourselves so a spaced value still holds.
// So: a shell is used ONLY for the Windows shims; everything else spawns directly.
const CMD_SHIM_ON_WINDOWS = new Set(['pnpm', 'npm', 'yarn', 'npx'])

function needsShell(command: string): boolean {
  return process.platform === 'win32' && CMD_SHIM_ON_WINDOWS.has(command)
}

/** Quote an argument for a shell only when it holds whitespace or quotes; leave simple args untouched. */
function quoteForShell(arg: string): string {
  if (!/[\s"]/.test(arg)) return arg
  return `"${arg.replace(/"/g, '\\"')}"`
}

/** The outcome of one command: whether it succeeded, plus its captured output. */
export interface CommandResult {
  command: string
  args: string[]
  /** Process exit code; null when the process was killed by a signal. */
  code: number | null
  ok: boolean
  /** stdout + stderr merged, trimmed — enough to show the user why a gate failed. */
  output: string
}

export interface CommandRunner {
  /** Run a command in a working directory, resolving with its result (never throws on non-zero). */
  run(command: string, args: string[], cwd: string): Promise<CommandResult>
}

/** Real runner: spawns the process and waits for it. Zero AI, deterministic. */
export class ShellRunner implements CommandRunner {
  run(command: string, args: string[], cwd: string): Promise<CommandResult> {
    return new Promise((resolve) => {
      // Two spawn shapes, chosen to avoid Node's DEP0190 warning:
      //   • Shell path (Windows shims): pass ONE pre-quoted command string and no arg
      //     array. Passing an arg array WITH shell:true is what triggers DEP0190, so we
      //     build the line ourselves and quote each part to keep spaced values intact.
      //   • Direct path (git, non-Windows managers): pass the arg array with no shell,
      //     which keeps every argument a clean, separate token.
      const useShell = needsShell(command)
      const child = useShell
        ? spawn([command, ...args.map(quoteForShell)].join(' '), { cwd, shell: true })
        : spawn(command, args, { cwd })
      let output = ''
      const collect = (chunk: Buffer): void => {
        output += chunk.toString()
      }
      child.stdout.on('data', collect)
      child.stderr.on('data', collect)
      // A missing executable (ENOENT) is a failed step, not a crash — report it like
      // any non-zero exit so the caller can tell the user which tool is absent.
      child.on('error', (err) => {
        resolve({ command, args, code: null, ok: false, output: err.message })
      })
      child.on('close', (code) => {
        resolve({ command, args, code, ok: code === 0, output: output.trim() })
      })
    })
  }
}

/** Test/automation runner: records every call and returns a scripted result. */
export class RecordingRunner implements CommandRunner {
  readonly calls: { command: string; args: string[]; cwd: string }[] = []
  /** Commands (by their "command" name) that should report failure, for testing the unhappy path. */
  private readonly failing: Set<string>

  constructor(failing: string[] = []) {
    this.failing = new Set(failing)
  }

  async run(command: string, args: string[], cwd: string): Promise<CommandResult> {
    this.calls.push({ command, args, cwd })
    const ok = !this.failing.has(command)
    return { command, args, code: ok ? 0 : 1, ok, output: '' }
  }
}
