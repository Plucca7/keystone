# github-ops

Reusable GitHub Actions workflows and governance templates.



## Reusable Workflows

### CI Pipeline (`ci.yml`)

Full pipeline: typecheck → lint → test → build

```yaml
# In your repo, create .github/workflows/ci.yml:
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    uses: your-org/github-ops/.github/workflows/ci.yml@main
    with:
      node-version: '20'
      package-manager: 'npm'
      run-e2e: false
```

### Security Scan (`security.yml`)

Dependency audit + CodeQL analysis

```yaml
name: Security
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9am

jobs:
  security:
    uses: your-org/github-ops/.github/workflows/security.yml@main
```

### Release (`release.yml`)

Automated release with changelog

```yaml
name: Release
on:
  push:
    tags: ['v*']

jobs:
  release:
    uses: your-org/github-ops/.github/workflows/release.yml@main
```

## Templates

### To copy into your repo

| Template | Destination | Description |
|----------|---------|-----------|
| `templates/repo-files/CODEOWNERS` | `.github/CODEOWNERS` | Ownership by area |
| `templates/docs/ADR-000-template.md` | `docs/adrs/ADR-000-template.md` | ADR template |
| `templates/docs/service-runbook.md` | `docs/runbooks/service-runbook.md` | Operational runbook |

### Issue & PR Templates

Already included in `.github/`:
- **Bug Report** — with severity (SEV-1 to SEV-4)
- **Feature Request** — with acceptance criteria
- **Pull Request Template** — checklist based on the handbook

## How to use

1. Copy the workflows into your repo's `.github/workflows/`
2. Copy the CODEOWNERS into `.github/CODEOWNERS`
3. Copy the doc templates into `docs/`
4. Adjust owners and settings per project

Or use the **official templates** ([template-api](https://github.com/your-org/template-api), [template-web](https://github.com/your-org/template-web)) which come preconfigured.

## Reference


