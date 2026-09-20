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

test('serializes structured sorting as one ordered wire parameter', () => {
  const query = buildQuery(
    {
      page: 2,
      pageSize: 20,
      filter: { unit: { code: 'IC' } },
      sort: [
        { field: 'credits', direction: 'desc' },
        { field: 'code', direction: 'asc' },
      ],
    },
    ['page', 'pageSize', 'filter', 'sort'],
  )

  const parsed = new URLSearchParams(query)
  assert.equal(parsed.get('sort'), 'credits:desc,code:asc')
  assert.equal(parsed.get('filter[unit][code]'), 'IC')
  assert.equal(parsed.get('page'), '2')
})

test('rejects empty, malformed and duplicate structured sorting', () => {
  for (const sort of [
    [],
    [{ field: 'code', direction: 'up' }],
    [
      { field: 'code', direction: 'asc' },
      { field: 'code', direction: 'desc' },
    ],
  ]) {
    assert.throws(() => buildQuery({ sort }, ['sort']), TypeError)
  }
})
