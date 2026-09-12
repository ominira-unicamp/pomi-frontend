import type { createStudentPeriodPlanningsInput } from './generated/app/operations.js'
import type { SharedPeriodPlanning as GeneratedSharedPeriodPlanning } from './generated/app/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

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
export type SharedPeriodYearPeriod =
  SharedPeriodPlanning['studyPeriodYearPeriod']
export function createSharedPeriodPlanningApi(client: PomiSdkClient) {
  async function listSharedPeriodPlanningsForPerson(
    studentId: number,
    ownerPublicId: string,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentSharedPeriodPlannings.list(
      String(studentId),
      {
        page: '1',
        pageSize: '20',
        filter: { ownerPublicId },
      },
      { getAccessToken },
    ) as Promise<
      Readonly<{
        items: ReadonlyArray<SharedPeriodPlanning>
        page: number
        pageSize: number
        total: number
      }>
    >
  }

  async function getPublicSharedPeriodPlanning(shareId: string) {
    return client.app.sharedPeriodPlannings.get(shareId)
  }

  async function getSharedPeriodPlanningForStudent(
    studentId: number,
    shareId: string,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentSharedPeriodPlannings.get(
      String(studentId),
      shareId,
      {
        getAccessToken,
      },
    )
  }

  async function copySharedPeriodPlanning(
    studentId: number,
    planning: Pick<SharedPeriodPlanning, 'name' | 'studyPeriodId' | 'classes'>,
    getAccessToken: () => Promise<string>,
  ) {
    const body: createStudentPeriodPlanningsInput['body'] = {
      name: `Cópia de ${planning.name}`,
      studyPeriodId: planning.studyPeriodId,
      classes: planning.classes.map((classItem) => classItem.id),
    }
    return client.app.periodPlannings.create(String(studentId), body, {
      getAccessToken,
    })
  }

  return {
    listSharedPeriodPlanningsForPerson,
    getPublicSharedPeriodPlanning,
    getSharedPeriodPlanningForStudent,
    copySharedPeriodPlanning,
  }
}
