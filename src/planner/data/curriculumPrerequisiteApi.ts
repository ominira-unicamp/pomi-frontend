import { prerequisiteAlternativeKey } from '@pomi/planner-domain/curriculum'
import type {
  CourseId,
  CoursePrerequisiteRule,
  PrerequisiteItem,
} from '@pomi/planner-domain/curriculum'

import { dataApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'

type ApiCatalog = Readonly<{ id: number; year: number }>
type ApiPrerequisiteItem = Readonly<{
  code: string
  kind: 'FULL' | 'PARTIAL' | 'SPECIAL'
  courseId: number | null
  prefixId: number | null
}>
type ApiCatalogCourse = Readonly<{
  courseId: number
  prerequisites: Readonly<{
    any: ReadonlyArray<Readonly<{ all: ReadonlyArray<ApiPrerequisiteItem> }>>
  }>
}>
type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>

export type CurrentYearPrerequisites = Readonly<{
  catalogId: number
  year: number
  courseIds: ReadonlyArray<CourseId>
  rules: ReadonlyArray<CoursePrerequisiteRule>
}>

export class CurrentCatalogUnavailableError extends Error {
  constructor(readonly year: number) {
    super(`Current catalog ${year} is unavailable`)
    this.name = 'CurrentCatalogUnavailableError'
  }
}

const loadsByYear = new Map<number, Promise<CurrentYearPrerequisites>>()

export function currentCatalogYear(date = new Date()) {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      timeZone: 'America/Sao_Paulo',
    }).format(date),
  )
}

async function getJson<T>(path: string): Promise<T> {
  const response = await dataApiRequest(path)
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

function pathFromLink(link: string) {
  const url = new URL(link, 'https://data.pomi.local')
  return `${url.pathname}${url.search}`
}

async function listAllPages<T>(path: string) {
  const items: Array<T> = []
  let next: string | null = path
  while (next) {
    const page: ApiPage<T> = await getJson(pathFromLink(next))
    items.push(...page.data)
    next = page._paths?.next ?? null
  }
  return items
}

function prerequisiteItemFromApi(item: ApiPrerequisiteItem): PrerequisiteItem {
  if (item.kind === 'SPECIAL') {
    return {
      kind: item.kind,
      target: { type: 'special', code: item.code },
    }
  }
  if (item.courseId !== null) {
    return {
      kind: item.kind,
      target: {
        type: 'course',
        courseId: String(item.courseId) as CourseId,
        code: item.code,
      },
    }
  }
  return {
    kind: item.kind,
    target: {
      type: 'prefix',
      prefix: item.code.replace(/-+$/g, '').trim().toUpperCase(),
    },
  }
}

function ruleFromApi(course: ApiCatalogCourse): CoursePrerequisiteRule {
  return {
    courseId: String(course.courseId) as CourseId,
    alternatives: course.prerequisites.any
      .map((alternative) => {
        const allOf = alternative.all.map(prerequisiteItemFromApi)
        return { key: prerequisiteAlternativeKey(allOf), allOf }
      })
      .sort((left, right) => left.key.localeCompare(right.key)),
  }
}

async function loadForYear(year: number): Promise<CurrentYearPrerequisites> {
  const catalogs = await getJson<ReadonlyArray<ApiCatalog>>(
    `/catalogs?year=${year}`,
  )
  const catalog = catalogs.find((item) => item.year === year)
  if (!catalog) throw new CurrentCatalogUnavailableError(year)
  const courses = await listAllPages<ApiCatalogCourse>(
    `/catalog-courses?catalogId=${catalog.id}&page=1&pageSize=1000`,
  )
  return {
    catalogId: catalog.id,
    year,
    courseIds: courses.map((course) => String(course.courseId) as CourseId),
    rules: courses
      .map(ruleFromApi)
      .filter((rule) => rule.alternatives.length > 0)
      .sort((left, right) => left.courseId.localeCompare(right.courseId)),
  }
}

export function loadCurrentYearPrerequisites(date = new Date()) {
  const year = currentCatalogYear(date)
  const current = loadsByYear.get(year)
  if (current) return current
  const loading = loadForYear(year).catch((error) => {
    loadsByYear.delete(year)
    throw error
  })
  loadsByYear.set(year, loading)
  return loading
}
