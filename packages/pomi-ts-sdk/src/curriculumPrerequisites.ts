import type { Catalog, CatalogCourse } from './generated/data/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type CurriculumApiCatalog = Catalog
export type CurriculumApiCatalogCourse = CatalogCourse
export type CurriculumApiPrerequisiteItem =
  CurriculumApiCatalogCourse['prerequisites']['any'][number]['all'][number]

export function createCurriculumPrerequisitesApi(client: PomiSdkClient) {
  function listCatalogs(year: number) {
    return client.data.catalogs.list({ filter: { year } })
  }

  function listCatalogCourses(catalogId: number) {
    return client.data.catalogCourses.listAll({
      page: 1,
      pageSize: 1000,
      filter: { catalogId },
    })
  }

  return { listCatalogs, listCatalogCourses }
}
