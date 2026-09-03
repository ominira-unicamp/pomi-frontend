import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PrivateQueryCacheBoundary } from '@/integrations/tanstack-query/PrivateQueryCacheBoundary'
import {
  privateQueryKeys,
  publicQueryKeys,
} from '@/integrations/tanstack-query/queryKeys'

const authState = {
  initialized: true,
  sessionSubject: 'student-a' as string | undefined,
}

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => authState,
}))

describe('PrivateQueryCacheBoundary', () => {
  beforeEach(() => {
    authState.initialized = true
    authState.sessionSubject = 'student-a'
  })

  it('remove somente o cache privado da identidade anterior', async () => {
    const queryClient = new QueryClient()
    const publicKey = publicQueryKeys.curriculumCatalog()
    const previousKey = privateQueryKeys.curricula('student-a', 1)
    const nextKey = privateQueryKeys.curricula('student-b', 2)

    queryClient.setQueryData(publicKey, { catalog: true })
    queryClient.setQueryData(previousKey, [{ id: 1 }])
    queryClient.setQueryData(nextKey, [{ id: 2 }])

    const view = render(
      <QueryClientProvider client={queryClient}>
        <PrivateQueryCacheBoundary>
          <div>conteúdo</div>
        </PrivateQueryCacheBoundary>
      </QueryClientProvider>,
    )

    authState.sessionSubject = 'student-b'
    view.rerender(
      <QueryClientProvider client={queryClient}>
        <PrivateQueryCacheBoundary>
          <div>conteúdo</div>
        </PrivateQueryCacheBoundary>
      </QueryClientProvider>,
    )

    await waitFor(() =>
      expect(queryClient.getQueryData(previousKey)).toBeUndefined(),
    )
    expect(queryClient.getQueryData(nextKey)).toEqual([{ id: 2 }])
    expect(queryClient.getQueryData(publicKey)).toEqual({ catalog: true })
  })
})
