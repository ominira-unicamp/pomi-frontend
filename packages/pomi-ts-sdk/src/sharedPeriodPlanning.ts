import { expectApiResponse } from './errors'
import type { PomiClient } from './client'

export type SharedPeriodYearPeriod =
  | 'SUMMER'
  | 'FIRST_SEMESTER'
  | 'WINTER'
  | 'SECOND_SEMESTER'

export type SharedPeriodPlanning = Readonly<{
  shareId: string
  name: string
  visibility: 'FRIENDS' | 'PUBLIC'
  studyPeriodId: number
  studyPeriodYear: number
  studyPeriodYearPeriod: SharedPeriodYearPeriod
  owner: Readonly<{ publicId: string; displayName: string }> | null
  classes: ReadonlyArray<
    Readonly<{
      id: number
      code: string
      courseCode: string
      courseCredits: number
      professors: ReadonlyArray<Readonly<{ id: number; name: string }>>
      classSchedules: ReadonlyArray<
        Readonly<{
          id: number
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
          roomId: number
          roomCode: string
        }>
      >
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

export function createSharedPeriodPlanningApi(client: PomiClient) {
  async function listSharedPeriodPlanningsForPerson(
    studentId: number,
    ownerPublicId: string,
    getAccessToken: () => Promise<string>,
  ) {
    const params = new URLSearchParams({
      page: '1',
      pageSize: '20',
      ownerPublicId,
    })
    const response = await client.appApiRequest(
      `/student/${studentId}/shared-period-plannings?${params.toString()}`,
      getAccessToken,
    )
    await expectApiResponse(response)
    return (await response.json()) as SharedPeriodPlanningPage
  }

  async function getPublicSharedPeriodPlanning(shareId: string) {
    const response = await client.appApiPublicRequest(
      `/shared-period-plannings/${encodeURIComponent(shareId)}`,
    )
    await expectApiResponse(response)
    return (await response.json()) as SharedPeriodPlanning
  }

  async function getSharedPeriodPlanningForStudent(
    studentId: number,
    shareId: string,
    getAccessToken: () => Promise<string>,
  ) {
    const response = await client.appApiRequest(
      `/student/${studentId}/shared-period-plannings/${encodeURIComponent(shareId)}`,
      getAccessToken,
    )
    await expectApiResponse(response)
    return (await response.json()) as SharedPeriodPlanning
  }

  async function copySharedPeriodPlanning(
    studentId: number,
    planning: Pick<SharedPeriodPlanning, 'name' | 'studyPeriodId' | 'classes'>,
    getAccessToken: () => Promise<string>,
  ) {
    const response = await client.appApiRequest(
      `/student/${studentId}/period-plannings`,
      getAccessToken,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Cópia de ${planning.name}`,
          studyPeriodId: planning.studyPeriodId,
          classes: planning.classes.map((classItem) => classItem.id),
        }),
      },
    )
    await expectApiResponse(response)
    return (await response.json()) as Readonly<{ id: number }>
  }

  return {
    listSharedPeriodPlanningsForPerson,
    getPublicSharedPeriodPlanning,
    getSharedPeriodPlanningForStudent,
    copySharedPeriodPlanning,
  }
}
