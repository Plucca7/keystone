// Code-quality rules, mirroring the international standard codified in the
// LZR shared config. Node project (no React). See docs/qualidade-codigo.md.

import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'

export default [
  // templates/ are the real templates — they carry their own configs and are
  // checked by their own tooling (proven separately). Keystone's lint, types
  // and formatting do not apply to them.
  { ignores: ['node_modules/', 'dist/', 'docs/', 'templates/'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { projectService: true },
      globals: { ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      // TypeScript strict (Handbook: zero any)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Catch the unwritten promise: `any` that slips in from outside (an untyped
      // library return, JSON.parse, a network payload) and flows into typed code.
      // no-explicit-any above only bans the `any` you write; these ban the `any`
      // that arrives unnoticed and silently breaks the type contract at runtime.
      // They need type-aware linting, already enabled via parserOptions.projectService.
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // General code quality
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-useless-catch': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',

      // The TS-aware rule above already handles unused vars (respecting ^_);
      // turn the core rule off to avoid duplication and false positives.
      'no-unused-vars': 'off',
    },
  },
]
