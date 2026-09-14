import type { SharedPeriodPlanning as GeneratedSharedPeriodPlanning } from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

type GeneratedSharedClass = GeneratedSharedPeriodPlanning['classes'][number]
type GeneratedSharedSchedule = GeneratedSharedClass['classSchedules'][number]
export type SharedPeriodPlanning = Readonly<{
  shareId: GeneratedSharedPeriodPlanning['shareId']
  name: GeneratedSharedPeriodPlanning['name']
  visibility: GeneratedSharedPeriodPlanning['visibility']
  studyPeriodId: GeneratedSharedPeriodPlanning['studyPeriodId']
  studyPeriodYear: GeneratedSharedPeriodPlanning['studyPeriodYear']
  studyPeriodYearPeriod: GeneratedSharedPeriodPlanning['studyPeriodYearPeriod']
  owner: GeneratedSharedPeriodPlanning['owner']
  classes: ReadonlyArray<
    Readonly<{
      id: GeneratedSharedClass['id']
      code: GeneratedSharedClass['code']
      courseCode: GeneratedSharedClass['courseCode']
      courseCredits: GeneratedSharedClass['courseCredits']
      professors: GeneratedSharedClass['professors']
      classSchedules: ReadonlyArray<
        Readonly<
          Pick<
            GeneratedSharedSchedule,
            'id' | 'dayOfWeek' | 'start' | 'end' | 'roomId' | 'roomCode'
          >
        >
      >
    }>
  >
  createdAt: GeneratedSharedPeriodPlanning['createdAt']
  updatedAt: GeneratedSharedPeriodPlanning['updatedAt']
}>
export type SharedPeriodYearPeriod = SharedPeriodPlanning['studyPeriodYearPeriod']

type GetAccessToken = () => Promise<string>

export async function listSharedPeriodPlanningsForPerson(
  studentId: number,
  ownerPublicId: string,
  getAccessToken: GetAccessToken,
) {
  const pages = pomiSdk.app.studentSharedPeriodPlannings.pages(
    studentId,
    { page: 1, pageSize: 20, filter: { ownerPublicId } },
    { getAccessToken },
  )
  const items: Array<SharedPeriodPlanning> = []
  let total = 0
  for await (const page of pages) {
    items.push(...page.data)
    total = page.total
  }
  return { items, page: 1, pageSize: 20, total }
}

export const getPublicSharedPeriodPlanning = (shareId: string) =>
  pomiSdk.app.sharedPeriodPlannings.getPublic(shareId)
export const getSharedPeriodPlanningForStudent = (
  studentId: number,
  shareId: string,
  getAccessToken: GetAccessToken,
) =>
  pomiSdk.app.sharedPeriodPlannings.getForStudent(studentId, shareId, {
    getAccessToken,
  })
export const copySharedPeriodPlanning = (
  studentId: number,
  planning: Pick<SharedPeriodPlanning, 'name' | 'studyPeriodId' | 'classes'>,
  getAccessToken: GetAccessToken,
) =>
  pomiSdk.app.periodPlannings.create(
    studentId,
    {
      name: `Cópia de ${planning.name}`,
      studyPeriodId: planning.studyPeriodId,
      classes: planning.classes.map((item) => item.id),
    },
    { getAccessToken },
  )
