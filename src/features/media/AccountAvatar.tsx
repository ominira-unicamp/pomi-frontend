import { useQuery } from '@tanstack/react-query'

import { PersonAvatar } from './IdentityImages'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { getPublicProfile } from '@/features/friends/userSocialApi'
import { useCurrentUser } from '@/features/identity'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function AccountAvatar({ name }: { name: string }) {
  const auth = useOptionalAuth()
  const currentUser = useCurrentUser()
  const userId = currentUser.data?.userId
  const profile = useQuery({
    queryKey: privateQueryKeys.userSocialProfile(
      auth.sessionSubject ?? 'unknown-session',
      userId,
    ),
    queryFn: () => getPublicProfile(userId!, auth.getAccessToken),
    enabled: Boolean(userId) && auth.isAuthenticated,
    retry: false,
  })
  return (
    <PersonAvatar
      mediaId={profile.data?.avatarMediaId}
      name={name}
      access="private"
      size="small"
    />
  )
}
