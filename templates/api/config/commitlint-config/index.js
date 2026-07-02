/**
 * @repo/commitlint-config
 * CommitLint configuration
 * Project conventions
 *
 * Format: <type>(<scope>): <description>
 * The scope is REQUIRED — every commit names the area it touches, which keeps
 * history filterable (git log --grep 'feat(billing)') and reviews scoped.
 *
 * Examples:
 *   feat(billing): add invoice PDF export
 *   fix(auth): correct token refresh race
 *   docs(readme): document deploy pipeline
 *   refactor(health): extract repository layer
 *   test(items): cover soft-delete filter
 *   chore(deps): bump fastify to 5.1
 *   security(api-keys): hash keys with sha256
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed types — exactly these seven. Deliberately narrower than the
    // conventional-commits default: style/perf/ci/build/revert scatter
    // history into buckets nobody filters by; those changes map onto
    // chore/refactor/fix without losing information.
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'security']],
    // Type is required and lowercase
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // Scope is REQUIRED (see header comment for why).
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
