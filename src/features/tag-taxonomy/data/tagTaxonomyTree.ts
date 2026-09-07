import type { Tag } from './tagTaxonomyApi'

export type TagTreeNode = Tag & {
  children: ReadonlyArray<TagTreeNode>
}

export function buildTagTree(tags: ReadonlyArray<Tag>, categoryId: number) {
  const categoryTags = tags
    .filter((tag) => tag.categoryId === categoryId)
    .sort(compareTags)
  const nodes = new Map<number, TagTreeNode>()

  for (const tag of categoryTags) nodes.set(tag.id, { ...tag, children: [] })

  const roots: Array<TagTreeNode> = []
  for (const tag of categoryTags) {
    const node = nodes.get(tag.id)
    if (!node) continue
    const parent = tag.parentTagId ? nodes.get(tag.parentTagId) : undefined
    if (parent) {
      ;(parent.children as Array<TagTreeNode>).push(node)
    } else {
      roots.push(node)
    }
  }

  return sortTree(roots)
}

export function filterTagTree(
  nodes: ReadonlyArray<TagTreeNode>,
  search: string,
): ReadonlyArray<TagTreeNode> {
  const normalized = search.trim().toLocaleLowerCase('pt-BR')
  if (!normalized) return nodes

  return nodes.flatMap((node) => {
    const children: ReadonlyArray<TagTreeNode> = filterTagTree(
      node.children,
      normalized,
    )
    const matches = node.name.toLocaleLowerCase('pt-BR').includes(normalized)
    return matches || children.length > 0 ? [{ ...node, children }] : []
  })
}

export function collectDescendantTagIds(
  nodes: ReadonlyArray<TagTreeNode>,
  tagId: number,
) {
  const descendants = new Set<number>()
  const collect = (items: ReadonlyArray<TagTreeNode>) => {
    for (const item of items) {
      descendants.add(item.id)
      collect(item.children)
    }
  }
  const visit = (items: ReadonlyArray<TagTreeNode>): boolean => {
    for (const node of items) {
      if (node.id === tagId) {
        collect(node.children)
        return true
      }
      if (visit(node.children)) return true
    }
    return false
  }
  visit(nodes)
  return descendants
}

function compareTags(left: Tag, right: Tag) {
  return left.name.localeCompare(right.name, 'pt-BR')
}

function sortTree(nodes: ReadonlyArray<TagTreeNode>): Array<TagTreeNode> {
  return [...nodes]
    .sort(compareTags)
    .map((node) => ({ ...node, children: sortTree(node.children) }))
}
