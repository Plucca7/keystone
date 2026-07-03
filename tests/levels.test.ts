// Tests for the work-level taxonomy and its routing map. The point is to PROVE the map is
// complete and coherent, so the promise ("every level has a flow, heavier includes lighter")
// cannot silently rot — not to trust the prose in src/levels.ts or the harness rule.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { WORK_LEVELS, CAPABILITIES, ROUTING, deduceBirthLevel } from '../src/levels.ts'

test('routing map has an entry for every level, and no extras', () => {
  const mapped = Object.keys(ROUTING).sort()
  const expected = [...WORK_LEVELS].sort()
  assert.deepEqual(mapped, expected)
})

test('routing map: no level has an empty capability set', () => {
  // The floor is never "nothing": even the lightest level must activate something.
  for (const level of WORK_LEVELS) {
    assert.ok(ROUTING[level].length > 0, `${level} must activate at least one capability`)
  }
})

test('routing map: every capability used is a known one', () => {
  const known = new Set<string>(CAPABILITIES)
  for (const level of WORK_LEVELS) {
    for (const cap of ROUTING[level]) {
      assert.ok(known.has(cap), `${level} names unknown capability "${cap}"`)
    }
  }
})

test('routing is additive up the scale: each level includes every capability of the lighter one', () => {
  // The taxonomy promises a heavier level does everything a lighter one does and more.
  WORK_LEVELS.forEach((level, i) => {
    if (i === 0) return
    const lighter = WORK_LEVELS[i - 1]
    if (!lighter) return // unreachable given the fixed array; satisfies noUncheckedIndexedAccess
    const heavier = new Set(ROUTING[level])
    for (const cap of ROUTING[lighter]) {
      assert.ok(heavier.has(cap), `${level} must include "${cap}" carried by ${lighter}`)
    }
  })
})

test('the floor is never nothing: a quick fix is still pinned by a test and reviewed', () => {
  assert.ok(ROUTING['quick-fix'].includes('regression-test'))
  assert.ok(ROUTING['quick-fix'].includes('review'))
})

test('compliance is carried only by the critical-system level', () => {
  // The audit/regulatory cost is justified only for regulated or critical work, not every feature.
  for (const level of WORK_LEVELS) {
    const carriesCompliance = ROUTING[level].includes('compliance')
    assert.equal(
      carriesCompliance,
      level === 'critical-system',
      `compliance belongs only on critical-system, saw it on ${level}`,
    )
  }
})

test('deduceBirthLevel: a fresh project is a new-product, a sensitive one a critical-system', () => {
  assert.equal(deduceBirthLevel(false), 'new-product')
  assert.equal(deduceBirthLevel(true), 'critical-system')
})
