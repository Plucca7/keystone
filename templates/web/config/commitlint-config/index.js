/**
 * @repo/commitlint-config
 * CommitLint configuration
 * Project conventions
 *
 * Format: <type>(<scope>): <description>   -- the scope is REQUIRED
 * Examples:
 *   feat(dashboard): adds usage chart
 *   fix(auth): corrects session timeout bug
 *   docs(readme): updates setup instructions
 *   refactor(items): extracts validation logic
 *   test(items): adds archive policy tests
 *   chore(deps): updates dependencies
 *   security(api): fixes SQL injection
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed types -- exactly these seven, no more. The list is kept short on
    // purpose so history stays scannable: style/formatting-only changes are
    // `chore`, performance work is `refactor` (or `fix` when it repairs a
    // regression), CI/build tooling is `chore`, and a revert describes what it
    // restores with one of these types.
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'security']],
    // Type is required and lowercase
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // Scope is REQUIRED: `feat: adds x` says nothing about WHERE. The scope
    // names the touched area (feature, module, package) and makes
    // `git log --oneline` navigable without opening diffs.
    'scope-empty': [2, 'never'],

    // Subject is required
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],

    // Header maximum 100 characters
    'header-max-length': [2, 'always', 100],

    // Body wrapped at 100 characters
    'body-max-line-length': [1, 'always', 100],
  },
}
