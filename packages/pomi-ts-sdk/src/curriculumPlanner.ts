import type {
  listCatalogProgramOutput,
  listCoursesOutput,
} from './generated/data/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

type GeneratedCatalogProgram = listCatalogProgramOutput[number]
type GeneratedBlockSet = GeneratedCatalogProgram['base']
type GeneratedRequirement = GeneratedBlockSet['mandatory'][number]
type GeneratedModality = GeneratedCatalogProgram['modalities'][number]
type GeneratedLanguage = GeneratedCatalogProgram['languages'][number]
export type CurriculumApiCourseRequirement = Readonly<
  Pick<GeneratedRequirement, 'type' | 'courseId' | 'prefix'>
>
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
  id: GeneratedCatalogProgram['id']
  title: GeneratedCatalogProgram['title']
  catalogId: GeneratedCatalogProgram['catalogId']
  catalogYear: GeneratedCatalogProgram['catalogYear']
  programId: GeneratedCatalogProgram['programId']
  programCode: GeneratedCatalogProgram['programCode']
  programName: GeneratedCatalogProgram['programName']
  base: CurriculumApiBlockSet
  modalities: ReadonlyArray<
    Readonly<{
      specializationId: GeneratedModality['specializationId']
      code: GeneratedModality['code']
      name: GeneratedModality['name']
      blocks: CurriculumApiBlockSet
    }>
  >
  languages: ReadonlyArray<
    Readonly<{
      languageId: GeneratedLanguage['languageId']
      name: GeneratedLanguage['name']
      blocks: CurriculumApiBlockSet
    }>
  >
}>
export type CurriculumApiCourse = Readonly<
  Pick<
    listCoursesOutput['data'][number],
    'id' | 'code' | 'name' | 'credits'
  > & {
    prefix?: string
  }
>
export type CurriculumApiCoursesPage = Readonly<{
  data: ReadonlyArray<CurriculumApiCourse>
  _paths: Readonly<{ next: string | null }>
}>

export function createCurriculumPlannerApi(client: PomiSdkClient) {
  function listCatalogPrograms() {
    return client.data.listCatalogProgram({})
  }

  function listCourses() {
    return client.data.listCourses({
      page: 1,
      pageSize: 1000,
    }) as Promise<CurriculumApiCoursesPage>
  }

  return { listCatalogPrograms, listCourses }
}
