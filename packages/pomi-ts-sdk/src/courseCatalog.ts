import { legacyListCoursesInput } from './compatibility/courseCatalog.js'
import { collectPages } from './generatedPagination.js'
import type { LegacyListCoursesInput } from './compatibility/courseCatalog.js'
import type {
  listCatalogCoursesOutput,
  listCatalogsOutput,
  listClassSchedulesOutput,
  listClassesOutput,
  listCoursesOutput,
  listStudyPeriodsOutput,
  listUnitsOutput,
} from './generated/data/operations.js'
import type {
  listCategoriesOutput,
  listCoursesTagsOutput,
} from './generated/app/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

type GeneratedCourse = listCoursesOutput['data'][number]
export type Course = Readonly<
  Pick<
    GeneratedCourse,
    'id' | 'code' | 'name' | 'credits' | 'prefix' | 'unitId' | 'unitCode'
  >
>
export type CoursePage = Readonly<{
  data: ReadonlyArray<Course>
  quantity: number
  total: number
  _paths: Readonly<Pick<listCoursesOutput['_paths'], 'next' | 'prev'>>
}>
export type Unit = Readonly<
  Pick<listUnitsOutput[number], 'id' | 'code' | 'name'>
>
export type Catalog = Readonly<Pick<listCatalogsOutput[number], 'id' | 'year'>>
export type Category = Readonly<listCategoriesOutput[number]>
export type Tag = Readonly<listCoursesTagsOutput[number]>
export type CatalogCourse = Readonly<listCatalogCoursesOutput['data'][number]>
export type StudyPeriod = Readonly<
  Pick<
    listStudyPeriodsOutput[number],
    'id' | 'year' | 'yearPeriod' | 'startDate'
  >
>
export type CourseClass = Readonly<
  Pick<listClassesOutput['data'][number], 'id' | 'code' | 'professors'>
>
export type ClassSchedule = Readonly<
  Pick<
    listClassSchedulesOutput['data'][number],
    'id' | 'classId' | 'dayOfWeek' | 'start' | 'end' | 'roomCode'
  >
>

export function createCourseCatalogApi(client: PomiSdkClient) {
  function listCourses(input: LegacyListCoursesInput) {
    return client.data.courses.list(legacyListCoursesInput(input))
  }

  function getCourse(courseId: number) {
    return client.data.courses.get(courseId)
  }

  function listUnits() {
    return client.data.listUnits({})
  }

  function listCatalogs() {
    return client.data.listCatalogs({})
  }

  function listCategories() {
    return client.app.listCategories({})
  }

  function listTags() {
    return client.app.listTags({})
  }

  function listCourseTags(courseId: number) {
    return client.app.listCoursesTags({ courseId })
  }

  function listCatalogCourses(courseId: number) {
    return collectPages(
      client,
      'data',
      client.data.listCatalogCourses({
        page: 1,
        pageSize: 100,
        filter: { courseId },
      }),
    )
  }

  function listStudyPeriods() {
    return client.data.listStudyPeriods({})
  }

  function listCourseClasses(courseId: number, studyPeriodId: number) {
    return collectPages(
      client,
      'data',
      client.data.listClasses({
        page: 1,
        pageSize: 100,
        filter: { courseId, studyPeriodId },
      }),
    )
  }

  function listCourseSchedules(courseId: number, studyPeriodId: number) {
    return collectPages(
      client,
      'data',
      client.data.listClassSchedules({
        page: 1,
        pageSize: 100,
        filter: {
          course: { id: courseId },
          studyPeriod: { id: studyPeriodId },
        },
      }),
    )
  }

  function listRelatedCourses(tagId: number) {
    return collectPages(
      client,
      'app',
      client.app.listTagsCourses({ id: tagId, page: 1, pageSize: 100 }),
    ) as unknown as Promise<ReadonlyArray<Course>>
  }

  async function putCourseTag(
    courseId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.updateCoursesTags({ courseId, tagId }, { getAccessToken })
  }
  async function deleteCourseTag(
    courseId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.deleteCoursesTags({ courseId, tagId }, { getAccessToken })
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
