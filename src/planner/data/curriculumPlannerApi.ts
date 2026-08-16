import type {
  CatalogId,
  CatalogProgramId,
  CourseId,
  CourseRequirement,
  CourseSelector,
  CurriculumBlocks,
  CurriculumPlannerStaticData,
  CurriculumPlannerStaticDataSource,
  ElectiveCreditsRequirement,
  LanguageId,
  PlannerResult,
  ProgramId,
  RequirementSource,
  SpecializationId,
} from '@pomi/planner-domain/curriculum'

import { dataApiRequest } from '@/api/client'
import { ApiError, expectApiResponse } from '@/api/errors'

type ApiCourseRequirement = Readonly<{
  type: 'any' | 'prefix' | 'specific'
  courseId: number | null
  prefix: string | null
}>

type ApiBlockSet = Readonly<{
  mandatory: ReadonlyArray<ApiCourseRequirement>
  electives: ReadonlyArray<
    Readonly<{
      credits: number
      courses: ReadonlyArray<ApiCourseRequirement>
    }>
  >
}>

type ApiCatalogProgram = Readonly<{
  id: number
  title: string
  catalogId: number
  catalogYear: number
  programId: number
  programCode: number
  programName: string
  base: ApiBlockSet
  modalities: ReadonlyArray<
    Readonly<{
      specializationId: number
      code: string
      name: string
      blocks: ApiBlockSet
    }>
  >
  languages: ReadonlyArray<
    Readonly<{
      languageId: number
      name: string
      blocks: ApiBlockSet
    }>
  >
}>

type ApiCourse = Readonly<{
  id: number
  code: string
  name: string
  credits: number
  prefix?: string
}>

type ApiCoursesPage = Readonly<{
  data: ReadonlyArray<ApiCourse>
  _paths: Readonly<{ next: string | null }>
}>

const ok = <T>(value: T): PlannerResult<T> => ({ ok: true, value })
const unavailable = <T = never>(): PlannerResult<T> => ({
  ok: false,
  error: { code: 'unavailable', retryable: true },
})
const unexpected = <T = never>(): PlannerResult<T> => ({
  ok: false,
  error: { code: 'unexpected', retryable: false },
})

let cachedStaticData: CurriculumPlannerStaticData | undefined
let staticDataLoad: Promise<PlannerResult<CurriculumPlannerStaticData>> | undefined

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function expectString(value: unknown): string {
  if (typeof value !== 'string') throw new TypeError('Expected string')
  return value
}

function expectNumber(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected number')
  return value
}

function expectArray(value: unknown): Array<unknown> {
  if (!Array.isArray(value)) throw new TypeError('Expected array')
  return value
}

function parseRequirement(value: unknown): ApiCourseRequirement {
  if (!isRecord(value)) throw new TypeError('Expected requirement')
  const type = expectString(value.type)
  if (type !== 'any' && type !== 'prefix' && type !== 'specific')
    throw new TypeError('Invalid requirement type')
  const courseId = value.courseId === null ? null : expectNumber(value.courseId)
  const prefix = value.prefix === null ? null : expectString(value.prefix)
  return { type, courseId, prefix }
}

function parseBlockSet(value: unknown): ApiBlockSet {
  if (!isRecord(value)) throw new TypeError('Expected block set')
  return {
    mandatory: expectArray(value.mandatory).map(parseRequirement),
    electives: expectArray(value.electives).map((elective) => {
      if (!isRecord(elective)) throw new TypeError('Expected elective block')
      return {
        credits: expectNumber(elective.credits),
        courses: expectArray(elective.courses).map(parseRequirement),
      }
    }),
  }
}

function parseCatalogProgram(value: unknown): ApiCatalogProgram {
  if (!isRecord(value)) throw new TypeError('Expected catalog program')
  return {
    id: expectNumber(value.id),
    title: expectString(value.title),
    catalogId: expectNumber(value.catalogId),
    catalogYear: expectNumber(value.catalogYear),
    programId: expectNumber(value.programId),
    programCode: expectNumber(value.programCode),
    programName: expectString(value.programName),
    base: parseBlockSet(value.base),
    modalities: expectArray(value.modalities).map((item) => {
      if (!isRecord(item)) throw new TypeError('Expected specialization')
      return {
        specializationId: expectNumber(item.specializationId),
        code: expectString(item.code),
        name: expectString(item.name),
        blocks: parseBlockSet(item.blocks),
      }
    }),
    languages: expectArray(value.languages).map((item) => {
      if (!isRecord(item)) throw new TypeError('Expected language')
      return {
        languageId: expectNumber(item.languageId),
        name: expectString(item.name),
        blocks: parseBlockSet(item.blocks),
      }
    }),
  }
}

function parseCourse(value: unknown): ApiCourse {
  if (!isRecord(value)) throw new TypeError('Expected course')
  const prefix =
    value.prefix === undefined ? undefined : expectString(value.prefix)
  return {
    id: expectNumber(value.id),
    code: expectString(value.code),
    name: expectString(value.name),
    credits: expectNumber(value.credits),
    ...(prefix === undefined ? {} : { prefix }),
  }
}

function parseCoursesPage(value: unknown): ApiCoursesPage {
  if (!isRecord(value) || !isRecord(value._paths))
    throw new TypeError('Expected courses page')
  const next = value._paths.next
  if (next !== null && typeof next !== 'string')
    throw new TypeError('Expected next page')
  return { data: expectArray(value.data).map(parseCourse), _paths: { next } }
}

function selectorFromApi(requirement: ApiCourseRequirement): CourseSelector {
  if (requirement.type === 'any') return { type: 'anyCourse' }
  if (requirement.type === 'specific' && requirement.courseId !== null) {
    return {
      type: 'specificCourse',
      courseId: String(requirement.courseId) as CourseId,
    }
  }
  if (requirement.type === 'prefix' && requirement.prefix) {
    return { type: 'prefix', prefix: requirement.prefix.trim().toUpperCase() }
  }
  throw new TypeError('Incomplete course requirement')
}

function blocksFromApi(
  blocks: ApiBlockSet,
  source: RequirementSource,
): CurriculumBlocks {
  const mandatory: Array<CourseRequirement> = blocks.mandatory.map(
    (requirement) => ({
      type: 'course',
      source,
      selector: selectorFromApi(requirement),
    }),
  )
  const electives: Array<ElectiveCreditsRequirement> = blocks.electives.map(
    (elective) => ({
      type: 'electiveCredits',
      source,
      requiredCredits: elective.credits,
      eligibleCourses: elective.courses
        .map(selectorFromApi)
        .sort((left, right) =>
          JSON.stringify(left).localeCompare(JSON.stringify(right)),
        ),
    }),
  )
  return { mandatory, electives }
}

async function getJson(path: string) {
  const response = await dataApiRequest(path)
  await expectApiResponse(response)
  return response.json() as Promise<unknown>
}

export function createApiCurriculumPlannerStaticDataSource(): CurriculumPlannerStaticDataSource {
  return {
    async load() {
      if (cachedStaticData) return ok(cachedStaticData)
      if (staticDataLoad) return staticDataLoad
      staticDataLoad = loadStaticData()
      try {
        const result = await staticDataLoad
        if (result.ok) cachedStaticData = result.value
        return result
      } finally {
        staticDataLoad = undefined
      }
    },
  }
}

async function loadStaticData(): Promise<PlannerResult<CurriculumPlannerStaticData>> {
  try {
        const [rawPrograms, coursesPage] = await Promise.all([
          getJson('/catalog-program'),
          getJson('/courses'),
        ])
        const programs = expectArray(rawPrograms).map(parseCatalogProgram)
        const courses = parseCoursesPage(coursesPage).data
        return ok({
          catalogPrograms: programs
            .map((program) => ({
              id: String(program.id) as CatalogProgramId,
              title: program.title,
              catalog: {
                id: String(program.catalogId) as CatalogId,
                year: program.catalogYear,
              },
              program: {
                id: String(program.programId) as ProgramId,
                code: String(program.programCode),
                name: program.programName,
              },
              baseBlocks: blocksFromApi(program.base, { type: 'base' }),
              specializations: program.modalities
                .map((specialization) => ({
                  id: String(
                    specialization.specializationId,
                  ) as SpecializationId,
                  code: specialization.code,
                  name: specialization.name,
                  blocks: blocksFromApi(specialization.blocks, {
                    type: 'specialization',
                    specializationId: String(
                      specialization.specializationId,
                    ) as SpecializationId,
                  }),
                }))
                .sort((left, right) => left.id.localeCompare(right.id)),
              languages: program.languages
                .map((language) => ({
                  id: String(language.languageId) as LanguageId,
                  name: language.name,
                  blocks: blocksFromApi(language.blocks, {
                    type: 'language',
                    languageId: String(language.languageId) as LanguageId,
                  }),
                }))
                .sort((left, right) => left.id.localeCompare(right.id)),
            }))
            .sort((left, right) => left.id.localeCompare(right.id)),
          courses: courses
            .map((course) => ({
              id: String(course.id) as CourseId,
              code: course.code,
              name: course.name,
              credits: course.credits,
              prefix: (course.prefix ?? course.code.slice(0, 2))
                .trim()
                .toUpperCase(),
            }))
            .sort((left, right) => left.id.localeCompare(right.id)),
        })
  } catch (error) {
    if (error instanceof ApiError && error.status < 500)
      return unexpected()
    if (error instanceof TypeError) return unexpected()
    return unavailable()
  }
}
