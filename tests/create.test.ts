// Tests for the deterministic core of Step 1: deduction + project creation.
// Born with the feature, covers the happy path and the edges (the pillar of Testes).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { deduce, createProject } from '../src/create.ts';
import type { KeystoneAnswers, ProjectType } from '../src/types.ts';

function answers(type: ProjectType, sensitive: boolean, parentDir = '.'): KeystoneAnswers {
  return {
    product: { name: 'demo', type, language: 'en', screen: 'both', look: 'later', sensitive },
    setup: { versionTarget: 'local', isPrivate: false, parentDir },
  };
}

test('deduce: a site needs no database and is essential security', () => {
  const d = deduce(answers('site', false));
  assert.equal(d.needsDatabase, false);
  assert.equal(d.securityLevel, 'essential');
});

test('deduce: a system needs a database', () => {
  assert.equal(deduce(answers('system', false)).needsDatabase, true);
});

test('deduce: sensitive raises security to reinforced', () => {
  assert.equal(deduce(answers('site', true)).securityLevel, 'reinforced');
});

test('deduce: mobile needs a database only when sensitive', () => {
  assert.equal(deduce(answers('mobile', false)).needsDatabase, false);
  assert.equal(deduce(answers('mobile', true)).needsDatabase, true);
});

test('createProject: creates the folder, config and readme', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'keystone-'));
  try {
    const { projectDir, deduced } = await createProject(answers('system', true, parent));

    // folder exists
    assert.ok((await stat(projectDir)).isDirectory());

    // config records the answers and deductions
    const config = JSON.parse(await readFile(join(projectDir, 'keystone.json'), 'utf8'));
    assert.equal(config.product.name, 'demo');
    assert.equal(config.deduced.needsDatabase, true);
    assert.equal(config.deduced.securityLevel, 'reinforced');
    assert.equal(deduced.securityLevel, 'reinforced');

    // readme carries the project name
    const readme = await readFile(join(projectDir, 'README.md'), 'utf8');
    assert.match(readme, /# demo/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});
