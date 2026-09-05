import { useQuery } from '@tanstack/react-query'

import { useOptionalAuth } from '@/auth/AuthProvider'
import { getCurrentStudent, getStudentProfile } from '@/features/student/data/studentApi'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function useCurrentStudent() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  return useQuery({
    queryKey: privateQueryKeys.currentStudent(sessionSubject),
    queryFn: () => getCurrentStudent(auth.getAccessToken),
    enabled: auth.initialized && auth.isAuthenticated,
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export function useStudentProfile() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const studentQuery = useCurrentStudent()
  const studentId = studentQuery.data?.studentId
  const profileQuery = useQuery({
    queryKey: privateQueryKeys.studentProfile(sessionSubject, studentId),
    queryFn: () => getStudentProfile(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    staleTime: 5 * 60_000,
    retry: false,
  })
  return { studentId, studentQuery, profileQuery }
}
