// Refuses code that leaks a secret — the most critical security guard.
// Deterministic, no AI. See docs/seguranca.md item 1.3.
//
// A line containing the marker "allow-secret" is skipped: a conscious, documented
// exception (used here, where the patterns themselves resemble what they match).

import type { Finding, Guard } from './types.ts';

const SECRET_PATTERNS: { name: string; re: RegExp }[] = [
  { name: 'AWS access key', re: /AKIA[0-9A-Z]{16}/ }, // allow-secret
  {
    name: 'API key / token assignment',
    re: /(?:api[_-]?key|secret|token)\s*[:=]\s*['"][^'"]{12,}['"]/i,
  }, // allow-secret
  { name: 'Private key block', re: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/ }, // allow-secret
];

export const scanSecrets: Guard = (file, content) => {
  const findings: Finding[] = [];
  content.split('\n').forEach((text, index) => {
    if (text.includes('allow-secret')) return; // conscious exception
    for (const { name, re } of SECRET_PATTERNS) {
      if (re.test(text)) {
        findings.push({
          guard: 'secrets',
          file,
          line: index + 1,
          message: `Possible exposed secret (${name})`,
        });
      }
    }
  });
  return findings;
};
