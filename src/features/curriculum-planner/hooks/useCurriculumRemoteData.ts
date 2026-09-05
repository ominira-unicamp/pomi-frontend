import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import {
  getCurriculum,
  listCurricula,
} from '@/features/curriculum-planner/data/curriculumPersistenceApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import {
  getCurrentStudent,
  getStudentProfile,
  isApprovedStudentCourseAttempt,
  listStudentCourseAttempts,
} from '@/features/student/data/studentApi'

export type CurriculumRemoteData = Readonly<{
  studentId?: number
  summaries: Awaited<ReturnType<typeof listCurricula>>
  document?: Awaited<ReturnType<typeof getCurriculum>>
  completed: ReadonlyArray<string>
}>

export function useCurriculumRemoteData({
  isAuthenticated,
  authInitialized,
  injected,
  activeCurriculumId,
  getAccessToken,
}: {
  isAuthenticated: boolean
  authInitialized: boolean
  injected: boolean
  activeCurriculumId?: number
  getAccessToken: () => Promise<string>
}) {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const enabled = authInitialized && isAuthenticated && !injected
  const studentQuery = useQuery({
    queryKey: privateQueryKeys.currentStudent(sessionSubject),
    enabled,
    queryFn: () => getCurrentStudent(getAccessToken),
  })
  const studentId = studentQuery.data?.studentId ?? undefined
  const curriculaQuery = useQuery({
    queryKey: privateQueryKeys.curricula(sessionSubject, studentId),
    enabled: enabled && Boolean(studentId),
    queryFn: () => listCurricula(studentId!, getAccessToken),
  })
  const curriculumQuery = useQuery({
    queryKey: privateQueryKeys.curriculum(
      sessionSubject,
      studentId,
      activeCurriculumId,
    ),
    enabled: enabled && Boolean(studentId && activeCurriculumId),
    queryFn: () =>
      getCurriculum(studentId!, activeCurriculumId!, getAccessToken),
  })
  const attemptsQuery = useQuery({
    queryKey: privateQueryKeys.courseAttempts(sessionSubject, studentId),
    enabled: enabled && Boolean(studentId),
    queryFn: () => listStudentCourseAttempts(studentId!, getAccessToken),
  })
  const completed = useMemo(
    () => [
      ...new Set(
        (attemptsQuery.data ?? [])
          .filter(isApprovedStudentCourseAttempt)
          .map((attempt) => String(attempt.courseId)),
      ),
    ],
    [attemptsQuery.data],
  )
  const data = useMemo<CurriculumRemoteData | undefined>(() => {
    if (!enabled) return { studentId: undefined, summaries: [], completed: [] }
    if (!studentQuery.data || (studentId && !curriculaQuery.data))
      return undefined
    return {
      studentId,
      summaries: curriculaQuery.data ?? [],
      document: curriculumQuery.data,
      completed,
    }
  }, [
    completed,
    curriculaQuery.data,
    curriculumQuery.data,
    enabled,
    studentId,
    studentQuery.data,
  ])
  const refetch = useCallback(async () => {
    await Promise.all([
      studentQuery.refetch(),
      curriculaQuery.refetch(),
      attemptsQuery.refetch(),
      ...(activeCurriculumId ? [curriculumQuery.refetch()] : []),
    ])
  }, [
    activeCurriculumId,
    attemptsQuery,
    curriculaQuery,
    curriculumQuery,
    studentQuery,
  ])
  const remoteQuery = {
    data,
    isLoading:
      enabled &&
      (studentQuery.isPending ||
        (Boolean(studentId) &&
          (curriculaQuery.isPending ||
            attemptsQuery.isPending ||
            (Boolean(activeCurriculumId) && curriculumQuery.isPending)))),
    refetch,
  }
  const studentProfileQuery = useQuery({
    queryKey: privateQueryKeys.studentProfile(sessionSubject, studentId),
    queryFn: () => getStudentProfile(studentId!, getAccessToken),
    enabled: Boolean(isAuthenticated && studentId && !injected),
    staleTime: 5 * 60_000,
  })
  return {
    remoteQuery,
    studentProfileQuery,
    curriculaQuery,
    curriculumQuery,
  }
}
