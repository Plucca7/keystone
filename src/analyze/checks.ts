// The deterministic part of analyzing an existing project: measure it against
// the pillars with no AI, zero cost. The deeper judgement (severity nuance, the
// full upgrade plan) is left to the assistant the dev already uses.
// The command only reads — it never changes the project. See docs/analyze.md.

import { readFile } from 'node:fs/promises'
import { basename, relative, sep } from 'node:path'
import { listAllFiles } from '../guards/files.ts'
import { scanSecrets } from '../guards/secrets.ts'
import { scanSize } from '../guards/size.ts'

export type Severity = 'high' | 'medium' | 'low'
export type Effort = 'small' | 'medium' | 'large'
export type Risk = 'low' | 'medium' | 'high'

export interface CheckResult {
  pillar: string
  title: string
  passed: boolean
  severity: Severity
  effort: Effort
  risk: Risk
  detail: string
}

export interface Snapshot {
  /** All file paths, relative and normalized with '/'. */
  paths: string[]
  /** Source/text files with their content, for content checks. */
  files: { path: string; content: string }[]
}

type Check = (snapshot: Snapshot) => CheckResult

const checkSecrets: Check = (s) => {
  const findings = s.files.flatMap((f) => scanSecrets(f.path, f.content))
  return {
    pillar: 'Security',
    title: 'No exposed secrets',
    passed: findings.length === 0,
    severity: 'high',
    effort: 'small',
    risk: 'low',
    detail: findings.length ? `${findings.length} possible secret(s)` : 'clean',
  }
}

const checkGitignore: Check = (s) => {
  const gitignore = s.files.find((f) => f.path === '.gitignore')
  const passed = !!gitignore && /\.env/.test(gitignore.content)
  return {
    pillar: 'Security',
    title: 'Secrets kept out of the code (.env ignored)',
    passed,
    severity: 'medium',
    effort: 'small',
    risk: 'low',
    detail: passed ? 'ok' : 'no .gitignore rule for .env',
  }
}

const checkTests: Check = (s) => {
  const hasTests = s.paths.some((p) => /\.test\.|(?:^|\/)tests?\//.test(p))
  return {
    pillar: 'Tests',
    title: 'Has tests',
    passed: hasTests,
    severity: 'high',
    effort: 'large',
    risk: 'low',
    detail: hasTests ? 'found' : 'no test files found',
  }
}

const checkReadme: Check = (s) => {
  const hasReadme = s.paths.some((p) => /^readme\.md$/i.test(p))
  return {
    pillar: 'Documentation',
    title: 'Has a README',
    passed: hasReadme,
    severity: 'low',
    effort: 'small',
    risk: 'low',
    detail: hasReadme ? 'found' : 'no README.md at the root',
  }
}

const checkDatabaseConventions: Check = (s) => {
  const sqlFiles = s.files.filter((f) => f.path.endsWith('.sql'))
  if (sqlFiles.length === 0) {
    return {
      pillar: 'Database',
      title: 'Database conventions',
      passed: true,
      severity: 'low',
      effort: 'small',
      risk: 'low',
      detail: 'no database detected — not applicable',
    }
  }
  const text = sqlFiles.map((f) => f.content).join('\n')
  const conventions = ['uuid', 'owner_id', 'created_at', 'deleted_at']
  const missing = conventions.filter((c) => !text.includes(c))
  return {
    pillar: 'Database',
    title: 'Database follows the four conventions',
    passed: missing.length === 0,
    severity: 'high',
    effort: 'medium',
    risk: 'medium',
    detail: missing.length ? `missing: ${missing.join(', ')}` : 'all present',
  }
}

const checkSize: Check = (s) => {
  const findings = s.files.flatMap((f) => scanSize(f.path, f.content))
  return {
    pillar: 'Code quality',
    title: 'No oversized files',
    passed: findings.length === 0,
    severity: 'low',
    effort: 'medium',
    risk: 'low',
    detail: findings.length ? `${findings.length} oversized file(s)` : 'ok',
  }
}

const CHECKS: Check[] = [
  checkSecrets,
  checkGitignore,
  checkTests,
  checkReadme,
  checkDatabaseConventions,
  checkSize,
]

/** Run all checks against a snapshot. Pure and deterministic — easy to test. */
export function runChecks(snapshot: Snapshot): CheckResult[] {
  return CHECKS.map((check) => check(snapshot))
}

const TEXT_FILE = /\.(?:ts|tsx|js|jsx|json|sql|md)$/

/** Read a project directory into a snapshot (only reads — never changes it). */
export async function snapshotOf(dir: string): Promise<Snapshot> {
  const absolute = await listAllFiles(dir)
  const toRel = (f: string): string => relative(dir, f).split(sep).join('/')
  const paths = absolute.map(toRel)

  const textFiles = absolute.filter(
    (f) => TEXT_FILE.test(f) || basename(f).startsWith('.env') || basename(f) === '.gitignore',
  )
  const files = await Promise.all(
    textFiles.map(async (f) => ({ path: toRel(f), content: await readFile(f, 'utf8') })),
  )
  return { paths, files }
}

/** Analyze a project directory and return the per-pillar results. */
export async function analyzeProject(dir: string): Promise<CheckResult[]> {
  return runChecks(await snapshotOf(dir))
}
