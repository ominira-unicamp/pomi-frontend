import { legacyListCoursesInput } from './compatibility/courseCatalog.js'
import type { LegacyListCoursesInput } from './compatibility/courseCatalog.js'
import type {
  Catalog as GeneratedCatalog,
  CatalogCourse as GeneratedCatalogCourse,
  Class as GeneratedClass,
  ClassSchedule as GeneratedClassSchedule,
  Course as GeneratedCourse,
  Page,
  StudyPeriod as GeneratedStudyPeriod,
  Unit as GeneratedUnit,
} from './generated/data/domain.js'
import type {
  Category as GeneratedCategory,
  Tag as GeneratedTag,
  TagRelatedCourse as GeneratedTagRelatedCourse,
} from './generated/app/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type Course = GeneratedCourse
export type CoursePage = Page<Course>
export type Unit = GeneratedUnit
export type Catalog = GeneratedCatalog
export type Category = GeneratedCategory
export type Tag = GeneratedTag
export type CatalogCourse = GeneratedCatalogCourse
export type StudyPeriod = GeneratedStudyPeriod
export type CourseClass = GeneratedClass
export type ClassSchedule = GeneratedClassSchedule
export type RelatedCourse = GeneratedTagRelatedCourse

export function createCourseCatalogApi(client: PomiSdkClient) {
  function listCourses(input: LegacyListCoursesInput) {
    return client.data.courses.list(legacyListCoursesInput(input))
  }

  function getCourse(courseId: number) {
    return client.data.courses.get(courseId)
  }

  function listUnits() {
    return client.data.units.list({})
  }

  function listCatalogs() {
    return client.data.catalogs.list({})
  }

  function listCategories() {
    return client.app.categories.list({})
  }

  function listTags() {
    return client.app.tags.list({})
  }

  function listCourseTags(courseId: number) {
    return client.app.coursesTags.list(courseId, {})
  }

  function listCatalogCourses(courseId: number) {
    return client.data.catalogCourses.listAll({
      page: 1,
      pageSize: 100,
      filter: { courseId },
    })
  }

  function listStudyPeriods() {
    return client.data.studyPeriods.list({})
  }

  function listCourseClasses(courseId: number, studyPeriodId: number) {
    return client.data.classes.listAll({
      page: 1,
      pageSize: 100,
      filter: { courseId, studyPeriodId },
    })
  }

  function listCourseSchedules(courseId: number, studyPeriodId: number) {
    return client.data.classSchedules.listAll({
      page: 1,
      pageSize: 100,
      filter: {
        course: { id: courseId },
        studyPeriod: { id: studyPeriodId },
      },
    })
  }

  function listRelatedCourses(tagId: number) {
    return client.app.tagsCourses.listAll(tagId, {
      page: 1,
      pageSize: 100,
    })
  }

  async function putCourseTag(
    courseId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.coursesTags.update(courseId, tagId, { getAccessToken })
  }
  async function deleteCourseTag(
    courseId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.coursesTags.delete(courseId, tagId, { getAccessToken })
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
