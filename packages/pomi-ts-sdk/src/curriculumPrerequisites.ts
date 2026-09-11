import { collectPages } from './generatedPagination.js'
import type {
  listCatalogCoursesOutput,
  listCatalogsOutput,
} from './generated/data/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type CurriculumApiCatalog = Readonly<listCatalogsOutput[number]>
export type CurriculumApiCatalogCourse = Readonly<
  listCatalogCoursesOutput['data'][number]
>
export type CurriculumApiPrerequisiteItem =
  CurriculumApiCatalogCourse['prerequisites']['any'][number]['all'][number]

export function createCurriculumPrerequisitesApi(client: PomiSdkClient) {
  function listCatalogs(year: number) {
    return client.data.listCatalogs({ filter: { year } })
  }

  function listCatalogCourses(catalogId: number) {
    return collectPages(
      client,
      'data',
      client.data.listCatalogCourses({
        page: 1,
        pageSize: 1000,
        filter: { catalogId },
      }),
    )
  }

  return { listCatalogs, listCatalogCourses }
}
