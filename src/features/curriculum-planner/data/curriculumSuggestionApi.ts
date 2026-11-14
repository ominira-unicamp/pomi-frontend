import type {
  CatalogProgramId,
  CatalogProgramVariantId,
  CourseId,
  CurriculumSuggestion,
} from '@pomi/planner-domain/curriculum'

import { pomiSdk } from '@/api/client'

export const suggestionOnboardingPreferenceKey =
  'pomi.curriculum-planner.suggestion-onboarding-dismissed'

export type { CurriculumSuggestion }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function expectString(value: unknown) {
  if (typeof value !== 'string') throw new TypeError('Expected string')
  return value
}

function expectNumber(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected number')
  return value
}

function expectPositiveInteger(value: unknown) {
  const number = expectNumber(value)
  if (!Number.isInteger(number) || number < 1)
    throw new TypeError('Expected positive integer')
  return number
}

function expectNonNegativeInteger(value: unknown) {
  const number = expectNumber(value)
  if (!Number.isInteger(number) || number < 0)
    throw new TypeError('Expected non-negative integer')
  return number
}

function parseSuggestion(value: unknown): CurriculumSuggestion {
  if (!isRecord(value) || !Array.isArray(value.semesters))
    throw new TypeError('Expected curriculum suggestion')
  let specialization: CurriculumSuggestion['specialization'] = null
  if (value.specialization !== null) {
    if (!isRecord(value.specialization))
      throw new TypeError('Expected specialization')
    specialization = {
      id: expectPositiveInteger(value.specialization.id),
      code: expectString(value.specialization.code),
      name: expectString(value.specialization.name),
    }
  }
  return {
    id: String(expectPositiveInteger(value.id)),
    catalogProgramId: String(
      expectPositiveInteger(value.catalogProgramId),
    ) as CatalogProgramId,
    catalogProgramVariantId: String(
      expectPositiveInteger(value.catalogProgramVariantId),
    ) as CatalogProgramVariantId,
    programName: expectString(value.programName),
    specialization: specialization ?? null,
    semesters: value.semesters.map((semester) => {
      if (!isRecord(semester) || !Array.isArray(semester.courses))
        throw new TypeError('Expected semester suggestion')
      return {
        semester: expectPositiveInteger(semester.semester),
        electiveCredits: expectNonNegativeInteger(semester.electiveCredits),
        courses: semester.courses.map((course) => {
          if (!isRecord(course)) throw new TypeError('Expected course')
          return {
            id: String(expectPositiveInteger(course.id)) as CourseId,
            code: expectString(course.code),
            name: expectString(course.name),
            credits: expectNonNegativeInteger(course.credits),
          }
        }),
      }
    }),
  }
}

export async function loadCurriculumSuggestions(
  catalogProgramId: CatalogProgramId,
) {
  const value = await pomiSdk.data.curriculumSuggestions.listAll({
    filter: { catalogProgramId: Number(catalogProgramId) },
  })
  return value
    .map(parseSuggestion)
    .filter((suggestion) => suggestion.catalogProgramId === catalogProgramId)
}
