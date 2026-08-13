import type {
  CatalogProgramId,
  CourseId,
  CurriculumSuggestion,
  CurriculumSuggestionType,
  SpecializationId,
} from '@pomi/planner-domain/curriculum'

import { publicApiRequest } from '@/api/client'

export const suggestionOnboardingPreferenceKey =
  'pomi.curriculum-planner.suggestion-onboarding-dismissed'

export type { CurriculumSuggestion, CurriculumSuggestionType }

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
  const type = expectString(value.type)
  if (type !== 'GENERAL' && type !== 'SPECIALIZATION' && type !== 'PRE_OPTION')
    throw new TypeError('Expected curriculum suggestion type')
  let specialization: CurriculumSuggestion['specialization']
  if (value.specialization !== null) {
    if (!isRecord(value.specialization))
      throw new TypeError('Expected specialization')
    specialization = {
      id: String(
        expectPositiveInteger(value.specialization.id),
      ) as SpecializationId,
      code: expectString(value.specialization.code),
      name: expectString(value.specialization.name),
    }
  }
  return {
    id: String(expectPositiveInteger(value.id)),
    catalogProgramId: String(
      expectPositiveInteger(value.catalogProgramId),
    ) as CatalogProgramId,
    code: expectString(value.code),
    name: expectString(value.name),
    type,
    ...(specialization ? { specialization } : {}),
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
  const query = new URLSearchParams({ catalogProgramId })
  const response = await publicApiRequest(`/curriculum-suggestions?${query}`)
  if (!response.ok)
    throw new Error(`Unexpected API response: ${response.status}`)
  const value: unknown = await response.json()
  if (!Array.isArray(value)) throw new TypeError('Expected suggestions')
  return value
    .map(parseSuggestion)
    .filter((suggestion) => suggestion.catalogProgramId === catalogProgramId)
}
