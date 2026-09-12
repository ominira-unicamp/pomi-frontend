import type { createTagsInput } from './generated/app/operations.js'
import type {
  Category as GeneratedCategory,
  Tag as GeneratedTag,
  TagRelatedCourse as GeneratedRelatedCourse,
} from './generated/app/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type Category = GeneratedCategory
export type Tag = GeneratedTag
export type RelatedCourse = GeneratedRelatedCourse

export type TagInput = Readonly<createTagsInput['body']>

export function createTagTaxonomyApi(client: PomiSdkClient) {
  function listCategories() {
    return client.app.categories.list({})
  }

  function listTags() {
    return client.app.tags.list({})
  }

  function listRelatedCourses(tagId: number) {
    return client.app.tagsCourses.listAll(tagId, { page: 1, pageSize: 100 })
  }

  function createCategory(name: string, getAccessToken: () => Promise<string>) {
    return client.app.categories.create({ name }, { getAccessToken })
  }

  function updateCategory(
    categoryId: number,
    name: string,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.categories.update(
      categoryId,
      { name },
      { getAccessToken },
    )
  }

  function deleteCategory(
    categoryId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.categories.delete(categoryId, { getAccessToken })
  }

  function createTag(input: TagInput, getAccessToken: () => Promise<string>) {
    return client.app.tags.create(input, { getAccessToken })
  }

  function updateTag(
    tagId: number,
    input: TagInput,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.tags.update(tagId, input, { getAccessToken })
  }

  function deleteTag(tagId: number, getAccessToken: () => Promise<string>) {
    return client.app.tags.delete(tagId, { getAccessToken })
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
