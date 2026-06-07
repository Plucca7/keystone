// The CLI's single output channel. Routing all user-facing output through here
// (instead of console.log scattered around) keeps the no-console rule meaningful:
// logs are never left behind in logic, and the one place that speaks to the user
// does so on purpose, via the process streams.

export function print(line = ''): void {
  process.stdout.write(`${line}\n`)
}

export function printError(line = ''): void {
  process.stderr.write(`${line}\n`)
}
