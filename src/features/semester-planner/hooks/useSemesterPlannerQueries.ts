import { useQuery } from '@tanstack/react-query'

import type { CatalogProgramId } from '@pomi/planner-domain/curriculum'
import { loadCurriculumCatalog } from '@/catalog/data/curriculumCatalogApi'
import {
  getCurriculum,
  listCurricula,
} from '@/features/curriculum-planner/data/curriculumPersistenceApi'
import { loadCurriculumSuggestions } from '@/features/curriculum-planner/data/curriculumSuggestionApi'
import { useStudentAcademicProfile } from '@/features/student/hooks/useStudentAcademicProfile'
import { listStudentCourseAttempts } from '@/features/student/data/studentApi'
import {
  getSemesterPlanning,
  listSemesterPlannings,
  loadProfessorEvaluationSummaries,
  loadSemesterPlannerStaticData,
} from '@/features/semester-planner/data/semesterPlanningApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  privateQueryKeys,
  publicQueryKeys,
} from '@/integrations/tanstack-query/queryKeys'

export function useSemesterPlannerQueries({
  getAccessToken,
  authInitialized,
  studyPeriodId,
  guideCurriculumId,
  anonymousCatalogProgramId,
  planningId,
}: {
  getAccessToken: () => Promise<string>
  authInitialized: boolean
  studyPeriodId?: number
  guideCurriculumId?: number | null
  anonymousCatalogProgramId: string
  planningId?: string
}) {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const { userId, profileQuery: studentProfileQuery } =
    useStudentAcademicProfile()
  const query = useQuery({
    queryKey: publicQueryKeys.semesterPlannerStaticData(studyPeriodId),
    queryFn: () => loadSemesterPlannerStaticData(studyPeriodId),
    staleTime: 5 * 60_000,
  })
  const plansQuery = useQuery({
    queryKey: privateQueryKeys.semesterPlannings(sessionSubject, userId),
    queryFn: () => listSemesterPlannings(userId!, getAccessToken),
    enabled: Boolean(userId),
    retry: false,
  })
  const courseAttemptsQuery = useQuery({
    queryKey: privateQueryKeys.courseAttempts(sessionSubject, userId),
    queryFn: () => listStudentCourseAttempts(userId!, getAccessToken),
    enabled: Boolean(userId),
    retry: false,
  })
  const numericPlanningId = planningId ? Number(planningId) : undefined
  const planQuery = useQuery({
    queryKey: privateQueryKeys.semesterPlanning(
      sessionSubject,
      userId,
      planningId ?? 'none',
    ),
    queryFn: () =>
      getSemesterPlanning(userId!, numericPlanningId!, getAccessToken),
    enabled:
      Boolean(userId) &&
      planningId !== undefined &&
      planningId !== 'rascunho' &&
      Number.isInteger(numericPlanningId),
    retry: false,
  })
  const professorEvaluationSummariesQuery = useQuery({
    queryKey: publicQueryKeys.semesterPlannerProfessorEvaluationSummaries(),
    queryFn: loadProfessorEvaluationSummaries,
    staleTime: 5 * 60_000,
    retry: false,
  })
  const curriculaQuery = useQuery({
    queryKey: privateQueryKeys.curricula(sessionSubject, userId),
    queryFn: () => listCurricula(userId!, getAccessToken),
    enabled: Boolean(userId),
    retry: false,
  })
  const curriculumQuery = useQuery({
    queryKey: privateQueryKeys.curriculum(
      sessionSubject,
      userId,
      guideCurriculumId ?? undefined,
    ),
    queryFn: () => getCurriculum(userId!, guideCurriculumId!, getAccessToken),
    enabled: Boolean(userId && guideCurriculumId),
    retry: false,
  })
  const anonymousCurriculumDataQuery = useQuery({
    queryKey: publicQueryKeys.semesterPlannerAnonymousCurriculumData(),
    queryFn: async () => {
      const result = await loadCurriculumCatalog()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    enabled: authInitialized,
    staleTime: 5 * 60_000,
  })
  const anonymousSuggestionsQuery = useQuery({
    queryKey: publicQueryKeys.semesterPlannerAnonymousSuggestions(
      anonymousCatalogProgramId,
    ),
    queryFn: () =>
      loadCurriculumSuggestions(anonymousCatalogProgramId as CatalogProgramId),
    enabled: Boolean(anonymousCatalogProgramId),
    retry: false,
  })

  return {
    userId,
    studentProfileQuery,
    query,
    plansQuery,
    courseAttemptsQuery,
    planQuery,
    professorEvaluationSummariesQuery,
    curriculaQuery,
    curriculumQuery,
    anonymousCurriculumDataQuery,
    anonymousSuggestionsQuery,
  }
}
