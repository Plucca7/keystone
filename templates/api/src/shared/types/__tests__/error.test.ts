import { describe, expect, it } from 'vitest'

import { HTTP } from '../../constants/http.js'
import {
  AppError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../error.js'

describe('AppError', () => {
  it('serializes to an RFC 9457 Problem Details object', () => {
    const error = new AppError(
      HTTP.CONFLICT,
      'https://api.example.com/errors/conflict',
      'Conflict',
      'Resource already exists',
    )

    expect(error.toProblemDetail('/api/v1/items', 'trace-1')).toEqual({
      type: 'https://api.example.com/errors/conflict',
      title: 'Conflict',
      status: HTTP.CONFLICT,
      detail: 'Resource already exists',
      instance: '/api/v1/items',
      trace_id: 'trace-1',
    })
  })

  it('is a real Error (instanceof works through the class hierarchy)', () => {
    const error = new ValidationError('bad field')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('bad field')
  })

  // One assertion per subclass: each carries its own status code contract,
  // and a copy-paste slip in a constructor would silently change an API
  // status. Cheap tests, real protection.
  it.each([
    [new ValidationError('x'), HTTP.UNPROCESSABLE_ENTITY],
    [new NotFoundError('Item'), HTTP.NOT_FOUND],
    [new UnauthorizedError(), HTTP.UNAUTHORIZED],
    [new ForbiddenError(), HTTP.FORBIDDEN],
  ])('%s maps to status %i', (error, status) => {
    expect(error.status).toBe(status)
  })

  it('NotFoundError names the missing resource in the detail', () => {
    expect(new NotFoundError('Item').detail).toBe('Item not found')
  })
})
