import type { StudyPeriod } from '@pomi/planner-domain/semester'

import { appApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'

export type SharedPeriodPlanning = Readonly<{
  shareId: string
  name: string
  visibility: 'FRIENDS' | 'PUBLIC'
  studyPeriodId: number
  studyPeriodYear: number
  studyPeriodYearPeriod: StudyPeriod['yearPeriod']
  owner: Readonly<{ publicId: string; displayName: string }> | null
  classes: ReadonlyArray<
    Readonly<{
      id: number
      code: string
      courseCode: string
      courseCredits: number
    }>
  >
  createdAt: string
  updatedAt: string
}>

type SharedPeriodPlanningPage = Readonly<{
  items: ReadonlyArray<SharedPeriodPlanning>
  page: number
  pageSize: number
  total: number
}>

export async function listSharedPeriodPlanningsForPerson(
  studentId: number,
  ownerPublicId: string,
  getAccessToken: () => Promise<string>,
) {
  const params = new URLSearchParams({
    page: '1',
    pageSize: '20',
    ownerPublicId,
  })
  const response = await appApiRequest(
    `/student/${studentId}/shared-period-plannings?${params.toString()}`,
    getAccessToken,
  )
  await expectApiResponse(response)
  return (await response.json()) as SharedPeriodPlanningPage
}
