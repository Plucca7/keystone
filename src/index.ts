#!/usr/bin/env node
// Keystone entry point. Routes the command and runs the matching flow.

import { resolve } from 'node:path';
import { runWizard } from './wizard.ts';
import { createProject } from './create.ts';
import { ReadlinePrompter } from './prompter.ts';
import { checkProject } from './guards/runner.ts';

function printHelp(): void {
  console.log(`
Keystone — start a project born to professional standards.

Usage:
  keystone new [name]    Create a new project (asks a few questions)
  keystone check [dir]   Run the automated guards over a project (defaults to .)
  keystone analyze       Measure an existing project against the standard (coming soon)
  keystone help          Show this help
`);
}

async function runNew(presetName?: string): Promise<void> {
  const prompter = new ReadlinePrompter();
  try {
    console.log('\nKeystone — let’s set up your project.\n');
    const answers = await runWizard(prompter, presetName);
    const { projectDir, deduced, files } = await createProject(answers);
    console.log(`\n✓ Project created at ${projectDir}`);
    console.log(`  ${files.length} files written (folder layout + foundation)`);
    console.log(`  Database: ${deduced.needsDatabase ? 'yes (deduced)' : 'not needed'}`);
    console.log(`  Security: ${deduced.securityLevel}`);
  } finally {
    prompter.close();
  }
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);

  switch (command) {
    case 'new':
      await runNew(rest[0]);
      break;
    case 'check': {
      const dir = resolve(rest[0] ?? '.');
      const findings = await checkProject(dir);
      if (findings.length === 0) {
        console.log('✓ Guards passed — no issues found.');
      } else {
        for (const f of findings) {
          console.error(`✗ ${f.file}:${f.line} — ${f.message}`);
        }
        console.error(`\n${findings.length} issue(s) found.`);
        process.exitCode = 1;
      }
      break;
    }
    case 'analyze':
      console.log('analyze — coming soon (see docs/analyze-project.md).');
      break;
    case 'help':
    case undefined:
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      printHelp();
      process.exitCode = 1;
  }
}

main();
