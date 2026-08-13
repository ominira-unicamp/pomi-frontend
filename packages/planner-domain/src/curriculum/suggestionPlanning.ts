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
  const applicable = semesters.filter(
    (semester) => semester.semester >= startSemesterNumber,
  )
  if (!applicable.length) return undefined
  const byNumber = new Map(
    applicable.map((semester) => [semester.semester, semester]),
  )
  const lastSemester = applicable.at(-1)!.semester
  return {
    selection: {
      catalogProgramId: suggestion.catalogProgramId,
      ...(suggestion.specialization
        ? { specializationId: suggestion.specialization.id }
        : {}),
    },
    planningStart: { ...planningStart, semesterNumber: startSemesterNumber },
    periods: Array.from(
      { length: lastSemester - startSemesterNumber + 1 },
      (_, index) => {
        const semester = byNumber.get(startSemesterNumber + index)
        return {
          courses: semester?.courses.map((course) => course.id) ?? [],
        }
      },
    ),
  }
}
