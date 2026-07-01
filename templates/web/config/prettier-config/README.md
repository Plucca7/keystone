# @repo/prettier-config

Shared Prettier configuration.



## Instalação

```bash
npm install -D github:your-org/prettier-config prettier prettier-plugin-tailwindcss
```

## Uso

No `package.json` do seu projeto:

```json
{
  "prettier": "@repo/prettier-config"
}
```

## Regras

- Sem ponto-e-vírgula (`semi: false`)
- Aspas simples (`singleQuote: true`)
- Trailing comma em tudo (`trailingComma: "all"`)
- 100 caracteres por linha (`printWidth: 100`)
- 2 espaços de indentação (`tabWidth: 2`)
- Plugin `prettier-plugin-tailwindcss` para ordenação de classes

## Histórico

Originalmente fazia parte do monorepo `your-org/shared-config`. Separado em 2026 para resolver problemas de resolução de imports quando instalado via `github:` deps.

## Referência


