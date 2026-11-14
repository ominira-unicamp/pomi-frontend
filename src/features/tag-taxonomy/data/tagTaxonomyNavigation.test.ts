import { describe, expect, it } from 'vitest'
import {
  normalizeTagSearch,
  readTaxonomySearch,
  tagPath,
} from './tagTaxonomyNavigation'

describe('taxonomy navigation', () => {
  it('retains valid URL filters and rejects invalid category identifiers', () => {
    expect(
      readTaxonomySearch({ q: 'álgebra', categoryId: '2', interests: 'true' }),
    ).toEqual({ q: 'álgebra', categoryId: 2, interests: true })
    expect(
      readTaxonomySearch({ categoryId: '-1', interests: 'false' }),
    ).toEqual({ q: undefined, categoryId: undefined, interests: undefined })
  })
  it('normalizes accents and case for search', () => {
    expect(normalizeTagSearch(' ÁLGEBRA ')).toBe('algebra')
  })
  it('terminates a path even when an existing hierarchy contains a cycle', () => {
    const tags = [
      { id: 1, name: 'A', categoryId: 1, parentTagId: 2 },
      { id: 2, name: 'B', categoryId: 1, parentTagId: 1 },
    ]
    expect(tagPath(tags[0], tags)).toBe('B › A')
  })
})
