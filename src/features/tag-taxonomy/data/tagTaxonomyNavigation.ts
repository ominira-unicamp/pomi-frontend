import type { Tag } from './tagTaxonomyApi'

export type TaxonomySearch = {
  q?: string
  order?: 'asc' | 'desc'
  categoryId?: number
  interests?: boolean
}
export type TagDetailsSearch = TaxonomySearch & { page?: number }

export function readTaxonomySearch(
  search: Record<string, unknown>,
): TaxonomySearch {
  const categoryId = Number(search.categoryId)
  return {
    ...(search.order === 'asc' || search.order === 'desc'
      ? { order: search.order }
      : {}),
    q: typeof search.q === 'string' ? search.q : undefined,
    categoryId:
      Number.isSafeInteger(categoryId) && categoryId > 0
        ? categoryId
        : undefined,
    interests:
      search.interests === true || search.interests === 'true'
        ? true
        : undefined,
  }
}

export function normalizeTagSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
}

export function tagPath(tag: Tag, tags: ReadonlyArray<Tag>) {
  const names = [tag.name]
  const seen = new Set([tag.id])
  let parentId = tag.parentTagId
  while (parentId && !seen.has(parentId)) {
    seen.add(parentId)
    const parent = tags.find((item) => item.id === parentId)
    if (!parent) break
    names.unshift(parent.name)
    parentId = parent.parentTagId
  }
  return names.join(' › ')
}

export type TaxonomyManageSearch = TaxonomySearch & {
  tagId?: number
  selectedCategoryId?: number
  returnTo?: TagDetailsSearch
}

export function readTaxonomyManageSearch(
  search: Record<string, unknown>,
): TaxonomyManageSearch {
  const tagId = Number(search.tagId)
  const selectedCategoryId = Number(search.selectedCategoryId)
  const returnTo =
    search.returnTo &&
    typeof search.returnTo === 'object' &&
    !Array.isArray(search.returnTo)
      ? (search.returnTo as Record<string, unknown>)
      : undefined
  const page = Number(returnTo?.page)
  return {
    ...readTaxonomySearch(search),
    tagId: Number.isSafeInteger(tagId) && tagId > 0 ? tagId : undefined,
    selectedCategoryId:
      Number.isSafeInteger(selectedCategoryId) && selectedCategoryId > 0
        ? selectedCategoryId
        : undefined,
    returnTo: returnTo
      ? {
          ...readTaxonomySearch(returnTo),
          page: Number.isSafeInteger(page) && page > 0 ? page : undefined,
        }
      : undefined,
  }
}

export function tagAncestors(tag: Tag, tags: ReadonlyArray<Tag>) {
  const ancestors: Array<Tag> = []
  const seen = new Set([tag.id])
  let parentId = tag.parentTagId
  while (parentId && !seen.has(parentId)) {
    seen.add(parentId)
    const parent = tags.find((candidate) => candidate.id === parentId)
    if (!parent) break
    ancestors.unshift(parent)
    parentId = parent.parentTagId
  }
  return ancestors
}
