import assert from 'node:assert/strict'
import test from 'node:test'
import { buildQuery } from './runtime/query.js'

test('serializes nested filters with bracket notation', () => {
  const query = buildQuery(
    {
      page: 1,
      filter: {
        credits: { gte: 4 },
        unit: { code: 'IC' },
      },
    },
    ['page', 'filter'],
  )

  const parsed = new URLSearchParams(query)
  assert.equal(parsed.get('page'), '1')
  assert.equal(parsed.get('filter[credits][gte]'), '4')
  assert.equal(parsed.get('filter[unit][code]'), 'IC')
})

test('preserves zero, false and repeated array values', () => {
  const query = buildQuery(
    {
      zero: 0,
      enabled: false,
      filter: { id: { in: [2, 3] } },
    },
    ['zero', 'enabled', 'filter'],
  )

  const parsed = new URLSearchParams(query)
  assert.equal(parsed.get('zero'), '0')
  assert.equal(parsed.get('enabled'), 'false')
  assert.deepEqual(parsed.getAll('filter[id][in]'), ['2', '3'])
})
