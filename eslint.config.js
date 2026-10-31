//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import { globalIgnores } from 'eslint/config'

export default [
  globalIgnores([
    'packages/pomi-ts-sdk/src/generated/**',
    'packages/pomi-ts-sdk/src/generated*.test.ts',
    'packages/pomi-ts-sdk/src/generatedClient.ts',
    'packages/pomi-ts-sdk/src/generatedPagination.ts',
  ]),
  ...tanstackConfig,
]
