import { pomiApi } from '@/api/client'

export type {
  Category,
  RelatedCourse,
  Tag,
  TagInput,
} from '@pomi/pomi-ts-sdk/tag-taxonomy'

export const {
  listCategories,
  listTags,
  listRelatedCourses,
  createCategory,
  updateCategory,
  deleteCategory,
  createTag,
  updateTag,
  deleteTag,
} = pomiApi.tagTaxonomy
