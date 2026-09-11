import type {
  createStudentCurriculaInput,
  getStudentCurriculaOutput,
  listStudentCurriculaOutput,
  updateStudentCurriculaInput,
} from './generated/app/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type CurriculumApiEntity = Readonly<getStudentCurriculaOutput>
export type CurriculumSummaryApiEntity = Readonly<
  listStudentCurriculaOutput[number]
>
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
    return client.app.listStudentCurricula(
      { sid: String(studentId) },
      { getAccessToken },
    )
  }

  async function getCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.getStudentCurricula(
      { sid: String(studentId), id: String(curriculumId) },
      { getAccessToken },
    )
  }

  async function createCurriculum(
    studentId: number,
    input: CurriculumCreateInput,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.createStudentCurricula(
      { sid: String(studentId), body: input },
      { getAccessToken },
    )
  }

  async function patchCurriculum(
    studentId: number,
    curriculumId: number,
    input: Record<string, unknown>,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.updateStudentCurricula(
      {
        sid: String(studentId),
        id: String(curriculumId),
        body: input as updateStudentCurriculaInput['body'],
      },
      { getAccessToken },
    )
  }

  async function deleteCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.deleteStudentCurricula(
      { sid: String(studentId), id: String(curriculumId) },
      { getAccessToken },
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
