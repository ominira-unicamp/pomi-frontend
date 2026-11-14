import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from './identityApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export { getCurrentUser, requireCurrentUserId } from './identityApi'
export type { CurrentUser } from './identityApi'

export function useCurrentUser() {
  const auth = useOptionalAuth()
  return useQuery({
    queryKey: privateQueryKeys.currentUser(
      auth.sessionSubject ?? 'unknown-session',
    ),
    queryFn: () => getCurrentUser(auth.getAccessToken),
    enabled: auth.initialized && auth.isAuthenticated,
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export function useUserContext() {
  const userQuery = useCurrentUser()
  return { userId: userQuery.data?.userId, userQuery }
}
export { UserIdentityState } from './UserIdentityState'
