import { appApiPublicRequest, appApiRequest } from './api/client'
import { expectApiResponse } from './api/errors'

export type Category = Readonly<{ id: number; name: string }>

export type Tag = Readonly<{
  id: number
  name: string
  categoryId: number
  parentTagId: number | null
}>

export type RelatedCourse = Readonly<{
  id: number
  code: string
  name: string
  credits: number
}>

export type TagInput = Readonly<{
  name: string
  categoryId: number
  parentTagId: number | null
}>

type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>

async function publicJson<T>(path: string) {
  const response = await appApiPublicRequest(path)
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

async function authenticatedJson<T>(
  path: string,
  getAccessToken: () => Promise<string>,
  init: RequestInit = {},
) {
  const response = await appApiRequest(path, getAccessToken, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  await expectApiResponse(response)
  return response.json() as Promise<T>
}

async function authenticatedNoContent(
  path: string,
  getAccessToken: () => Promise<string>,
) {
  const response = await appApiRequest(path, getAccessToken, {
    method: 'DELETE',
  })
  await expectApiResponse(response)
}

async function listAllPages<T>(initialPath: string): Promise<Array<T>> {
  const items: Array<T> = []
  let path: string | null = initialPath
  while (path) {
    const page: ApiPage<T> = await publicJson<ApiPage<T>>(path)
    items.push(...page.data)
    path = page._paths?.next ?? null
  }
  return items
}

export function listCategories() {
  return publicJson<ReadonlyArray<Category>>('/categories')
}

export function listTags() {
  return publicJson<ReadonlyArray<Tag>>('/tags')
}

export function listRelatedCourses(tagId: number) {
  return listAllPages<RelatedCourse>(
    `/tags/${tagId}/courses?page=1&pageSize=100`,
  )
}

export function createCategory(
  name: string,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedJson<Category>('/categories', getAccessToken, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export function updateCategory(
  categoryId: number,
  name: string,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedJson<Category>(
    `/categories/${categoryId}`,
    getAccessToken,
    { method: 'PUT', body: JSON.stringify({ name }) },
  )
}

export function deleteCategory(
  categoryId: number,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedNoContent(`/categories/${categoryId}`, getAccessToken)
}

export function createTag(
  input: TagInput,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedJson<Tag>('/tags', getAccessToken, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateTag(
  tagId: number,
  input: TagInput,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedJson<Tag>(`/tags/${tagId}`, getAccessToken, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteTag(
  tagId: number,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedNoContent(`/tags/${tagId}`, getAccessToken)
}
