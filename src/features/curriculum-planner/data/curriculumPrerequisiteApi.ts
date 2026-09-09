import { prerequisiteAlternativeKey } from '@pomi/planner-domain/curriculum'
import type {
  CourseId,
  CoursePrerequisiteRule,
  PrerequisiteItem,
} from '@pomi/planner-domain/curriculum'

import { pomiApi } from '@/api/client'
import type {
  CurriculumApiCatalogCourse,
  CurriculumApiPrerequisiteItem,
} from '@ominira/pomi-sdk/curriculum-prerequisites'

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

function prerequisiteItemFromApi(
  item: CurriculumApiPrerequisiteItem,
): PrerequisiteItem {
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

function ruleFromApi(
  course: CurriculumApiCatalogCourse,
): CoursePrerequisiteRule {
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
  const catalogs = await pomiApi.curriculumPrerequisites.listCatalogs(year)
  const catalog = catalogs.find((item) => item.year === year)
  if (!catalog) throw new CurrentCatalogUnavailableError(year)
  const courses = await pomiApi.curriculumPrerequisites.listCatalogCourses(
    catalog.id,
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

export function loadCatalogPrerequisites(year: number) {
  const current = loadsByYear.get(year)
  if (current) return current
  const loading = loadForYear(year).catch((error) => {
    loadsByYear.delete(year)
    throw error
  })
  loadsByYear.set(year, loading)
  return loading
}

export function loadCurrentYearPrerequisites(date = new Date()) {
  return loadCatalogPrerequisites(currentCatalogYear(date))
}
