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
    return client.app.studentCurricula.list(studentId, {}, { getAccessToken })
  }

  async function getCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentCurricula.get(studentId, curriculumId, {
      getAccessToken,
    })
  }

  async function createCurriculum(
    studentId: number,
    input: CurriculumCreateInput,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentCurricula.create(studentId, input, {
      getAccessToken,
    })
  }

  async function patchCurriculum(
    studentId: number,
    curriculumId: number,
    input: updateStudentCurriculaInput['body'],
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentCurricula.update(studentId, curriculumId, input, {
      getAccessToken,
    })
  }

  async function deleteCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.studentCurricula.delete(studentId, curriculumId, {
      getAccessToken,
    })
  }

  return {
    listCurricula,
    getCurriculum,
    createCurriculum,
    patchCurriculum,
    deleteCurriculum,
  }
}
