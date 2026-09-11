import assert from 'node:assert/strict'
import test from 'node:test'
import { collectPages } from './generatedPagination.js'

test('follows next page links for the selected API target', async () => {
  const requests: Array<{ target: string; path: string }> = []
  const client = {
    async requestPath<T>(target: 'app' | 'data', path: string) {
      requests.push({ target, path })
      return {
        data: [3],
        _paths: { next: null },
      } as T
    },
  }

  const result = await collectPages(
    client,
    'data',
    Promise.resolve({
      data: [1, 2],
      _paths: { next: '/courses?page=2' },
    }),
  )

  assert.deepEqual(result, [1, 2, 3])
  assert.deepEqual(requests, [{ target: 'data', path: '/courses?page=2' }])
})

test('propagates first page and continuation errors', async () => {
  const firstPageError = new Error('first page')
  await assert.rejects(
    collectPages(
      {
        async requestPath<T>() {
          return { data: [] } as T
        },
      },
      'data',
      Promise.reject(firstPageError),
    ),
    firstPageError,
  )

  const continuationError = new Error('offline')
  await assert.rejects(
    collectPages(
      {
        async requestPath<T>(): Promise<T> {
          throw continuationError
        },
      },
      'app',
      Promise.resolve({
        data: [1],
        _paths: { next: '/items?page=2' },
      }),
    ),
    continuationError,
  )
})
