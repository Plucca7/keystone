import { node } from '@repo/eslint-config'

export default [
  ...node,
  {
    // Why: vitest.config.ts lives at the root and is not in `tsconfig.include: ["src"]`,
    // so @typescript-eslint's type-aware lint cannot parse it. Ignoring it explicitly
    // avoids a parse error without affecting the lint of the product code.
    ignores: ['dist/', 'node_modules/', 'coverage/', 'vitest.config.ts'],
  },
  {
    files: ['**/*.test.ts', '**/__tests__/**'],
    rules: {
      // Why: literal ports, timestamps, and counts ARE the fixtures in a test —
      // extracting each to a named constant hides the scenario instead of
      // documenting a decision. Product code keeps the rule.
      'no-magic-numbers': 'off',
    },
  },
]
