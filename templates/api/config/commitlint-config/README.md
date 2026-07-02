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

Both the type AND the scope are required. The scope names the area the commit
touches (a module, a config area, a doc), which keeps history filterable and
reviews focused.

## Allowed types

Exactly these seven — deliberately narrower than the conventional-commits
default:

| Type       | Use for                                       |
| ---------- | --------------------------------------------- |
| `feat`     | New capability                                |
| `fix`      | Bug fix                                       |
| `docs`     | Documentation only                            |
| `refactor` | Restructuring with no behavior change         |
| `test`     | Adding or improving tests                     |
| `chore`    | Maintenance (dependencies, tooling, cleanups) |
| `security` | Security fixes and hardening                  |

`style`, `perf`, `ci`, `build`, and `revert` are intentionally not allowed:
they map onto `chore`/`refactor`/`fix` without losing information, and fewer
buckets keep the history readable.

## Main rules

- Header maximum: 100 characters
- Type is required and lowercase
- **Scope is required** (`scope-empty: never`)
- Subject is required (no leading uppercase)

### Valid examples

```
feat(billing): add invoice PDF export
fix(auth): correct token refresh race
security(api-keys): hash keys with sha256
chore(deps): bump fastify to 5.1
```

### Invalid examples

```
feat: add invoice PDF export        # missing scope
perf(db): add index                 # type not allowed (use chore or refactor)
Fix(auth): correct race             # type must be lowercase
```

## History

Originally part of the `your-org/shared-config` monorepo. Split out in 2026 to resolve import resolution issues when installed via `github:` deps.

## Reference

- [Conventional Commits](https://www.conventionalcommits.org/)
