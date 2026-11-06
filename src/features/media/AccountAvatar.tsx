import { useQuery } from '@tanstack/react-query'

import { PersonAvatar } from './IdentityImages'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { getPublicProfile } from '@/features/friends/studentSocialApi'
import { useCurrentStudent } from '@/features/student/hooks/useStudentProfile'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function AccountAvatar({ name }: { name: string }) {
  const auth = useOptionalAuth()
  const student = useCurrentStudent()
  const studentId = student.data?.studentId
  const profile = useQuery({
    queryKey: privateQueryKeys.studentSocialProfile(
      auth.sessionSubject ?? 'unknown-session',
      studentId,
    ),
    queryFn: () => getPublicProfile(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId) && auth.isAuthenticated,
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
