import { dataApi } from './endpoint'
import type { PomiClient } from './client'

export type CurriculumApiCourseRequirement = Readonly<{
  type: 'any' | 'prefix' | 'specific'
  courseId: number | null
  prefix: string | null
}>

export type CurriculumApiBlockSet = Readonly<{
  mandatory: ReadonlyArray<CurriculumApiCourseRequirement>
  electives: ReadonlyArray<
    Readonly<{
      credits: number
      courses: ReadonlyArray<CurriculumApiCourseRequirement>
    }>
  >
}>

export type CurriculumApiCatalogProgram = Readonly<{
  id: number
  title: string
  catalogId: number
  catalogYear: number
  programId: number
  programCode: number
  programName: string
  base: CurriculumApiBlockSet
  modalities: ReadonlyArray<
    Readonly<{
      specializationId: number
      code: string
      name: string
      blocks: CurriculumApiBlockSet
    }>
  >
  languages: ReadonlyArray<
    Readonly<{
      languageId: number
      name: string
      blocks: CurriculumApiBlockSet
    }>
  >
}>

export type CurriculumApiCourse = Readonly<{
  id: number
  code: string
  name: string
  credits: number
  prefix?: string
}>

export type CurriculumApiCoursesPage = Readonly<{
  data: ReadonlyArray<CurriculumApiCourse>
  _paths: Readonly<{ next: string | null }>
}>

const catalogProgramInterface = dataApi.interface('/catalog-program')
const courseInterface = dataApi.interface('/courses')
const listCatalogProgramsEndpoint =
  catalogProgramInterface.get<ReadonlyArray<CurriculumApiCatalogProgram>>()

const listCoursesEndpoint = courseInterface.get<CurriculumApiCoursesPage>()

export function createCurriculumPlannerApi(client: PomiClient) {
  const api = client.bind({
    listCatalogPrograms: listCatalogProgramsEndpoint,
    listCourses: listCoursesEndpoint,
  })
  function listCatalogPrograms() {
    return api.listCatalogPrograms({})
  }

  function listCourses() {
    return api.listCourses({})
  }

  return { listCatalogPrograms, listCourses }
}
