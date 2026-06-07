// Runs every guard over a set of files. Deterministic, no AI, zero cost.
// This is what a project's pre-ship check and Keystone's own self-check call.
// See docs/seguranca.md (camada 2) and docs/qualidade-codigo.md.

import { readFile } from 'node:fs/promises';
import type { Finding, Guard } from './types.ts';
import { scanSecrets } from './secrets.ts';
import { scanSize } from './size.ts';
import { listSourceFiles } from './files.ts';

const GUARDS: Guard[] = [scanSecrets, scanSize];

/** Run all guards against a single file's content. */
export function runGuardsOnContent(file: string, content: string): Finding[] {
  return GUARDS.flatMap((guard) => guard(file, content));
}

/** Run all guards over a list of files. */
export async function runGuards(files: string[]): Promise<Finding[]> {
  const perFile = await Promise.all(
    files.map(async (file) => runGuardsOnContent(file, await readFile(file, 'utf8'))),
  );
  return perFile.flat();
}

/** Convenience: walk a project directory and guard every source file. */
export async function checkProject(dir: string): Promise<Finding[]> {
  return runGuards(await listSourceFiles(dir));
}
