import { react } from '@repo/eslint-config'
import nextPlugin from '@next/eslint-plugin-next'

export default [
  ...react,
  {
    // Why: the shared @repo/eslint-config serves both the web and the api template,
    // so the Next-only plugin is registered here, at the web template's own config,
    // instead of polluting the shared package. Registering it removes Next's
    // build warning ("plugin not detected") and turns on Next's own checks
    // (no-img-element, no-sync-scripts, core web vitals) for generated web apps.
    name: 'next',
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    ignores: ['.next/', 'node_modules/', 'coverage/', 'out/'],
  },
]
