import { useQuery } from '@tanstack/react-query'

import { useOptionalAuth } from '@/auth/AuthProvider'
import { createCurriculumCatalogDataSource } from '@/catalog/data/curriculumCatalogApi'
import {
  privateQueryKeys,
  publicQueryKeys,
} from '@/integrations/tanstack-query/queryKeys'
import {
  getCourseEvaluationForStudyPeriod,
  listClassesForStudentCourseAttempt,
  listStudentCourseAttempts,
  listStudyPeriods,
} from '@/features/student/data/studentApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'

const staticSource = createCurriculumCatalogDataSource()

export function useCourseSituationQueries({
  attemptDialogOpen,
  courseId,
  studyPeriodId,
}: {
  attemptDialogOpen: boolean
  courseId: string
  studyPeriodId: string
}) {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const { studentId, profileQuery } = useStudentProfile()
  const attemptsQuery = useQuery({
    queryKey: privateQueryKeys.courseAttempts(sessionSubject, studentId),
    queryFn: () => listStudentCourseAttempts(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const periodsQuery = useQuery({
    queryKey: publicQueryKeys.studyPeriods(),
    queryFn: listStudyPeriods,
    staleTime: Infinity,
    enabled: auth.isAuthenticated,
  })
  const staticQuery = useQuery({
    queryKey: publicQueryKeys.courseSituationStaticData(),
    queryFn: async () => {
      const result = await staticSource.load()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    staleTime: Infinity,
    enabled: auth.isAuthenticated,
  })
  const classesQuery = useQuery({
    queryKey: privateQueryKeys.courseSituationClasses(
      sessionSubject,
      studentId,
      courseId,
      studyPeriodId,
    ),
    queryFn: () =>
      listClassesForStudentCourseAttempt(
        Number(courseId),
        Number(studyPeriodId),
      ),
    enabled: attemptDialogOpen && Boolean(courseId && studyPeriodId),
    staleTime: 5 * 60_000,
  })
  const selectedAttemptPeriod = periodsQuery.data?.find(
    (period) => String(period.id) === studyPeriodId,
  )
  const evaluationModeQuery = useQuery({
    queryKey: privateQueryKeys.courseSituationEvaluation(
      sessionSubject,
      studentId,
      courseId,
      selectedAttemptPeriod?.year,
    ),
    queryFn: () =>
      getCourseEvaluationForStudyPeriod(
        Number(courseId),
        selectedAttemptPeriod!.year,
      ),
    enabled: attemptDialogOpen && Boolean(courseId && selectedAttemptPeriod),
    staleTime: Infinity,
  })

  return {
    auth,
    sessionSubject,
    studentId,
    profileQuery,
    attemptsQuery,
    periodsQuery,
    staticQuery,
    classesQuery,
    evaluationModeQuery,
  }
}
