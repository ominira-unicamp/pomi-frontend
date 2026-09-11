import { collectPages } from './generatedPagination.js'
import type {
  createCategoriesInput,
  createTagsInput,
  listCategoriesOutput,
  listTagsCoursesOutput,
  listTagsOutput,
  updateCategoriesInput,
  updateTagsInput,
} from './generated/app/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type Category = Readonly<listCategoriesOutput[number]>
export type Tag = Readonly<listTagsOutput[number]>
export type RelatedCourse = Readonly<listTagsCoursesOutput['data'][number]>

export type TagInput = Readonly<createTagsInput['body']>

export function createTagTaxonomyApi(client: PomiSdkClient) {
  function listCategories() {
    return client.app.listCategories({})
  }

  function listTags() {
    return client.app.listTags({})
  }

  function listRelatedCourses(tagId: number) {
    return collectPages(
      client,
      'app',
      client.app.listTagsCourses({ id: tagId, page: 1, pageSize: 100 }),
    )
  }

  function createCategory(name: string, getAccessToken: () => Promise<string>) {
    const input: createCategoriesInput = { body: { name } }
    return client.app.createCategories(input, { getAccessToken })
  }

  function updateCategory(
    categoryId: number,
    name: string,
    getAccessToken: () => Promise<string>,
  ) {
    const input: updateCategoriesInput = { id: categoryId, body: { name } }
    return client.app.updateCategories(input, { getAccessToken })
  }

  function deleteCategory(
    categoryId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.deleteCategories({ id: categoryId }, { getAccessToken })
  }

  function createTag(input: TagInput, getAccessToken: () => Promise<string>) {
    const request: createTagsInput = { body: input }
    return client.app.createTags(request, { getAccessToken })
  }

  function updateTag(
    tagId: number,
    input: TagInput,
    getAccessToken: () => Promise<string>,
  ) {
    const request: updateTagsInput = { id: tagId, body: input }
    return client.app.updateTags(request, { getAccessToken })
  }

  function deleteTag(tagId: number, getAccessToken: () => Promise<string>) {
    return client.app.deleteTags({ id: tagId }, { getAccessToken })
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
