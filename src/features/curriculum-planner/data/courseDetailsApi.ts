import { dataApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'

export type CatalogCourseDetails = Readonly<{
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
}>

export async function getCatalogCourseDetails(
  courseId: number,
  catalogYear: number,
): Promise<CatalogCourseDetails | null> {
  const params = new URLSearchParams({
    courseId: String(courseId),
    catalogYear: String(catalogYear),
    page: '1',
    pageSize: '1',
  })
  const response = await dataApiRequest(`/catalog-courses?${params}`)
  await expectApiResponse(response)
  const page = (await response.json()) as Readonly<{
    data: ReadonlyArray<CatalogCourseDetails>
  }>
  return page.data[0] ?? null
}
