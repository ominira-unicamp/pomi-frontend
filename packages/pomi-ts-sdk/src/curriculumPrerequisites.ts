import { dataApi } from './endpoint'
import { collectPages } from './pagination'
import type { PomiClient } from './client'

export type CurriculumApiCatalog = Readonly<{ id: number; year: number }>
export type CurriculumApiPrerequisiteItem = Readonly<{
  code: string
  kind: 'FULL' | 'PARTIAL' | 'SPECIAL'
  courseId: number | null
}>
export type CurriculumApiCatalogCourse = Readonly<{
  courseId: number
  prerequisites: Readonly<{
    any: ReadonlyArray<
      Readonly<{ all: ReadonlyArray<CurriculumApiPrerequisiteItem> }>
    >
  }>
}>

type PrerequisitePage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>

type CatalogYearInput = Readonly<{ year: number }>
type CatalogInput = Readonly<{ catalogId: number }>

const catalogInterface = dataApi.interface('/catalogs')
const catalogCourseInterface = dataApi.interface('/catalog-courses')
const listCatalogsEndpoint = catalogInterface.get<
  ReadonlyArray<CurriculumApiCatalog>,
  CatalogYearInput
>('', { query: ({ year }) => ({ year }) })

const listCatalogCoursesEndpoint = catalogCourseInterface.get<
  PrerequisitePage<CurriculumApiCatalogCourse>,
  CatalogInput
>('', {
  query: ({ catalogId }) => ({ catalogId, page: 1, pageSize: 1000 }),
})

export function createCurriculumPrerequisitesApi(client: PomiClient) {
  const api = client.bind({
    listCatalogs: listCatalogsEndpoint,
    listCatalogCourses: listCatalogCoursesEndpoint,
  })
  function listCatalogs(year: number) {
    return api.listCatalogs({ year })
  }

  function listCatalogCourses(catalogId: number) {
    return collectPages(client, 'data', api.listCatalogCourses({ catalogId }))
  }

  return { listCatalogs, listCatalogCourses }
}
