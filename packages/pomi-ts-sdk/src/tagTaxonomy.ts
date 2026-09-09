import { appApi } from './endpoint'
import { collectPages } from './pagination'
import type { PomiClient } from './client'

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

type TagPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>
type CategoryInput = Readonly<{ categoryId: number }>
type CategoryNameInput = Readonly<{ name: string }>
type UpdateCategoryInput = CategoryInput & CategoryNameInput
type TagIdInput = Readonly<{ tagId: number }>
type CreateTagInput = Readonly<{ input: TagInput }>
type UpdateTagInput = TagIdInput & CreateTagInput

const publicInterface = appApi.public.interface('')
const authenticatedInterface = appApi.authenticated.interface('')
const tagEndpoints = publicInterface.define({
  listCategories: publicInterface.get<ReadonlyArray<Category>>('/categories'),
  listTags: publicInterface.get<ReadonlyArray<Tag>>('/tags'),
  listRelatedCourses: publicInterface.get<TagPage<RelatedCourse>, TagIdInput>(
    '/tags/:tagId/courses',
    { query: () => ({ page: 1, pageSize: 100 }) },
  ),
  createCategory: authenticatedInterface.post<Category, CategoryNameInput>(
    '/categories',
    { body: ({ name }) => ({ name }) },
  ),
  updateCategory: authenticatedInterface.put<Category, UpdateCategoryInput>(
    '/categories/:categoryId',
    { body: ({ name }) => ({ name }) },
  ),
  deleteCategory: authenticatedInterface.remove<CategoryInput>(
    '/categories/:categoryId',
  ),
  createTag: authenticatedInterface.post<Tag, CreateTagInput>('/tags', {
    body: ({ input }) => input,
  }),
  updateTag: authenticatedInterface.put<Tag, UpdateTagInput>('/tags/:tagId', {
    body: ({ input }) => input,
  }),
  deleteTag: authenticatedInterface.remove<TagIdInput>('/tags/:tagId'),
})

export function createTagTaxonomyApi(client: PomiClient) {
  const api = client.bind(tagEndpoints)

  function listCategories() {
    return api.listCategories({})
  }

  function listTags() {
    return api.listTags({})
  }

  function listRelatedCourses(tagId: number) {
    return collectPages(client, 'app', api.listRelatedCourses({ tagId }))
  }

  function createCategory(name: string, getAccessToken: () => Promise<string>) {
    return api.createCategory({ name }, { getAccessToken })
  }

  function updateCategory(
    categoryId: number,
    name: string,
    getAccessToken: () => Promise<string>,
  ) {
    return api.updateCategory({ categoryId, name }, { getAccessToken })
  }

  function deleteCategory(
    categoryId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.deleteCategory({ categoryId }, { getAccessToken })
  }

  function createTag(input: TagInput, getAccessToken: () => Promise<string>) {
    return api.createTag({ input }, { getAccessToken })
  }

  function updateTag(
    tagId: number,
    input: TagInput,
    getAccessToken: () => Promise<string>,
  ) {
    return api.updateTag({ tagId, input }, { getAccessToken })
  }

  function deleteTag(tagId: number, getAccessToken: () => Promise<string>) {
    return api.deleteTag({ tagId }, { getAccessToken })
  }

  return {
    listCategories,
    listTags,
    listRelatedCourses,
    createCategory,
    updateCategory,
    deleteCategory,
    createTag,
    updateTag,
    deleteTag,
  }
}
