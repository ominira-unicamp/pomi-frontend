import type {
  CatalogProgramId,
  CatalogProgramVariantId,
  CourseId,
  CurriculumPlannerImport,
  CurriculumPlannerSnapshot,
} from './curriculumPlanner'

export type CurriculumSuggestion = Readonly<{
  id: string
  catalogProgramId: CatalogProgramId
  catalogProgramVariantId: CatalogProgramVariantId
  programName: string
  specialization: Readonly<{
    id: number
    code: string
    name: string
  }> | null
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

export function suggestionForAcademicSelection(
  suggestions: ReadonlyArray<CurriculumSuggestion>,
  catalogProgramVariantId: string | undefined,
) {
  if (!catalogProgramVariantId) return undefined
  return suggestions.find(
    (suggestion) =>
      suggestion.catalogProgramVariantId === catalogProgramVariantId,
  )
}

export function suggestionLabel(suggestion: CurriculumSuggestion) {
  return suggestion.specialization
    ? `${suggestion.specialization.code} — ${suggestion.specialization.name}`
    : suggestion.programName
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
      catalogProgramVariantId: suggestion.catalogProgramVariantId,
    },
    planningStart: { ...planningStart, semesterNumber: startSemesterNumber },
    periods: semesters.map((semester) => ({
      courses: semester.courses.map((course) => course.id),
    })),
  }
}
