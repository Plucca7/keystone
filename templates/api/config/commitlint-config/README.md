# @repo/commitlint-config

Configuração CommitLint — Conventional Commits.



## Instalação

```bash
npm install -D github:your-org/commitlint-config @commitlint/cli @commitlint/config-conventional
```

## Uso

`commitlint.config.js`:

```js
module.exports = { extends: ['@repo/commitlint-config'] }
```

## Tipos permitidos

`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `security`, `style`, `perf`, `ci`, `build`, `revert`

## Regras principais

- Header máximo: 100 caracteres
- Tipo obrigatório e em minúsculas
- Subject obrigatório (sem maiúsculas no início)

### Exemplos válidos

```
feat: adds dashboard feature
fix: corrects timeout bug
security: fixes SQL injection
```

## Histórico

Originalmente fazia parte do monorepo `your-org/shared-config`. Separado em 2026 para resolver problemas de resolução de imports quando instalado via `github:` deps.

## Referência


- [Conventional Commits](https://www.conventionalcommits.org/)
