import {
  appApiPublicRequest,
  appApiRequest,
  dataApiRequest,
} from '@/api/client'
import { expectApiResponse } from '@/api/errors'

export type Course = Readonly<{
  id: number
  code: string
  name: string
  credits: number
  prefix: string
  unitId: number | null
  unitCode: string | null
}>

export type CoursePage = Readonly<{
  data: ReadonlyArray<Course>
  quantity: number
  total: number
  _paths: Readonly<{ next: string | null; prev: string | null }>
}>

export type Unit = Readonly<{ id: number; code: string; name: string }>
export type Catalog = Readonly<{ id: number; year: number }>
export type Category = Readonly<{ id: number; name: string }>
export type Tag = Readonly<{
  id: number
  name: string
  categoryId: number
  parentTagId: number | null
}>

export type CatalogCourse = Readonly<{
  id: number
  catalogId: number
  catalogYear: number
  courseId: number
  code: string
  name: string
  credits: number
  coordinator: Readonly<{ id: number; name: string }> | null
  workload: Readonly<{
    theoreticalHours: number | null
    practicalHours: number | null
    laboratoryHours: number | null
    guidedActivityHours: number | null
    distanceHours: number | null
    guidedExtensionHours: number | null
    practicalExtensionHours: number | null
    weeks: number | null
    weeklyClassHours: number | null
    classroomHours: number | null
  }>
  offeringPeriod:
    | 'ALL_PERIODS'
    | 'ODD_PERIODS'
    | 'EVEN_PERIODS'
    | 'UNIT_DISCRETION'
    | null
  evaluation: string | null
  finalExam: boolean | null
  minimumAttendancePercent: number | null
  syllabus: string | null
  bibliography: string | null
  sourceUrl: string | null
  prerequisites: Readonly<{
    any: ReadonlyArray<
      Readonly<{
        all: ReadonlyArray<
          Readonly<{
            code: string
            kind: 'FULL' | 'PARTIAL' | 'SPECIAL'
            courseId: number | null
            prefixId: number | null
          }>
        >
      }>
    >
  }>
}>

export type StudyPeriod = Readonly<{
  id: number
  year: number
  yearPeriod: 'SUMMER' | 'FIRST_SEMESTER' | 'WINTER' | 'SECOND_SEMESTER'
  startDate: string
}>

export type CourseClass = Readonly<{
  id: number
  code: string
  professors: ReadonlyArray<Readonly<{ id: number; name: string }>>
}>

export type ClassSchedule = Readonly<{
  id: number
  classId: number
  dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY'
  start: string
  end: string
  roomCode: string
}>

type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  total?: number
  page?: number
  pageSize?: number
  totalPages?: number
  _paths?: Readonly<{ next: string | null; previous?: string | null }>
}>

async function dataJson<T>(path: string) {
  const response = await dataApiRequest(path)
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

async function appPublicJson<T>(path: string) {
  const response = await appApiPublicRequest(path)
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

async function listAllPages<T>(
  initialPath: string,
  request: (path: string) => Promise<ApiPage<T>>,
) {
  const items: Array<T> = []
  let path: string | null = initialPath
  while (path) {
    const page = await request(path)
    items.push(...page.data)
    path = page._paths?.next ?? null
  }
  return items
}

export function listCourses(input: {
  q?: string
  unitId?: number
  catalogYear?: number
  tagId?: number
  page: number
  pageSize?: number
}) {
  const params = new URLSearchParams({
    page: String(input.page),
    pageSize: String(input.pageSize ?? 20),
  })
  if (input.q) params.set('q', input.q)
  if (input.unitId) params.set('unitId', String(input.unitId))
  if (input.catalogYear)
    params.set('catalogYear', String(input.catalogYear))
  if (input.tagId) params.set('tagId', String(input.tagId))
  return dataJson<CoursePage>(`/courses?${params}`)
}

export function getCourse(courseId: number) {
  return dataJson<Course>(`/courses/${courseId}`)
}

export function listUnits() {
  return dataJson<ReadonlyArray<Unit>>('/units')
}

export function listCatalogs() {
  return dataJson<ReadonlyArray<Catalog>>('/catalogs')
}

export function listCategories() {
  return appPublicJson<ReadonlyArray<Category>>('/categories')
}

export function listTags() {
  return appPublicJson<ReadonlyArray<Tag>>('/tags')
}

export function listCourseTags(courseId: number) {
  return appPublicJson<ReadonlyArray<Tag>>(`/courses/${courseId}/tags`)
}

export function listCatalogCourses(courseId: number) {
  return listAllPages<CatalogCourse>(
    `/catalog-courses?courseId=${courseId}&page=1&pageSize=100`,
    dataJson,
  )
}

export function listStudyPeriods() {
  return dataJson<ReadonlyArray<StudyPeriod>>('/study-periods')
}

export function listCourseClasses(courseId: number, studyPeriodId: number) {
  return listAllPages<CourseClass>(
    `/classes?courseId=${courseId}&studyPeriodId=${studyPeriodId}&page=1&pageSize=100`,
    dataJson,
  )
}

export function listCourseSchedules(courseId: number, studyPeriodId: number) {
  return listAllPages<ClassSchedule>(
    `/class-schedules?courseId=${courseId}&studyPeriodId=${studyPeriodId}&page=1&pageSize=100`,
    dataJson,
  )
}

export function listRelatedCourses(tagId: number) {
  return listAllPages<Course>(
    `/tags/${tagId}/courses?page=1&pageSize=100`,
    appPublicJson,
  )
}

export async function putCourseTag(
  courseId: number,
  tagId: number,
  getAccessToken: () => Promise<string>,
) {
  const response = await appApiRequest(
    `/courses/${courseId}/tags/${tagId}`,
    getAccessToken,
    { method: 'PUT' },
  )
  await expectApiResponse(response)
}

export async function deleteCourseTag(
  courseId: number,
  tagId: number,
  getAccessToken: () => Promise<string>,
) {
  const response = await appApiRequest(
    `/courses/${courseId}/tags/${tagId}`,
    getAccessToken,
    { method: 'DELETE' },
  )
  await expectApiResponse(response)
}
