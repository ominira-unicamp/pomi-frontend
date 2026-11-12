import { useQuery } from '@tanstack/react-query'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { useUserContext } from '@/features/identity'
import { getStudentAcademicProfile } from '@/features/student/data/studentApi'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function useStudentAcademicProfile() {
  const auth = useOptionalAuth()
  const { userId, userQuery } = useUserContext()
  const studentId = userQuery.data?.studentId
  const profileQuery = useQuery({
    queryKey: [
      ...privateQueryKeys.studentAcademicProfile(
        auth.sessionSubject ?? 'unknown-session',
        userId,
      ),
      studentId ?? 'none',
    ],
    queryFn: () => getStudentAcademicProfile(userId!, auth.getAccessToken),
    enabled: typeof userId === 'number' && typeof studentId === 'number',
    staleTime: 5 * 60_000,
    retry: false,
  })
  return { userId, studentId, userQuery, profileQuery }
}
