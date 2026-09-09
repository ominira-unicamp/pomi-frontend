import { expectApiResponse } from './errors'
import type { PomiClient } from './client'

export type CurriculumApiSelection = Readonly<{
  catalogProgramId: number | null
  specializationId: number | null
  languageId: number | null
}>

export type CurriculumApiPlanningStart = Readonly<{
  year: number
  semester: 1 | 2
  semesterNumber: number
}> | null

export type CurriculumApiEntity = Readonly<{
  id: number
  studentId: number
  name: string
  isFavorite: boolean
  selection: CurriculumApiSelection
  planningStart: CurriculumApiPlanningStart
  currentPeriodId: number | null
  periods: ReadonlyArray<{ id: number; position: number }>
  courses: ReadonlyArray<{
    courseId: number
    periodId: number | null
    code: string
    name: string
    credits: number
  }>
  createdAt: string
  updatedAt: string
}>

export type CurriculumSummaryApiEntity = Readonly<{
  id: number
  name: string
  isFavorite: boolean
  selection: CurriculumApiSelection
  createdAt: string
  updatedAt: string
}>

export type CurriculumCreateInput = Readonly<{
  name: string
  selection: CurriculumApiSelection
  planningStart: CurriculumApiPlanningStart
  currentPeriodId: number | null
  periods: ReadonlyArray<{ position: number }>
  courses: ReadonlyArray<{ courseId: number; periodId: number | null }>
}>

async function requestJson<T>(
  client: PomiClient,
  path: string,
  getAccessToken: () => Promise<string>,
  init?: RequestInit,
): Promise<T> {
  const response = await client.appApiRequest(path, getAccessToken, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  await expectApiResponse(response)
  return (await response.json()) as T
}

export function createCurriculumPersistenceApi(client: PomiClient) {
  async function listCurricula(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<ReadonlyArray<CurriculumSummaryApiEntity>>(
      client,
      `/student/${studentId}/curricula`,
      getAccessToken,
    )
  }

  async function getCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<CurriculumApiEntity>(
      client,
      `/student/${studentId}/curricula/${curriculumId}`,
      getAccessToken,
    )
  }

  async function createCurriculum(
    studentId: number,
    input: CurriculumCreateInput,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<CurriculumApiEntity>(
      client,
      `/student/${studentId}/curricula`,
      getAccessToken,
      { method: 'POST', body: JSON.stringify(input) },
    )
  }

  async function patchCurriculum(
    studentId: number,
    curriculumId: number,
    input: Record<string, unknown>,
    getAccessToken: () => Promise<string>,
  ) {
    return requestJson<CurriculumApiEntity>(
      client,
      `/student/${studentId}/curricula/${curriculumId}`,
      getAccessToken,
      { method: 'PATCH', body: JSON.stringify(input) },
    )
  }

  async function deleteCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    const response = await client.appApiRequest(
      `/student/${studentId}/curricula/${curriculumId}`,
      getAccessToken,
      { method: 'DELETE' },
    )
    await expectApiResponse(response)
  }

  return {
    listCurricula,
    getCurriculum,
    createCurriculum,
    patchCurriculum,
    deleteCurriculum,
  }
}
