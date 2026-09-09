import { expectApiResponse } from './errors'
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

async function getJson<T>(client: PomiClient, path: string): Promise<T> {
  const response = await client.dataApiRequest(path)
  await expectApiResponse(response)
  return (await response.json()) as T
}

export function createCurriculumPlannerApi(client: PomiClient) {
  function listCatalogPrograms() {
    return getJson<ReadonlyArray<CurriculumApiCatalogProgram>>(
      client,
      '/catalog-program',
    )
  }

  function listCourses() {
    return getJson<CurriculumApiCoursesPage>(client, '/courses')
  }

  return { listCatalogPrograms, listCourses }
}
