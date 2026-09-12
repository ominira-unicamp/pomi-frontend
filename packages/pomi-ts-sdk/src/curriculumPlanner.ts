import type {
  BlockSet,
  CatalogProgram,
  CatalogProgramLanguage,
  CatalogProgramModality,
  Course,
  CourseRequirement,
} from './generated/data/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type CurriculumApiCourseRequirement = Pick<
  CourseRequirement,
  'type' | 'courseId' | 'prefix'
>
export type CurriculumApiBlockSet = {
  mandatory: ReadonlyArray<CurriculumApiCourseRequirement>
  electives: ReadonlyArray<{
    credits: BlockSet['electives'][number]['credits']
    courses: ReadonlyArray<CurriculumApiCourseRequirement>
  }>
}
export type CurriculumApiCatalogProgram = Pick<
  CatalogProgram,
  | 'id'
  | 'title'
  | 'catalogId'
  | 'catalogYear'
  | 'programId'
  | 'programCode'
  | 'programName'
> & {
  base: CurriculumApiBlockSet
  modalities: ReadonlyArray<
    Pick<CatalogProgramModality, 'specializationId' | 'code' | 'name'> & {
      blocks: CurriculumApiBlockSet
    }
  >
  languages: ReadonlyArray<
    Pick<CatalogProgramLanguage, 'languageId' | 'name'> & {
      blocks: CurriculumApiBlockSet
    }
  >
}
export type CurriculumApiCourse = Pick<
  Course,
  'id' | 'code' | 'name' | 'credits'
> & { prefix?: Course['prefix'] }
export type CurriculumApiCoursesPage = Readonly<{
  data: ReadonlyArray<CurriculumApiCourse>
  _paths: Readonly<{ next: string | null }>
}>

export function createCurriculumPlannerApi(client: PomiSdkClient) {
  function listCatalogPrograms() {
    return client.data.catalogProgram.list({})
  }

  async function listCourses(): Promise<CurriculumApiCoursesPage> {
    const data = await client.data.courses.listAll({})
    return { data, _paths: { next: null } }
  }

  return { listCatalogPrograms, listCourses }
}
