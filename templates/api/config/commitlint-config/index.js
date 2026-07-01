/**
 * @repo/commitlint-config
 * CommitLint configuration
 * Project conventions
 *
 * Format: <type>: <description>
 * Examples:
 *   feat: adds dashboard feature
 *   fix: corrects timeout bug
 *   docs: updates README
 *   refactor: extracts validation logic
 *   test: adds auth flow tests
 *   chore: updates dependencies
 *   security: fixes SQL injection
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed types
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'refactor',
        'test',
        'chore',
        'security',
        'style',
        'perf',
        'ci',
        'build',
        'revert',
      ],
    ],
    // Type is required and lowercase
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // Subject is required
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],

    // Header maximum 100 characters
    'header-max-length': [2, 'always', 100],

    // Body wrapped at 100 characters
    'body-max-line-length': [1, 'always', 100],
  },
}
