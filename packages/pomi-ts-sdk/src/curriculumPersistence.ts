import { appApi } from './endpoint'
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

type StudentInput = Readonly<{ studentId: number }>
type CurriculumInput = StudentInput & Readonly<{ curriculumId: number }>
type CreateCurriculumEndpointInput = StudentInput &
  Readonly<{ input: CurriculumCreateInput }>
type PatchCurriculumEndpointInput = CurriculumInput &
  Readonly<{ input: Record<string, unknown> }>

const curriculaInterface = appApi.authenticated.interface(
  '/student/:studentId/curricula',
)
const curriculaEndpoints = curriculaInterface.define({
  list: curriculaInterface.get<
    ReadonlyArray<CurriculumSummaryApiEntity>,
    StudentInput
  >(),
  get: curriculaInterface.get<CurriculumApiEntity, CurriculumInput>(
    '/:curriculumId',
  ),
  create: curriculaInterface.post<
    CurriculumApiEntity,
    CreateCurriculumEndpointInput
  >('', { body: ({ input }) => input }),
  patch: curriculaInterface.patch<
    CurriculumApiEntity,
    PatchCurriculumEndpointInput
  >('/:curriculumId', { body: ({ input }) => input }),
  remove: curriculaInterface.remove<CurriculumInput>('/:curriculumId'),
})

export function createCurriculumPersistenceApi(client: PomiClient) {
  const api = client.bind(curriculaEndpoints)

  async function listCurricula(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.list({ studentId }, { getAccessToken })
  }

  async function getCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.get({ studentId, curriculumId }, { getAccessToken })
  }

  async function createCurriculum(
    studentId: number,
    input: CurriculumCreateInput,
    getAccessToken: () => Promise<string>,
  ) {
    return api.create({ studentId, input }, { getAccessToken })
  }

  async function patchCurriculum(
    studentId: number,
    curriculumId: number,
    input: Record<string, unknown>,
    getAccessToken: () => Promise<string>,
  ) {
    return api.patch({ studentId, curriculumId, input }, { getAccessToken })
  }

  async function deleteCurriculum(
    studentId: number,
    curriculumId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await api.remove({ studentId, curriculumId }, { getAccessToken })
  }

  return {
    listCurricula,
    getCurriculum,
    createCurriculum,
    patchCurriculum,
    deleteCurriculum,
  }
}
