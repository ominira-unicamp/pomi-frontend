import { useQuery } from '@tanstack/react-query'

import type { CatalogProgramId } from '@pomi/planner-domain/curriculum'
import { loadCurriculumCatalog } from '@/catalog/data/curriculumCatalogApi'
import { getCurriculum, listCurricula } from '@/planner/data/curriculumPersistenceApi'
import { loadCurriculumSuggestions } from '@/planner/data/curriculumSuggestionApi'
import { useStudentProfile } from '@/student/hooks/useStudentProfile'
import {
  listSemesterPlannings,
  loadProfessorEvaluationSummaries,
  loadSemesterPlannerStaticData,
} from '@/semester-planner/data/semesterPlanningApi'

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
  const { studentId, profileQuery: studentProfileQuery } = useStudentProfile()
  const query = useQuery({
    queryKey: ['semester-planner', 'static-data', studyPeriodId ?? 'none'],
    queryFn: () => loadSemesterPlannerStaticData(studyPeriodId),
    staleTime: 5 * 60_000,
  })
  const plansQuery = useQuery({
    queryKey: ['semester-planner', 'plans', studentId],
    queryFn: () => listSemesterPlannings(studentId!, getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const professorEvaluationSummariesQuery = useQuery({
    queryKey: ['semester-planner', 'professor-evaluation-summaries'],
    queryFn: loadProfessorEvaluationSummaries,
    staleTime: 5 * 60_000,
    retry: false,
  })
  const curriculaQuery = useQuery({
    queryKey: ['semester-planner', 'curricula', studentId],
    queryFn: () => listCurricula(studentId!, getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const curriculumQuery = useQuery({
    queryKey: [
      'semester-planner',
      'curriculum',
      studentId,
      guideCurriculumId,
    ],
    queryFn: () => getCurriculum(studentId!, guideCurriculumId!, getAccessToken),
    enabled: Boolean(studentId && guideCurriculumId),
    retry: false,
  })
  const anonymousCurriculumDataQuery = useQuery({
    queryKey: ['semester-planner', 'anonymous-curriculum-data'],
    queryFn: async () => {
      const result = await loadCurriculumCatalog()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    enabled: authInitialized,
    staleTime: 5 * 60_000,
  })
  const anonymousSuggestionsQuery = useQuery({
    queryKey: [
      'semester-planner',
      'anonymous-curriculum-suggestions',
      anonymousCatalogProgramId,
    ],
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
