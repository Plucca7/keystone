# @repo/eslint-config

Configuração ESLint (shared, flat config, ESLint 9+).



## Instalação

```bash
npm install -D github:your-org/eslint-config
# Mais peer-deps que precisam estar no projeto:
npm install -D eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import
```

## Uso

### Projeto Node/API

`eslint.config.mjs`:

```js
import { node } from '@repo/eslint-config'

export default [
  ...node,
  { ignores: ['dist/', 'node_modules/', 'coverage/'] },
]
```

### Projeto Next.js / React

`eslint.config.mjs`:

```js
import { react } from '@repo/eslint-config'

export default [
  ...react,
  { ignores: ['.next/', 'node_modules/', 'coverage/', 'out/'] },
]
```

## Exports disponíveis

| Export | Stack | O que inclui |
|--------|-------|-------------|
| `base` | Qualquer TypeScript | Zero `any`, imports organizados, naming conventions |
| `node` | APIs Node.js | Base + `no-magic-numbers` (warning) |
| `react` | React / Next.js | Base + JSX rules (`jsx-no-target-blank`, `self-closing-comp`) |

## Histórico

Originalmente fazia parte do monorepo `your-org/shared-config`. Separado em 2026 para resolver problemas de resolução de imports quando instalado via `github:` deps.

## Referência


