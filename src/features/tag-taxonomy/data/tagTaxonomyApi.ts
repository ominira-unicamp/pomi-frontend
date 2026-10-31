import type {
  Category,
  Tag,
  TagRelatedCourse,
  createTagInput,
} from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

export type { Category, Tag, TagRelatedCourse as RelatedCourse }
export type TagInput = Readonly<createTagInput['body']>

type GetAccessToken = () => Promise<string>

export const listCategories = () => pomiSdk.app.categories.listAll({})
export const listTags = () => pomiSdk.app.tags.listAll({})
export const listRelatedCourses = (tagId: number) =>
  pomiSdk.app.courseTags.listCoursesForTagAll(tagId, {
    page: 1,
    pageSize: 100,
  })
export const createCategory = (name: string, getAccessToken: GetAccessToken) =>
  pomiSdk.app.categories.create({ name }, { getAccessToken })
export const updateCategory = (
  categoryId: number,
  name: string,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.categories.update(categoryId, { name }, { getAccessToken })
export const deleteCategory = (
  categoryId: number,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.categories.delete(categoryId, { getAccessToken })
export const createTag = (input: TagInput, getAccessToken: GetAccessToken) =>
  pomiSdk.app.tags.create(input, { getAccessToken })
export const updateTag = (
  tagId: number,
  input: TagInput,
  getAccessToken: GetAccessToken,
) => pomiSdk.app.tags.update(tagId, input, { getAccessToken })
export const deleteTag = (tagId: number, getAccessToken: GetAccessToken) =>
  pomiSdk.app.tags.delete(tagId, { getAccessToken })
