/**
 * Result Pattern
 *
 * Type for the return of operations that may fail,
 * without using throw/catch for control flow.
 *
 * Usage:
 *   import { Result, ok, err } from '@/types/result';
 *
 *   async function createItem(data: ItemInsert): Promise<Result<Item, string>> {
 *     try {
 *       const item = await itemService.create(data);
 *       return ok(item);
 *     } catch (e) {
 *       return err('Failed to create item');
 *     }
 *   }
 *
 *   const result = await createItem(data);
 *   if (result.ok) {
 *     render(result.value);
 *   } else {
 *     log.error('Failed to create item', { error: result.error }); // central logger, never console.*
 *   }
 */

// ============================================
// RESULT TYPE
// ============================================

export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }

// ============================================
// CONSTRUCTORS
// ============================================

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

// ============================================
// HELPERS
// ============================================

/** Wrap an async operation that may throw into a Result */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  mapError?: (e: unknown) => string,
): Promise<Result<T, string>> {
  try {
    const value = await fn()
    return ok(value)
  } catch (e) {
    const message = mapError ? mapError(e) : e instanceof Error ? e.message : 'Unknown error'
    return err(message)
  }
}

/** Unwrap a Result, throwing if it's an error */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) return result.value
  throw new Error(String(result.error))
}

/** Map the value of a successful Result */
export function mapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (result.ok) return ok(fn(result.value))
  return result
}
