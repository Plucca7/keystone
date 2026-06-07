#!/usr/bin/env node
// Keystone entry point. Routes the command and runs the matching flow.

import { resolve } from 'node:path'
import { runWizard } from './wizard.ts'
import { createProject } from './create.ts'
import { ReadlinePrompter } from './prompter.ts'
import { checkProject } from './guards/runner.ts'
import { analyzeProject } from './analyze/checks.ts'
import { formatReport } from './analyze/report.ts'
import { print, printError } from './output.ts'

function printHelp(): void {
  print(`
Keystone — start a project born to professional standards.

Usage:
  keystone new [name]    Create a new project (asks a few questions)
  keystone check [dir]   Run the automated guards over a project (defaults to .)
  keystone analyze [dir] Measure an existing project against the standard (read-only)
  keystone help          Show this help
`)
}

async function runNew(presetName?: string): Promise<void> {
  const prompter = new ReadlinePrompter()
  try {
    print('\nKeystone — let’s set up your project.\n')
    const answers = await runWizard(prompter, presetName)
    const { projectDir, deduced, files } = await createProject(answers)
    print(`\n✓ Project created at ${projectDir}`)
    print(`  ${files.length} files written (folder layout + foundation)`)
    print(`  Database: ${deduced.needsDatabase ? 'yes (deduced)' : 'not needed'}`)
    print(`  Security: ${deduced.securityLevel}`)
  } finally {
    prompter.close()
  }
}

async function runCheck(dir: string): Promise<void> {
  const findings = await checkProject(resolve(dir))
  if (findings.length === 0) {
    print('✓ Guards passed — no issues found.')
    return
  }
  for (const finding of findings) {
    printError(`✗ ${finding.file}:${finding.line} — ${finding.message}`)
  }
  printError(`\n${findings.length} issue(s) found.`)
  process.exitCode = 1
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2)

  switch (command) {
    case 'new':
      await runNew(rest[0])
      break
    case 'check':
      await runCheck(rest[0] ?? '.')
      break
    case 'analyze':
      print(formatReport(await analyzeProject(resolve(rest[0] ?? '.'))))
      break
    case 'help':
    case undefined:
      printHelp()
      break
    default:
      printError(`Unknown command: ${command}\n`)
      printHelp()
      process.exitCode = 1
  }
}

await main()
