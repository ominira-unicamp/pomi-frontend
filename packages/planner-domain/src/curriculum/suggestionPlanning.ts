import type {
  CatalogProgramId,
  CourseId,
  CurriculumPlannerImport,
  CurriculumPlannerSnapshot,
  SpecializationId,
} from './curriculumPlanner'

export type CurriculumSuggestionType =
  | 'GENERAL'
  | 'SPECIALIZATION'
  | 'PRE_OPTION'

export type CurriculumSuggestion = Readonly<{
  id: string
  catalogProgramId: CatalogProgramId
  code: string
  name: string
  type: CurriculumSuggestionType
  specialization?: Readonly<{
    id: SpecializationId
    code: string
    name: string
  }>
  semesters: ReadonlyArray<
    Readonly<{
      semester: number
      electiveCredits: number
      courses: ReadonlyArray<
        Readonly<{
          id: CourseId
          code: string
          name: string
          credits: number
        }>
      >
    }>
  >
}>

export function compatibleSuggestions(
  suggestions: ReadonlyArray<CurriculumSuggestion>,
  specializationId: string | undefined,
) {
  return suggestions.filter(
    (suggestion) =>
      suggestion.type !== 'SPECIALIZATION' ||
      suggestion.specialization?.id === specializationId,
  )
}

export function suggestionForAcademicSelection(
  suggestions: ReadonlyArray<CurriculumSuggestion>,
  specializationId: string | undefined,
) {
  const compatible = compatibleSuggestions(suggestions, specializationId)
  if (specializationId) {
    return (
      compatible.find(
        (suggestion) =>
          suggestion.type === 'SPECIALIZATION' &&
          suggestion.specialization?.id === specializationId,
      ) ??
      compatible.find((suggestion) => suggestion.type === 'GENERAL') ??
      compatible.find((suggestion) => suggestion.type === 'PRE_OPTION')
    )
  }
  return (
    compatible.find((suggestion) => suggestion.type === 'GENERAL') ??
    compatible.find((suggestion) => suggestion.type === 'PRE_OPTION')
  )
}

export function suggestionTypeLabel(type: CurriculumSuggestion['type']) {
  return {
    GENERAL: 'Geral',
    SPECIALIZATION: 'Habilitação',
    PRE_OPTION: 'Pré-opção',
  }[type]
}

export function planningFromSuggestion(
  suggestion: CurriculumSuggestion,
  planningStart: NonNullable<
    CurriculumPlannerSnapshot['plan']['planningStart']
  >,
): CurriculumPlannerImport | undefined {
  const startSemesterNumber = planningStart.semesterNumber ?? 1
  const semesters = [...suggestion.semesters].sort(
    (left, right) => left.semester - right.semester,
  )
  if (!semesters.length) return undefined
  return {
    selection: {
      catalogProgramId: suggestion.catalogProgramId,
      ...(suggestion.specialization
        ? { specializationId: suggestion.specialization.id }
        : {}),
    },
    planningStart: { ...planningStart, semesterNumber: startSemesterNumber },
    periods: semesters.map((semester) => ({
      courses: semester.courses.map((course) => course.id),
    })),
  }
}
