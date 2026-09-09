import { appApi } from './endpoint'
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

type ListSharedInput = Readonly<{ studentId: number; ownerPublicId: string }>
type SharedInput = Readonly<{ shareId: string }>
type StudentSharedInput = SharedInput & Readonly<{ studentId: number }>
type CopySharedInput = Readonly<{
  studentId: number
  planning: Pick<SharedPeriodPlanning, 'name' | 'studyPeriodId' | 'classes'>
}>

const publicSharedInterface = appApi.public.interface(
  '/shared-period-plannings',
)
const studentSharedInterface = appApi.authenticated.interface(
  '/student/:studentId/shared-period-plannings',
)
const copySharedInterface = appApi.authenticated.interface(
  '/student/:studentId/period-plannings',
)
const sharedEndpoints = publicSharedInterface.define({
  getPublic: publicSharedInterface.get<SharedPeriodPlanning, SharedInput>(
    '/:shareId',
  ),
  list: studentSharedInterface.get<SharedPeriodPlanningPage, ListSharedInput>(
    '',
    {
      query: ({ ownerPublicId }) => ({ page: 1, pageSize: 20, ownerPublicId }),
    },
  ),
  getStudent: studentSharedInterface.get<
    SharedPeriodPlanning,
    StudentSharedInput
  >('/:shareId'),
  copy: copySharedInterface.post<Readonly<{ id: number }>, CopySharedInput>(
    '',
    {
      body: ({ planning }) => ({
        name: `Cópia de ${planning.name}`,
        studyPeriodId: planning.studyPeriodId,
        classes: planning.classes.map((classItem) => classItem.id),
      }),
    },
  ),
})

export function createSharedPeriodPlanningApi(client: PomiClient) {
  const api = client.bind(sharedEndpoints)

  async function listSharedPeriodPlanningsForPerson(
    studentId: number,
    ownerPublicId: string,
    getAccessToken: () => Promise<string>,
  ) {
    return api.list({ studentId, ownerPublicId }, { getAccessToken })
  }

  async function getPublicSharedPeriodPlanning(shareId: string) {
    return api.getPublic({ shareId })
  }

  async function getSharedPeriodPlanningForStudent(
    studentId: number,
    shareId: string,
    getAccessToken: () => Promise<string>,
  ) {
    return api.getStudent({ studentId, shareId }, { getAccessToken })
  }

  async function copySharedPeriodPlanning(
    studentId: number,
    planning: Pick<SharedPeriodPlanning, 'name' | 'studyPeriodId' | 'classes'>,
    getAccessToken: () => Promise<string>,
  ) {
    return api.copy({ studentId, planning }, { getAccessToken })
  }

  return {
    listSharedPeriodPlanningsForPerson,
    getPublicSharedPeriodPlanning,
    getSharedPeriodPlanningForStudent,
    copySharedPeriodPlanning,
  }
}
