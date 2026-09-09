import { expectApiResponse } from './errors'
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

type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>

async function getJson<T>(client: PomiClient, path: string): Promise<T> {
  const response = await client.dataApiRequest(path)
  await expectApiResponse(response)
  return (await response.json()) as T
}

async function listAllPages<T>(client: PomiClient, path: string) {
  const items: Array<T> = []
  let next: string | null = path
  while (next) {
    const page: ApiPage<T> = await getJson<ApiPage<T>>(client, next)
    items.push(...page.data)
    next = page._paths?.next ?? null
  }
  return items
}

export function createCurriculumPrerequisitesApi(client: PomiClient) {
  function listCatalogs(year: number) {
    return getJson<ReadonlyArray<CurriculumApiCatalog>>(
      client,
      `/catalogs?year=${year}`,
    )
  }

  function listCatalogCourses(catalogId: number) {
    return listAllPages<CurriculumApiCatalogCourse>(
      client,
      `/catalog-courses?catalogId=${catalogId}&page=1&pageSize=1000`,
    )
  }

  return { listCatalogs, listCatalogCourses }
}
