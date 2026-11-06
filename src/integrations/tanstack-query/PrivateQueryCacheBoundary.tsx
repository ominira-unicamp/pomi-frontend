import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { useOptionalAuth } from '@/auth/AuthProvider'
import { isPrivateQueryKey } from '@/integrations/tanstack-query/queryKeys'

export function PrivateQueryCacheBoundary({
  children,
}: {
  children: ReactNode
}) {
  const auth = useOptionalAuth()
  const queryClient = useQueryClient()
  const previousSubject = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!auth.initialized) return
    const nextSubject = auth.sessionSubject
    const priorSubject = previousSubject.current
    previousSubject.current = nextSubject
    if (!priorSubject || priorSubject === nextSubject) return

    void queryClient.cancelQueries({
      predicate: (query) =>
        isPrivateQueryKey(query.queryKey) && query.queryKey[1] === priorSubject,
    })
    queryClient.removeQueries({
      predicate: (query) =>
        isPrivateQueryKey(query.queryKey) && query.queryKey[1] === priorSubject,
    })
  }, [auth.initialized, auth.sessionSubject, queryClient])

  return children
}
