import { describe, expect, it } from 'vitest'

import { parseEnv } from '../env.js'

describe('parseEnv', () => {
  it('applies safe defaults when optional variables are absent', () => {
    const result = parseEnv({})

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.NODE_ENV).toBe('development')
      expect(result.data.PORT).toBe(3000)
      expect(result.data.HOST).toBe('0.0.0.0')
      expect(result.data.LOG_LEVEL).toBe('info')
    }
  })

  it('coerces PORT from the string the shell provides', () => {
    const result = parseEnv({ PORT: '8080' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.PORT).toBe(8080)
    }
  })

  it('fails with the offending field named when a value is invalid', () => {
    const result = parseEnv({ NODE_ENV: 'staging' })

    expect(result.success).toBe(false)
    if (!result.success) {
      // The operator fixing a broken deploy must see WHICH variable is wrong.
      expect(result.error).toContain('NODE_ENV')
    }
  })

  it('rejects a malformed DATABASE_URL instead of failing later at connect time', () => {
    const result = parseEnv({ DATABASE_URL: 'not-a-url' })

    expect(result.success).toBe(false)
  })
})
