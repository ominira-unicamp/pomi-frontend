import { describe, expect, it } from 'vitest'

import {
  buildTagTree,
  collectDescendantTagIds,
  filterTagTree,
} from './tagTaxonomyTree'

const tags = [
  { id: 2, name: 'Álgebra', categoryId: 1, parentTagId: null },
  { id: 3, name: 'Linear', categoryId: 1, parentTagId: 2 },
  { id: 4, name: 'Matrizes', categoryId: 1, parentTagId: 3 },
  { id: 5, name: 'Literatura', categoryId: 2, parentTagId: null },
]

describe('tag taxonomy tree', () => {
  it('builds a sorted hierarchy for one category', () => {
    const tree = buildTagTree(tags, 1)

    expect(tree).toHaveLength(1)
    expect(tree[0]?.name).toBe('Álgebra')
    expect(tree[0]?.children[0]?.children[0]?.name).toBe('Matrizes')
  })

  it('keeps ancestors when filtering by a nested tag', () => {
    const tree = filterTagTree(buildTagTree(tags, 1), 'matriz')

    expect(tree.map((node) => node.name)).toEqual(['Álgebra'])
    expect(tree[0]?.children[0]?.children[0]?.name).toBe('Matrizes')
  })

  it('returns descendants that cannot become a parent', () => {
    const tree = buildTagTree(tags, 1)

    expect([...collectDescendantTagIds(tree, 2)]).toEqual([3, 4])
  })
})
