// Step 7 — the final proof: end-to-end creation, and a deliberately vulnerable
// "test dummy" proving the analysis catches every planted flaw.
//
// The sample secret is assembled from parts so this file does not itself trip
// the detector when Keystone scans its own project (root-cause fix, not an exception).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createProject } from '../src/create.ts'
import { analyzeProject } from '../src/analyze/checks.ts'
import { checkProject } from '../src/guards/runner.ts'
import type { KeystoneAnswers } from '../src/types.ts'

const AWS_SECRET = 'AKIA' + 'ABCDEFGHIJKLMNOP'

/** A project deliberately full of flaws, built in a temp folder (never committed). */
async function writeVulnerableProject(dir: string): Promise<void> {
  await mkdir(join(dir, 'src'), { recursive: true })
  await mkdir(join(dir, 'db'), { recursive: true })
  await writeFile(join(dir, 'src/config.ts'), `export const key = "${AWS_SECRET}";\n`) // exposed secret
  await writeFile(join(dir, 'src/huge.ts'), 'const x = 1;\n'.repeat(500)) // oversized
  await writeFile(join(dir, 'db/schema.sql'), 'create table t (id serial primary key);\n') // no conventions
  // no README, no .gitignore, no tests — all flaws.
}

test('e2e: a freshly created system project is born in the standard', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'keystone-e2e-'))
  try {
    const answers: KeystoneAnswers = {
      product: {
        name: 'shop',
        type: 'system',
        language: 'pt',
        screen: 'both',
        look: 'later',
        sensitive: true,
      },
      setup: { versionTarget: 'github', isPrivate: true, parentDir: parent },
    }
    const { projectDir, deduced } = await createProject(answers)
    assert.equal(deduced.needsDatabase, true)
    assert.equal(deduced.securityLevel, 'reinforced')

    const results = await analyzeProject(projectDir)
    // A brand-new project meets everything it can; only its own tests are missing yet.
    const failing = results.filter((r) => !r.passed).map((r) => r.pillar)
    assert.deepEqual(failing, ['Tests'])
  } finally {
    await rm(parent, { recursive: true, force: true })
  }
})

test('e2e (the test dummy): analysis catches every planted flaw', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'keystone-vuln-'))
  try {
    await writeVulnerableProject(dir)
    const results = await analyzeProject(dir)
    const failedTitles = results.filter((r) => !r.passed).map((r) => r.title)

    assert.ok(failedTitles.includes('No exposed secrets'), 'catches the exposed secret')
    assert.ok(failedTitles.includes('Has tests'), 'catches missing tests')
    assert.ok(failedTitles.includes('Has a README'), 'catches missing README')
    assert.ok(
      failedTitles.some((t) => t.includes('conventions')),
      'catches the bad database',
    )
    assert.ok(
      failedTitles.some((t) => t.includes('oversized')),
      'catches the oversized file',
    )
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('e2e: check fails (exit-worthy) on a project with an exposed secret', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'keystone-chk-'))
  try {
    await mkdir(join(dir, 'src'), { recursive: true })
    await writeFile(join(dir, 'src/config.ts'), `export const key = "${AWS_SECRET}";\n`)
    const findings = await checkProject(dir)
    assert.ok(findings.some((f) => f.guard === 'secrets'))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
