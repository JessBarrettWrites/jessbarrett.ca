import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import GithubActionsReporter from 'vitest-github-actions-reporter'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      reporters: process.env.GITHUB_ACTIONS ? ['default', new GithubActionsReporter()] : ['default'],
    },
  }),
)
