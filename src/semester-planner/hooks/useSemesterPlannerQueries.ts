import { useQuery } from '@tanstack/react-query'

import type { CatalogProgramId } from '@pomi/planner-domain/curriculum'
import { loadCurriculumCatalog } from '@/catalog/data/curriculumCatalogApi'
import {
  getCurriculum,
  listCurricula,
} from '@/planner/data/curriculumPersistenceApi'
import { loadCurriculumSuggestions } from '@/planner/data/curriculumSuggestionApi'
import { useStudentProfile } from '@/student/hooks/useStudentProfile'
import {
  listSemesterPlannings,
  loadProfessorEvaluationSummaries,
  loadSemesterPlannerStaticData,
} from '@/semester-planner/data/semesterPlanningApi'
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
}: {
  getAccessToken: () => Promise<string>
  authInitialized: boolean
  studyPeriodId?: number
  guideCurriculumId?: number | null
  anonymousCatalogProgramId: string
}) {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const { studentId, profileQuery: studentProfileQuery } = useStudentProfile()
  const query = useQuery({
    queryKey: publicQueryKeys.semesterPlannerStaticData(studyPeriodId),
    queryFn: () => loadSemesterPlannerStaticData(studyPeriodId),
    staleTime: 5 * 60_000,
  })
  const plansQuery = useQuery({
    queryKey: privateQueryKeys.semesterPlannings(sessionSubject, studentId),
    queryFn: () => listSemesterPlannings(studentId!, getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const professorEvaluationSummariesQuery = useQuery({
    queryKey: publicQueryKeys.semesterPlannerProfessorEvaluationSummaries(),
    queryFn: loadProfessorEvaluationSummaries,
    staleTime: 5 * 60_000,
    retry: false,
  })
  const curriculaQuery = useQuery({
    queryKey: privateQueryKeys.curricula(sessionSubject, studentId),
    queryFn: () => listCurricula(studentId!, getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const curriculumQuery = useQuery({
    queryKey: privateQueryKeys.curriculum(
      sessionSubject,
      studentId,
      guideCurriculumId ?? undefined,
    ),
    queryFn: () =>
      getCurriculum(studentId!, guideCurriculumId!, getAccessToken),
    enabled: Boolean(studentId && guideCurriculumId),
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
    studentId,
    studentProfileQuery,
    query,
    plansQuery,
    professorEvaluationSummariesQuery,
    curriculaQuery,
    curriculumQuery,
    anonymousCurriculumDataQuery,
    anonymousSuggestionsQuery,
  }
}
