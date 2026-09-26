import type {
  CatalogId,
  CatalogProgramId,
  CatalogProgramVariantId,
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
} from '@pomi/planner-domain/curriculum'

import type {
  CourseBlockSet as BlockSet,
  CatalogProgram,
  CatalogProgramLanguage,
  CatalogProgramVariant,
  Course,
  CourseRequirement as GeneratedCourseRequirement,
} from '@ominira/pomi-sdk/generated/data'
import { ApiError } from '@/api/errors'
import { pomiSdk } from '@/api/client'
import { publicStaticDataCache } from '@/lib/publicStaticDataCache'

type ApiCourseRequirement = GeneratedCourseRequirement
type ApiBlockSet = {
  mandatory: ReadonlyArray<ApiCourseRequirement>
  electives: ReadonlyArray<{
    credits: BlockSet['electives'][number]['credits']
    courses: ReadonlyArray<ApiCourseRequirement>
  }>
}
type ApiCatalogProgram = Pick<
  CatalogProgram,
  | 'id'
  | 'title'
  | 'catalogId'
  | 'catalogYear'
  | 'programId'
  | 'programCode'
  | 'programName'
> & {
  base: ApiBlockSet
  variants: ReadonlyArray<ApiCatalogProgramVariant>
  languages: ReadonlyArray<
    Pick<CatalogProgramLanguage, 'languageId' | 'name'> & {
      blocks: ApiBlockSet
    }
  >
}
type ApiCatalogProgramVariant = {
  id: CatalogProgramVariant['id']
  type: CatalogProgramVariant['type']
  curriculumSuggestionId: CatalogProgramVariant['curriculumSuggestionId']
  code: CatalogProgramVariant['code']
  name: CatalogProgramVariant['name']
  blocks: ApiBlockSet
} & (
  | { type: 'PROGRAM'; program: { programId: number } }
  | { type: 'SPECIALIZATION'; specialization: { specializationId: number } }
)
type ApiCourse = Pick<Course, 'id' | 'code' | 'name' | 'credits'> & {
  prefix?: Course['prefix']
}

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
let staticDataLoad:
  | Promise<PlannerResult<CurriculumPlannerStaticData>>
  | undefined
let staticDataCacheLoaded = false
let staticDataRefreshed = false

const staticDataCacheKey = 'curriculum-planner:static-data'

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
  const id = expectNumber(value.id)
  if (type === 'any') return { id, type }
  if (type === 'prefix') {
    if (!isRecord(value.prefix)) throw new TypeError('Expected prefix facet')
    return { id, type, prefix: { value: expectString(value.prefix.value) } }
  }
  if (type === 'specific') {
    if (!isRecord(value.specific))
      throw new TypeError('Expected specific facet')
    return {
      id,
      type,
      specific: {
        courseId: expectNumber(value.specific.courseId),
        courseCode: expectString(value.specific.courseCode),
        courseName: expectString(value.specific.courseName),
        catalogCourseId:
          value.specific.catalogCourseId === null
            ? null
            : expectNumber(value.specific.catalogCourseId),
      },
    }
  }
  throw new TypeError('Invalid requirement type')
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
    variants: expectArray(value.variants).map((item) => {
      if (!isRecord(item)) throw new TypeError('Expected variant')
      const type = expectString(item.type)
      const common = {
        id: expectNumber(item.id),
        type,
        curriculumSuggestionId:
          item.curriculumSuggestionId === null
            ? null
            : expectNumber(item.curriculumSuggestionId),
        code: expectString(item.code),
        name: expectString(item.name),
        blocks: parseBlockSet(item.blocks),
      }
      if (type === 'PROGRAM') {
        if (!isRecord(item.program))
          throw new TypeError('Expected program facet')
        return {
          ...common,
          type,
          program: { programId: expectNumber(item.program.programId) },
        }
      }
      if (type === 'SPECIALIZATION') {
        if (!isRecord(item.specialization))
          throw new TypeError('Expected specialization facet')
        return {
          ...common,
          type,
          specialization: {
            specializationId: expectNumber(
              item.specialization.specializationId,
            ),
          },
        }
      }
      throw new TypeError('Invalid catalog program variant type')
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

function selectorFromApi(requirement: ApiCourseRequirement): CourseSelector {
  if (requirement.type === 'any') return { type: 'anyCourse' }
  if (requirement.type === 'specific') {
    return {
      type: 'specificCourse',
      courseId: String(requirement.specific.courseId) as CourseId,
    }
  }
  return {
    type: 'prefix',
    prefix: requirement.prefix.value.trim().toUpperCase(),
  }
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

export function createApiCurriculumPlannerStaticDataSource(): CurriculumPlannerStaticDataSource {
  return {
    async load() {
      if (!staticDataCacheLoaded) {
        staticDataCacheLoaded = true
        const cached =
          await publicStaticDataCache.read<CurriculumPlannerStaticData>(
            staticDataCacheKey,
          )
        if (cached) cachedStaticData = cached
      }
      if (cachedStaticData) {
        if (!staticDataRefreshed) void refreshStaticData()
        return ok(cachedStaticData)
      }
      return refreshStaticData()
    },
  }
}

async function refreshStaticData() {
  staticDataRefreshed = true
  if (staticDataLoad) return staticDataLoad
  staticDataLoad = loadStaticData()
    .then(async (result) => {
      if (result.ok) {
        cachedStaticData = result.value
        await publicStaticDataCache.write(staticDataCacheKey, result.value)
      }
      return result
    })
    .finally(() => {
      staticDataLoad = undefined
    })
  return staticDataLoad
}

async function loadStaticData(): Promise<
  PlannerResult<CurriculumPlannerStaticData>
> {
  try {
    const [rawPrograms, coursesPage] = await Promise.all([
      pomiSdk.data.catalogPrograms.listAll({}),
      pomiSdk.data.courses.listAll({}),
    ])
    const programs = expectArray(rawPrograms).map(parseCatalogProgram)
    const courses = expectArray(coursesPage).map(parseCourse)
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
          variants: program.variants
            .map((variant) => ({
              id: String(variant.id) as CatalogProgramVariantId,
              specializationId:
                variant.type === 'SPECIALIZATION'
                  ? variant.specialization.specializationId
                  : null,
              code: variant.code,
              name: variant.name,
              blocks: blocksFromApi(variant.blocks, {
                type: 'variant',
                catalogProgramVariantId: String(
                  variant.id,
                ) as CatalogProgramVariantId,
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
    if (error instanceof ApiError && error.status < 500) return unexpected()
    if (error instanceof TypeError) return unexpected()
    return unavailable()
  }
}
