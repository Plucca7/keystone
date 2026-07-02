import { describe, expect, it } from 'vitest'

import { ok, fail } from '../result.js'

describe('Result pattern', () => {
  it('ok wraps data with success: true', () => {
    expect(ok(7)).toEqual({ success: true, data: 7 })
  })

  it('fail wraps an error with success: false', () => {
    const error = new Error('nope')

    expect(fail(error)).toEqual({ success: false, error })
  })

  it('discriminates on success so the compiler narrows the branches', () => {
    // The runtime assertion is trivial; the value of this test is that it
    // fails to COMPILE if the discriminated union stops narrowing.
    const result = Math.random() >= 0 ? ok('data') : fail(new Error('x'))

    if (result.success) {
      expect(typeof result.data).toBe('string')
    } else {
      expect(result.error).toBeInstanceOf(Error)
    }
  })
})
