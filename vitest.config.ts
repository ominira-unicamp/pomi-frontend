import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: [
        ...configDefaults.exclude,
        'packages/pomi-ts-sdk/src/generated*.test.ts',
        'packages/pomi-ts-sdk/sdk-gen/**/*.test.ts',
      ],
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          url: 'http://localhost:5174',
        },
      },
      setupFiles: ['./src/test/setup.ts'],
    },
  }),
)
