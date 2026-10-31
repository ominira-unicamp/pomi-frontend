import type { CatalogCourse } from '@/features/course-catalog/data/courseCatalogApi'
import { listCatalogCourses } from '@/features/course-catalog/data/courseCatalogApi'

export type CatalogCourseDetails = CatalogCourse

export async function getCatalogCourseDetails(
  courseId: number,
  catalogYear: number,
): Promise<CatalogCourseDetails | null> {
  const courses = await listCatalogCourses(courseId)
  return courses.find((course) => course.catalogYear === catalogYear) ?? null
}
