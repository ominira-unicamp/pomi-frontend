import { pomiApi } from '@/api/client'

export type {
  Catalog,
  CatalogCourse,
  Category,
  ClassSchedule,
  Course,
  CourseClass,
  CoursePage,
  StudyPeriod,
  Tag,
  Unit,
} from '@pomi/pomi-ts-sdk/course-catalog'

export const {
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
} = pomiApi.courseCatalog
