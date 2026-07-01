# @repo/tsconfig

Configurações TypeScript (shared).



## Instalação

```bash
npm install -D github:your-org/tsconfig
```

## Uso

### Projeto Next.js

```json
{
  "extends": "@repo/tsconfig/tsconfig.next.json",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Projeto Node/API

```json
{
  "extends": "@repo/tsconfig/tsconfig.node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

### Projeto React Native / Expo

```json
{
  "extends": "@repo/tsconfig/tsconfig.react-native.json"
}
```

## Configs disponíveis

| Config | Stack | Quando usar |
|--------|-------|-------------|
| `tsconfig.base.json` | Base compartilhada | Não usar diretamente |
| `tsconfig.node.json` | APIs Node.js | `extends: "@repo/tsconfig/tsconfig.node.json"` |
| `tsconfig.next.json` | Next.js App Router | `extends: "@repo/tsconfig/tsconfig.next.json"` |
| `tsconfig.react-native.json` | Expo / React Native | `extends: "@repo/tsconfig/tsconfig.react-native.json"` |

## Histórico

Originalmente fazia parte do monorepo `your-org/shared-config`. Separado em 2026 para resolver problemas de resolução de imports quando instalado via `github:` deps.

## Referência


