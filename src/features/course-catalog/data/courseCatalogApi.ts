import type {
  Category,
  Tag,
  TagRelatedCourse,
} from '@ominira/pomi-sdk/generated/app'
import type {
  Catalog,
  CatalogCourse,
  Class,
  ClassSchedule,
  Course,
  Page,
  StudyPeriod,
  Unit,
  listCoursesInput,
} from '@ominira/pomi-sdk/generated/data'
import { pomiSdk } from '@/api/client'

export type CoursePage = Page<Course>
export type CourseClass = Class
export type RelatedCourse = TagRelatedCourse
export type {
  Catalog,
  CatalogCourse,
  Category,
  ClassSchedule,
  Course,
  StudyPeriod,
  Tag,
  Unit,
}

type CourseSearchInput = Readonly<{
  q?: string
  unitId?: number
  catalogYear?: number
  tagId?: number
  page: number
  pageSize?: number
}>

function courseSearchInput(input: CourseSearchInput): listCoursesInput {
  return {
    page: input.page,
    pageSize: input.pageSize ?? 20,
    filter: {
      ...(input.q ? { code: input.q } : {}),
      ...(input.unitId ? { unit: { id: input.unitId } } : {}),
      ...(input.catalogYear ? { catalogYear: input.catalogYear } : {}),
      ...(input.tagId ? { tagId: input.tagId } : {}),
    },
  }
}

export const listCourses = (input: CourseSearchInput) =>
  pomiSdk.data.courses.list(courseSearchInput(input))
export const getCourse = (courseId: number) => pomiSdk.data.courses.get(courseId)
export const listUnits = () => pomiSdk.data.units.listAll({})
export const listCatalogs = () => pomiSdk.data.catalogs.listAll({})
export const listCategories = () => pomiSdk.app.categories.listAll({})
export const listTags = () => pomiSdk.app.tags.listAll({})
export const listCourseTags = (courseId: number) =>
  pomiSdk.app.courseTags.listForCourseAll(courseId, {})
export const listCatalogCourses = (courseId: number) =>
  pomiSdk.data.catalogCourses.listAll({
    page: 1,
    pageSize: 100,
    filter: { courseId },
  })
export const listStudyPeriods = () => pomiSdk.data.studyPeriods.listAll({})
export const listCourseClasses = (courseId: number, studyPeriodId: number) =>
  pomiSdk.data.classes.listAll({
    page: 1,
    pageSize: 100,
    filter: { courseId, studyPeriodId },
  })
export const listCourseSchedules = (
  courseId: number,
  studyPeriodId: number,
) =>
  pomiSdk.data.classSchedules.listAll({
    page: 1,
    pageSize: 100,
    filter: {
      course: { id: courseId },
      studyPeriod: { id: studyPeriodId },
    },
  })
export const listRelatedCourses = (tagId: number) =>
  pomiSdk.app.courseTags.listCoursesForTagAll(tagId, {
    page: 1,
    pageSize: 100,
  })
export const putCourseTag = (
  courseId: number,
  tagId: number,
  getAccessToken: () => Promise<string>,
) => pomiSdk.app.courseTags.add(courseId, tagId, { getAccessToken })
export const deleteCourseTag = (
  courseId: number,
  tagId: number,
  getAccessToken: () => Promise<string>,
) => pomiSdk.app.courseTags.remove(courseId, tagId, { getAccessToken })
