// Shared test helper. Not a test file itself (the runner globs tests/*.test.ts),
// so it is imported, never executed on its own.

import { readFile } from 'node:fs/promises'

/**
 * Read and JSON-parse a file, naming the shape the caller expects. This is the single
 * point where untyped file content crosses into typed test code: JSON.parse returns
 * `any`, so the assertion of shape lives here, once, instead of scattering casts (and
 * silencing the no-unsafe-* rules) across every test that inspects a generated file.
 * Each caller passes the minimal type it actually asserts on.
 */
export async function readJson<T>(path: string | URL): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T
}
