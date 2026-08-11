import { useQuery } from '@tanstack/react-query'

import {
  getCurriculum,
  listCurricula,
} from '@/planner/data/curriculumPersistenceApi'
import {
  getCurrentStudent,
  getStudentProfile,
  listCompletedCourseIds,
} from '@/student/data/studentApi'

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
  generation,
  activeCurriculumId,
  getAccessToken,
}: {
  isAuthenticated: boolean
  authInitialized: boolean
  injected: boolean
  generation: number
  activeCurriculumId?: number
  getAccessToken: () => Promise<string>
}) {
  const remoteQuery = useQuery({
    queryKey: [
      'curriculum-planner',
      'remote',
      isAuthenticated,
      generation,
      activeCurriculumId ?? 'first',
    ],
    enabled: authInitialized && isAuthenticated && !injected,
    queryFn: async (): Promise<CurriculumRemoteData> => {
      const me = await getCurrentStudent(getAccessToken)
      if (!me.studentId)
        return { studentId: undefined, summaries: [], completed: [] }
      const summaries = await listCurricula(me.studentId, getAccessToken)
      const summary = summaries.find((item) => item.id === activeCurriculumId)
      const document = summary
        ? await getCurriculum(me.studentId, summary.id, getAccessToken)
        : undefined
      const completed = await listCompletedCourseIds(
        me.studentId,
        getAccessToken,
      )
      return { studentId: me.studentId, summaries, document, completed }
    },
    retry: false,
  })
  const studentProfileQuery = useQuery({
    queryKey: [
      'curriculum-planner',
      'student-profile',
      remoteQuery.data?.studentId,
    ],
    queryFn: () =>
      getStudentProfile(remoteQuery.data!.studentId!, getAccessToken),
    enabled: Boolean(
      isAuthenticated && remoteQuery.data?.studentId && !injected,
    ),
    staleTime: 5 * 60_000,
  })
  return { remoteQuery, studentProfileQuery }
}
