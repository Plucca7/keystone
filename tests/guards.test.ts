// Tests for the automated guards: secret detection, size, and self-governance.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanSecrets } from '../src/guards/secrets.ts';
import { scanSize } from '../src/guards/size.ts';
import { runGuardsOnContent } from '../src/guards/runner.ts';
import { checkProject } from '../src/guards/runner.ts';

test('scanSecrets: flags an AWS access key', () => {
  const findings = scanSecrets('a.ts', 'const k = "AKIAABCDEFGHIJKLMNOP";');
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /AWS/);
});

test('scanSecrets: flags an api key assignment', () => {
  const findings = scanSecrets('a.ts', 'const apiKey = "abcdef1234567890";');
  assert.equal(findings.length, 1);
});

test('scanSecrets: flags a private key block', () => {
  const findings = scanSecrets('a.ts', '-----BEGIN PRIVATE KEY-----');
  assert.equal(findings.length, 1);
});

test('scanSecrets: ignores a line marked allow-secret', () => {
  const findings = scanSecrets('a.ts', 'const k = "AKIAABCDEFGHIJKLMNOP"; // allow-secret');
  assert.deepEqual(findings, []);
});

test('scanSecrets: no false positive on clean code', () => {
  assert.deepEqual(scanSecrets('a.ts', 'const total = price * quantity;'), []);
});

test('scanSize: flags an oversized file', () => {
  const big = 'x\n'.repeat(401);
  const findings = scanSize('big.ts', big);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /consider splitting/);
});

test('runGuardsOnContent: combines all guards', () => {
  const findings = runGuardsOnContent('a.ts', 'const k = "AKIAABCDEFGHIJKLMNOP";');
  assert.ok(findings.some((f) => f.guard === 'secrets'));
});

test('self-check: Keystone passes its own guards', async () => {
  const findings = await checkProject('src');
  assert.deepEqual(findings, [], `unexpected findings: ${JSON.stringify(findings, null, 2)}`);
});
