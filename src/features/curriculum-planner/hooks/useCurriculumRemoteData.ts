import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { getCurrentUser } from '@/features/identity'

import {
  getCurriculum,
  listCurricula,
} from '@/features/curriculum-planner/data/curriculumPersistenceApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import {
  getStudentAcademicProfile,
  isApprovedStudentCourseAttempt,
  listStudentCourseAttempts,
} from '@/features/student/data/studentApi'

export type CurriculumRemoteData = Readonly<{
  userId?: number
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
  const userQuery = useQuery({
    queryKey: privateQueryKeys.currentUser(sessionSubject),
    enabled,
    queryFn: () => getCurrentUser(getAccessToken),
  })
  const userId = userQuery.data?.userId ?? undefined
  const curriculaQuery = useQuery({
    queryKey: privateQueryKeys.curricula(sessionSubject, userId),
    enabled: enabled && Boolean(userId),
    queryFn: () => listCurricula(userId!, getAccessToken),
  })
  const curriculumQuery = useQuery({
    queryKey: privateQueryKeys.curriculum(
      sessionSubject,
      userId,
      activeCurriculumId,
    ),
    enabled: enabled && Boolean(userId && activeCurriculumId),
    queryFn: () => getCurriculum(userId!, activeCurriculumId!, getAccessToken),
  })
  const attemptsQuery = useQuery({
    queryKey: privateQueryKeys.courseAttempts(sessionSubject, userId),
    enabled: enabled && Boolean(userId),
    queryFn: () => listStudentCourseAttempts(userId!, getAccessToken),
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
    if (!enabled) return { userId: undefined, summaries: [], completed: [] }
    if (
      !userQuery.data ||
      (userId &&
        (!curriculaQuery.data ||
          attemptsQuery.isPending ||
          (activeCurriculumId && curriculumQuery.isPending)))
    )
      return undefined
    return {
      userId,
      summaries: curriculaQuery.data ?? [],
      document: curriculumQuery.data,
      completed,
    }
  }, [
    activeCurriculumId,
    completed,
    curriculaQuery.data,
    curriculumQuery.data,
    curriculumQuery.isPending,
    enabled,
    attemptsQuery.isPending,
    userId,
    userQuery.data,
  ])
  const refetch = useCallback(async () => {
    await Promise.all([
      userQuery.refetch(),
      curriculaQuery.refetch(),
      attemptsQuery.refetch(),
      ...(activeCurriculumId ? [curriculumQuery.refetch()] : []),
    ])
  }, [
    activeCurriculumId,
    attemptsQuery,
    curriculaQuery,
    curriculumQuery,
    userQuery,
  ])
  const remoteQuery = {
    data,
    isLoading:
      enabled &&
      (userQuery.isPending ||
        (Boolean(userId) &&
          (curriculaQuery.isPending ||
            attemptsQuery.isPending ||
            (Boolean(activeCurriculumId) && curriculumQuery.isPending)))),
    refetch,
  }
  const studentProfileQuery = useQuery({
    queryKey: [
      ...privateQueryKeys.studentAcademicProfile(sessionSubject, userId),
      userQuery.data?.studentId ?? 'none',
    ],
    queryFn: () => getStudentAcademicProfile(userId!, getAccessToken),
    enabled: Boolean(
      isAuthenticated && userId && userQuery.data?.studentId && !injected,
    ),
    staleTime: 5 * 60_000,
  })
  return {
    remoteQuery,
    studentProfileQuery,
    attemptsQuery,
    curriculaQuery,
    curriculumQuery,
  }
}
