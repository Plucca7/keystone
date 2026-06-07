// Creating the project: the deterministic part. Runs on its own, no AI, zero cost.
// Step 1 (the skeleton) lays down the folder, a config file recording the answers,
// and a base README. The pillars (database, checks, branches, etc.) are layered on
// in later steps. See docs/plano-construcao.md and docs/fluxo-skill.md.

import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { KeystoneAnswers, ProjectType } from './types.ts';

export interface DeducedChoices {
  needsDatabase: boolean;
  securityLevel: 'essential' | 'reinforced';
}

/**
 * Decide what the skill can figure out from what the user already said —
 * never asked. A site needs no database; a system/service does; mobile only
 * when it also handles sensitive data. Sensitive data raises the security level.
 * See docs/wizard-inicial.md ("type 2" decisions) and docs/banco-dados.md.
 */
export function deduce(answers: KeystoneAnswers): DeducedChoices {
  const { type, sensitive } = answers.product;
  const dataBackedTypes: ProjectType[] = ['system', 'service'];
  const needsDatabase = dataBackedTypes.includes(type) || (type === 'mobile' && sensitive);
  return {
    needsDatabase,
    securityLevel: sensitive ? 'reinforced' : 'essential',
  };
}

export interface CreateResult {
  projectDir: string;
  deduced: DeducedChoices;
}

/** Create the project folder and its base contents from the collected answers. */
export async function createProject(answers: KeystoneAnswers): Promise<CreateResult> {
  const deduced = deduce(answers);
  const projectDir = resolve(answers.setup.parentDir, answers.product.name);

  // Keystone creates the project folder itself — the user only points at the parent.
  await mkdir(join(projectDir, 'src'), { recursive: true });

  // Record answers + deductions so later steps (and re-runs) know how this
  // project was set up, instead of guessing.
  const config = {
    keystoneVersion: '0.1.0',
    product: answers.product,
    setup: answers.setup,
    deduced,
  };
  await writeFile(join(projectDir, 'keystone.json'), `${JSON.stringify(config, null, 2)}\n`);

  await writeFile(
    join(projectDir, 'README.md'),
    `# ${answers.product.name}\n\nCreated with Keystone.\n`,
  );

  return { projectDir, deduced };
}
