// Tests for Layer B — the agent harness: it lands in every generated project, and its
// guardrails actually block (exit 2), not merely warn.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createProject } from '../src/create.ts'
import type { KeystoneAnswers, ProjectType } from '../src/types.ts'

function answers(type: ProjectType, parentDir: string): KeystoneAnswers {
  return {
    product: {
      name: 'demo-app',
      type,
      language: 'pt',
      screen: 'both',
      look: 'later',
      sensitive: false,
    },
    setup: { versionTarget: 'local', isPrivate: false, parentDir },
  }
}

test('harness: every generated project is born with the four-part harness', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'keystone-'))
  try {
    const { projectDir } = await createProject(answers('site', parent))
    for (const f of [
      '.claude/agents/spec-reviewer.md', // B3
      '.claude/agents/code-reviewer.md', // B3
      '.claude/agents/security-auditor.md', // B3
      '.claude/hooks/block-secret.mjs', // B4
      '.claude/hooks/block-protected-branch.mjs', // B4
      '.claude/settings.json', // B4 wiring
      '.claude/rules/example-rule.md', // B1
      'specs/000-example-feature/spec.md', // B2
      'docs/agent-harness.md', // the map
    ]) {
      assert.ok((await stat(join(projectDir, f))).isFile(), `expected ${f} in the project`)
    }
  } finally {
    await rm(parent, { recursive: true, force: true })
  }
})

// Run a guardrail hook exactly as Claude Code would: JSON tool call on stdin, read the
// exit code (2 = blocked, 0 = allowed).
const SECRET_HOOK = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'templates/agent-harness/.claude/hooks/block-secret.mjs',
)

function runSecretHook(command: string): number {
  const res = spawnSync('node', [SECRET_HOOK], {
    input: JSON.stringify({ tool_input: { command } }),
    encoding: 'utf8',
  })
  return res.status ?? -1
}

test('guardrail: the secret hook blocks reading a .env file (exit 2)', () => {
  // command assembled from parts, same discipline as the scanners
  assert.equal(runSecretHook('cat ' + '.env'), 2)
})

test('guardrail: the secret hook allows a harmless command (exit 0)', () => {
  assert.equal(runSecretHook('ls -la'), 0)
})
