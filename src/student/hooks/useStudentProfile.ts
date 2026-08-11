import { useQuery } from '@tanstack/react-query'

import { useOptionalAuth } from '@/auth/AuthProvider'
import { getCurrentStudent, getStudentProfile } from '@/student/data/studentApi'

export const studentQueryKey = ['student', 'current'] as const

export function useCurrentStudent() {
  const auth = useOptionalAuth()
  return useQuery({
    queryKey: [...studentQueryKey, auth.isAuthenticated],
    queryFn: () => getCurrentStudent(auth.getAccessToken),
    enabled: auth.initialized && auth.isAuthenticated,
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export function useStudentProfile() {
  const auth = useOptionalAuth()
  const studentQuery = useCurrentStudent()
  const studentId = studentQuery.data?.studentId
  const profileQuery = useQuery({
    queryKey: ['student', 'profile', studentId],
    queryFn: () => getStudentProfile(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    staleTime: 5 * 60_000,
    retry: false,
  })
  return { studentId, studentQuery, profileQuery }
}
