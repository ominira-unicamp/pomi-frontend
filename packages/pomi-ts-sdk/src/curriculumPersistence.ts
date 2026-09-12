import type {
  createStudentCurriculaInput,
  updateStudentCurriculaInput,
} from './generated/app/operations.js'
import type { Curriculum, CurriculumSummary } from './generated/app/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type CurriculumApiEntity = Curriculum
export type CurriculumSummaryApiEntity = CurriculumSummary
export type CurriculumCreateInput = Readonly<
  createStudentCurriculaInput['body']
>
export type CurriculumApiSelection = CurriculumCreateInput['selection']
export type CurriculumApiPlanningStart = CurriculumCreateInput['planningStart']

export function createCurriculumPersistenceApi(client: PomiSdkClient) {
  async function listCurricula(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentCurricula.list(
      String(studentId),
      {},
      { getAccessToken },
    )
  }

  async function getCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentCurricula.get(
      String(studentId),
      String(curriculumId),
      {
        getAccessToken,
      },
    )
  }

  async function createCurriculum(
    studentId: number,
    input: CurriculumCreateInput,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentCurricula.create(String(studentId), input, {
      getAccessToken,
    })
  }

  async function patchCurriculum(
    studentId: number,
    curriculumId: number,
    input: Record<string, unknown>,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentCurricula.update(
      String(studentId),
      String(curriculumId),
      input as updateStudentCurriculaInput['body'],
      { getAccessToken },
    )
  }

  async function deleteCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.studentCurricula.delete(
      String(studentId),
      String(curriculumId),
      {
        getAccessToken,
      },
    )
  }

  return {
    listCurricula,
    getCurriculum,
    createCurriculum,
    patchCurriculum,
    deleteCurriculum,
  }
}
