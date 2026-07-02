// Tests for project creation: a project is born from the real template, renamed.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { deduce, createProject, copyFilterFor } from '../src/create.ts'
import type { KeystoneAnswers, ProjectType } from '../src/types.ts'

function answers(type: ProjectType, sensitive: boolean, parentDir = '.'): KeystoneAnswers {
  return {
    product: { name: 'demo-app', type, language: 'pt', screen: 'both', look: 'later', sensitive },
    setup: { versionTarget: 'local', isPrivate: false, parentDir },
  }
}

test('deduce: a site needs no database and is essential security', () => {
  const d = deduce(answers('site', false))
  assert.equal(d.needsDatabase, false)
  assert.equal(d.securityLevel, 'essential')
})

test('deduce: a service needs a database', () => {
  assert.equal(deduce(answers('service', false)).needsDatabase, true)
})

test('deduce: sensitive raises security to reinforced', () => {
  assert.equal(deduce(answers('site', true)).securityLevel, 'reinforced')
})

test('createProject: a service is born from the real api template, renamed', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'keystone-'))
  try {
    const { projectDir, template } = await createProject(answers('service', true, parent))
    assert.equal(template, 'api')

    // the real template files are present (incl. the local config copy)
    for (const f of [
      'package.json',
      'tsconfig.json',
      'eslint.config.mjs',
      'src/index.ts',
      'config/eslint-config/index.mjs',
    ]) {
      assert.ok((await stat(join(projectDir, f))).isFile(), `expected ${f} to exist`)
    }

    // renamed to the project name
    const pkg = JSON.parse(await readFile(join(projectDir, 'package.json'), 'utf8'))
    assert.equal(pkg.name, 'demo-app')

    // build noise was not copied
    await assert.rejects(stat(join(projectDir, 'node_modules')))

    // the creation record is present
    const record = JSON.parse(await readFile(join(projectDir, 'keystone.json'), 'utf8'))
    assert.equal(record.template, 'api')
    assert.equal(record.deduced.securityLevel, 'reinforced')
  } finally {
    await rm(parent, { recursive: true, force: true })
  }
})

test('createProject: a site is born from the web template', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'keystone-'))
  try {
    const { template } = await createProject(answers('site', false, parent))
    assert.equal(template, 'web')
  } finally {
    await rm(parent, { recursive: true, force: true })
  }
})

test('createProject: mobile has no template yet', async () => {
  await assert.rejects(() => createProject(answers('mobile', false, '.')), /No template yet/)
})

test('copyFilterFor: keeps template files even when the template lives under node_modules', () => {
  // The regression that broke installed use: an absolute-path check saw "node_modules"
  // in the install path and copied nothing. The filter must judge by the path relative
  // to the template root, so a package installed under node_modules still copies its files.
  const root = '/app/node_modules/keystone/templates/api'
  const keep = copyFilterFor(root)
  assert.equal(keep(root), true, 'the template root itself is copyable')
  assert.equal(keep(`${root}/package.json`), true, 'a template file is copyable')
  assert.equal(keep(`${root}/src/index.ts`), true, 'a nested template file is copyable')
  // Real nested dependency and build-output folders inside the template are still skipped,
  // so a stray local build never bloats a generated project.
  assert.equal(keep(`${root}/node_modules/left-pad/index.js`), false, 'nested deps are skipped')
  assert.equal(keep(`${root}/.next/static/chunk.js`), false, 'Next.js build output is skipped')
  assert.equal(keep(`${root}/dist/index.js`), false, 'compiled output is skipped')
  // Loose per-machine build caches must not leak into a generated project either.
  assert.equal(keep(`${root}/tsconfig.tsbuildinfo`), false, 'incremental build cache is skipped')
})
