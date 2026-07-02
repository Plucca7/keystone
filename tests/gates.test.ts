// Tests for the project gates: they run a project's own tooling and block on failure.
// The CommandRunner is recorded, so no real formatter/linter/test/audit runs here —
// the tests assert which gates run, which are skipped, and how failures are reported.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { RecordingRunner } from '../src/exec.ts'
import { runProjectGates, anyGateFailed } from '../src/gates/project-gates.ts'

/** A temp project directory carrying a package.json with the given scripts and a pnpm lockfile. */
async function projectWith(scripts: Record<string, string>): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'keystone-gate-'))
  await writeFile(join(dir, 'package.json'), JSON.stringify({ scripts }))
  await writeFile(join(dir, 'pnpm-lock.yaml'), '')
  return dir
}

const FULL_SCRIPTS = {
  'format:check': 'prettier --check .',
  lint: 'eslint .',
  typecheck: 'tsc --noEmit',
  test: 'vitest run',
}

test('runProjectGates: a fully configured project runs every gate through its manager', async () => {
  const dir = await projectWith(FULL_SCRIPTS)
  const runner = new RecordingRunner()
  try {
    const results = await runProjectGates(dir, runner)
    // Four script gates + the audit = five commands, all via pnpm.
    assert.deepEqual(
      runner.calls.map((c) => `${c.command} ${c.args.join(' ')}`),
      [
        'pnpm run format:check',
        'pnpm run lint',
        'pnpm run typecheck',
        'pnpm run test',
        'pnpm audit',
      ],
    )
    assert.ok(results.every((r) => r.status === 'passed'))
    assert.equal(anyGateFailed(results), false)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('runProjectGates: a missing script is skipped, not failed', async () => {
  // Only a test script; no format:check/lint/typecheck.
  const dir = await projectWith({ test: 'vitest run' })
  const runner = new RecordingRunner()
  try {
    const results = await runProjectGates(dir, runner)
    const byName = Object.fromEntries(results.map((r) => [r.name, r.status]))
    assert.equal(byName['formatting'], 'skipped')
    assert.equal(byName['lint (errors & warnings)'], 'skipped')
    assert.equal(byName['tests'], 'passed')
    // The audit needs no script, so it still runs even on a script-less project.
    assert.equal(byName['dependency audit'], 'passed')
    assert.equal(anyGateFailed(results), false)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('runProjectGates: a failing tool becomes a failed gate that blocks', async () => {
  const dir = await projectWith(FULL_SCRIPTS)
  // Make the manager report failure: every pnpm invocation fails, so gates fail.
  const runner = new RecordingRunner(['pnpm'])
  try {
    const results = await runProjectGates(dir, runner)
    assert.ok(results.every((r) => r.status === 'failed'))
    assert.equal(anyGateFailed(results), true)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('runProjectGates: a directory that is not a project skips everything, including audit', async () => {
  // A bare folder is not a project. The audit must skip too — otherwise `npm audit`
  // reports "0 vulnerabilities" and the gate stamps a hollow green security pass.
  const dir = await mkdtemp(join(tmpdir(), 'keystone-gate-empty-'))
  await writeFile(join(dir, 'pnpm-lock.yaml'), '')
  const runner = new RecordingRunner()
  try {
    const results = await runProjectGates(dir, runner)
    assert.ok(
      results.every((r) => r.status === 'skipped'),
      'every gate skips',
    )
    const audit = results.find((r) => r.name === 'dependency audit')
    assert.equal(audit?.status, 'skipped')
    // Nothing actually ran.
    assert.deepEqual(runner.calls, [])
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
