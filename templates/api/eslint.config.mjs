import { node } from '@repo/eslint-config'

export default [
  ...node,
  {
    // Why: vitest.config.ts lives at the root and is not in `tsconfig.include: ["src"]`,
    // so @typescript-eslint's type-aware lint cannot parse it. Ignoring it explicitly
    // avoids a parse error without affecting the lint of the product code.
    ignores: ['dist/', 'node_modules/', 'coverage/', 'vitest.config.ts'],
  },
]
