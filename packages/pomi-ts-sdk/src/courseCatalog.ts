import { appApi, dataApi } from './endpoint'
import { collectPages } from './pagination'
import type { PomiClient } from './client'

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

type CourseCatalogPage<T> = Readonly<{
  data: ReadonlyArray<T>
  total?: number
  page?: number
  pageSize?: number
  totalPages?: number
  _paths?: Readonly<{ next: string | null; previous?: string | null }>
}>

type ListCoursesInput = Readonly<{
  q?: string
  unitId?: number
  catalogYear?: number
  tagId?: number
  page: number
  pageSize?: number
}>
type CourseInput = Readonly<{ courseId: number }>
type CoursePeriodInput = CourseInput & Readonly<{ studyPeriodId: number }>
type TagInput = Readonly<{ tagId: number }>
type CourseTagInput = CourseInput & TagInput

const dataInterface = dataApi.interface('')
const appPublicInterface = appApi.public.interface('')
const appAuthenticatedInterface = appApi.authenticated.interface('')
const listCoursesEndpoint = dataInterface.get<CoursePage, ListCoursesInput>(
  '/courses',
  {
    query: ({ q, unitId, catalogYear, tagId, page, pageSize }) => ({
      page,
      pageSize: pageSize ?? 20,
      q: q || undefined,
      unitId: unitId || undefined,
      catalogYear: catalogYear || undefined,
      tagId: tagId || undefined,
    }),
  },
)

const getCourseEndpoint = dataInterface.get<Course, CourseInput>(
  '/courses/:courseId',
)

function dataListEndpoint<TOutput>(path: string) {
  return dataInterface.get<TOutput>(`/${path}`)
}

function appListEndpoint<TOutput>(path: string) {
  return appPublicInterface.get<TOutput>(`/${path}`)
}

const listUnitsEndpoint = dataListEndpoint<ReadonlyArray<Unit>>('units')
const listCatalogsEndpoint =
  dataListEndpoint<ReadonlyArray<Catalog>>('catalogs')
const listCategoriesEndpoint =
  appListEndpoint<ReadonlyArray<Category>>('categories')
const listTagsEndpoint = appListEndpoint<ReadonlyArray<Tag>>('tags')

const listCourseTagsEndpoint = appPublicInterface.get<
  ReadonlyArray<Tag>,
  CourseInput
>('/courses/:courseId/tags')

const listCatalogCoursesEndpoint = dataInterface.get<
  CourseCatalogPage<CatalogCourse>,
  CourseInput
>('/catalog-courses', {
  query: ({ courseId }) => ({ courseId, page: 1, pageSize: 100 }),
})

const listStudyPeriodsEndpoint =
  dataListEndpoint<ReadonlyArray<StudyPeriod>>('study-periods')

function coursePeriodEndpoint<TOutput>(path: string) {
  return dataInterface.get<CourseCatalogPage<TOutput>, CoursePeriodInput>(
    `/${path}`,
    {
      query: ({ courseId, studyPeriodId }) => ({
        courseId,
        studyPeriodId,
        page: 1,
        pageSize: 100,
      }),
    },
  )
}

const listCourseClassesEndpoint = coursePeriodEndpoint<CourseClass>('classes')
const listCourseSchedulesEndpoint =
  coursePeriodEndpoint<ClassSchedule>('class-schedules')

const listRelatedCoursesEndpoint = appPublicInterface.get<
  CourseCatalogPage<Course>,
  TagInput
>('/tags/:tagId/courses', { query: () => ({ page: 1, pageSize: 100 }) })

function courseTagEndpoint(method: 'PUT' | 'DELETE') {
  return method === 'PUT'
    ? appAuthenticatedInterface.put<void, CourseTagInput>(
        '/courses/:courseId/tags/:tagId',
        { response: 'empty' },
      )
    : appAuthenticatedInterface.remove<CourseTagInput>(
        '/courses/:courseId/tags/:tagId',
      )
}

const putCourseTagEndpoint = courseTagEndpoint('PUT')
const deleteCourseTagEndpoint = courseTagEndpoint('DELETE')

export function createCourseCatalogApi(client: PomiClient) {
  const api = client.bind({
    listCourses: listCoursesEndpoint,
    getCourse: getCourseEndpoint,
    listUnits: listUnitsEndpoint,
    listCatalogs: listCatalogsEndpoint,
    listCategories: listCategoriesEndpoint,
    listTags: listTagsEndpoint,
    listCourseTags: listCourseTagsEndpoint,
    listCatalogCourses: listCatalogCoursesEndpoint,
    listStudyPeriods: listStudyPeriodsEndpoint,
    listCourseClasses: listCourseClassesEndpoint,
    listCourseSchedules: listCourseSchedulesEndpoint,
    listRelatedCourses: listRelatedCoursesEndpoint,
    putCourseTag: putCourseTagEndpoint,
    deleteCourseTag: deleteCourseTagEndpoint,
  })

  function listCourses(input: ListCoursesInput) {
    return api.listCourses(input)
  }

  function getCourse(courseId: number) {
    return api.getCourse({ courseId })
  }

  function listUnits() {
    return api.listUnits({})
  }

  function listCatalogs() {
    return api.listCatalogs({})
  }

  function listCategories() {
    return api.listCategories({})
  }

  function listTags() {
    return api.listTags({})
  }

  function listCourseTags(courseId: number) {
    return api.listCourseTags({ courseId })
  }

  function listCatalogCourses(courseId: number) {
    return collectPages(client, 'data', api.listCatalogCourses({ courseId }))
  }

  function listStudyPeriods() {
    return api.listStudyPeriods({})
  }

  function listCourseClasses(courseId: number, studyPeriodId: number) {
    return collectPages(
      client,
      'data',
      api.listCourseClasses({ courseId, studyPeriodId }),
    )
  }

  function listCourseSchedules(courseId: number, studyPeriodId: number) {
    return collectPages(
      client,
      'data',
      api.listCourseSchedules({ courseId, studyPeriodId }),
    )
  }

  function listRelatedCourses(tagId: number) {
    return collectPages(client, 'app', api.listRelatedCourses({ tagId }))
  }

  async function putCourseTag(
    courseId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await api.putCourseTag({ courseId, tagId }, { getAccessToken })
  }
  async function deleteCourseTag(
    courseId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await api.deleteCourseTag({ courseId, tagId }, { getAccessToken })
  }

  return {
    listCourses,
    getCourse,
    listUnits,
    listCatalogs,
    listCategories,
    listTags,
    listCourseTags,
    listCatalogCourses,
    listStudyPeriods,
    listCourseClasses,
    listCourseSchedules,
    listRelatedCourses,
    putCourseTag,
    deleteCourseTag,
  }
}
