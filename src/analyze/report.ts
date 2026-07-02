// Turns the check results into the three-part report the user reads:
// 1) where the project stands, 2) a prioritized plan, 3) cost and risk per item.
// The effort/risk values are fixed classes assigned per check (indicative ordering
// hints, not a computed estimate) — the report says so, so nobody mistakes them for
// analysis. See docs/analyze.md.

import type { CheckResult, Severity } from './checks.ts'

const SEVERITY_ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 }

export function formatReport(results: CheckResult[]): string {
  const passed = results.filter((r) => r.passed)
  const failed = results
    .filter((r) => !r.passed)
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])

  const lines: string[] = ['Keystone — project analysis', '']

  // Part 1 — where it stands
  lines.push(`1) Where it stands — ${passed.length}/${results.length} checks pass`, '')
  for (const r of results) {
    const mark = r.passed ? '✓' : '✗'
    lines.push(`   ${mark} [${r.pillar}] ${r.title}${r.passed ? '' : ` — ${r.detail}`}`)
  }

  // Parts 2 & 3 — prioritized plan with cost/risk
  if (failed.length === 0) {
    lines.push('', 'Nothing to fix — the project meets the checked standards.')
  } else {
    lines.push('', '2) Upgrade plan (most critical first), with cost and risk', '')
    failed.forEach((r, index) => {
      lines.push(`   ${index + 1}. [${r.pillar}] ${r.title} — ${r.detail}`)
      lines.push(`      effort: ${r.effort} · risk: ${r.risk} · severity: ${r.severity}`)
    })
    // Honesty over gloss: the classes above are fixed per check, not computed for this
    // codebase — say so in the report itself.
    lines.push(
      '',
      '   (effort/risk are fixed indicative classes per check, not a computed estimate)',
    )
  }

  return `${lines.join('\n')}\n`
}
