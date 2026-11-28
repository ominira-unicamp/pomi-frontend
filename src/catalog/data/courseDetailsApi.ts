import type { CatalogCourse } from '@/catalog/data/courseCatalogApi'
import { pomiSdk } from '@/api/client'

export type CatalogCourseDetails = CatalogCourse

export async function getCatalogCourseDetails(
  courseId: number,
  catalogYear: number,
): Promise<CatalogCourseDetails | null> {
  const courses = await pomiSdk.data.catalogCourses.listAll({
    page: 1,
    pageSize: 100,
    filter: { courseId },
  })
  return courses.find((course) => course.catalogYear === catalogYear) ?? null
}
