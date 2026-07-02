# @repo/commitlint-config

CommitLint configuration — Conventional Commits with a required scope.

## Installation

```bash
npm install -D github:your-org/commitlint-config @commitlint/cli @commitlint/config-conventional
```

## Usage

`commitlint.config.js`:

```js
module.exports = { extends: ['@repo/commitlint-config'] }
```

## Format

```
<type>(<scope>): <description>
```

The **scope is required**. It names the area the commit touches (feature,
module, package) so `git log --oneline` is navigable without opening diffs.

## Allowed types

Exactly these seven — the list is short on purpose so history stays scannable:

`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `security`

Where the usual extras map to:

| Instead of                | Use                                                         |
| ------------------------- | ----------------------------------------------------------- |
| `style` (formatting only) | `chore`                                                     |
| `perf`                    | `refactor` (or `fix` when repairing a regression)           |
| `ci`, `build`             | `chore`                                                     |
| `revert`                  | the type of what is being restored, message says it reverts |

## Main rules

- Header maximum: 100 characters
- Type is required and lowercase
- Scope is required
- Subject is required (no leading uppercase)

### Valid examples

```
feat(dashboard): adds usage chart
fix(auth): corrects session timeout bug
security(api): fixes SQL injection
```

### Invalid examples

```
feat: adds dashboard feature      <- missing scope
perf(api): caches lookups         <- type not in the allowed list
```

## History

Originally part of the `your-org/shared-config` monorepo. Split out in 2026 to resolve import resolution issues when installed via `github:` deps.

## Reference

- [Conventional Commits](https://www.conventionalcommits.org/)
