import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  clearDraftHandoff,
  loadDraftHandoff,
  readDraftHandoff,
  saveDraftHandoff,
} from './planningDraftHandoff'

describe('planning draft handoff', () => {
  afterEach(() => {
    clearDraftHandoff()
  })

  it('keeps a curriculum draft available until it is cleared', () => {
    saveDraftHandoff({
      version: 1,
      kind: 'curriculum',
      name: 'Alternativa principal',
      state: {
        revision: 'draft' as never,
        selection: {},
        plan: { periods: [], unallocatedCourseIds: [] },
        academicRecord: { completedCourses: [] },
      },
    })

    expect(loadDraftHandoff()).toMatchObject({
      kind: 'curriculum',
      name: 'Alternativa principal',
    })

    clearDraftHandoff()
    expect(loadDraftHandoff()).toBeUndefined()
  })

  it('ignores an invalid serialized handoff', () => {
    window.sessionStorage.setItem('pomi:planning-draft-handoff:v1', '{')

    expect(loadDraftHandoff()).toBeUndefined()
  })
})

it('preserves malformed nested legacy drafts for recovery', () => {
  const raw = JSON.stringify({
    version: 1,
    kind: 'curriculum',
    name: 'Meu plano',
    state: { revision: '1' },
  })
  window.sessionStorage.setItem('pomi:planning-draft-handoff:v1', raw)
  expect(loadDraftHandoff()).toBeUndefined()
  expect(window.sessionStorage.getItem('pomi:planning-draft-handoff:v1')).toBe(
    raw,
  )
})

it('reads an unchanged v1 semester draft after an application upgrade', () => {
  const legacy = {
    version: 1,
    kind: 'semester',
    document: {
      name: 'Plano anterior',
      studyPeriodId: 4,
      curriculumId: null,
      classIds: [9],
      guide: {
        mode: 'none',
        curriculum: {
          source: null,
          curriculumId: null,
          suggestionId: null,
          suggestionCatalogProgramId: null,
        },
        program: {
          catalogProgramId: null,
          catalogProgramVariantId: null,
          languageId: null,
        },
        manualCourseIds: [],
      },
    },
  }
  const raw = JSON.stringify(legacy)
  window.sessionStorage.setItem('pomi:planning-draft-handoff:v1', raw)
  expect(loadDraftHandoff()).toEqual(legacy)
  expect(window.sessionStorage.getItem('pomi:planning-draft-handoff:v1')).toBe(
    raw,
  )
})

it('reports unavailable storage without leaking a browser storage exception', () => {
  const getter = vi
    .spyOn(window, 'sessionStorage', 'get')
    .mockImplementation(() => {
      throw new Error('blocked')
    })
  try {
    expect(readDraftHandoff()).toEqual({ status: 'unavailable' })
    expect(loadDraftHandoff()).toBeUndefined()
  } finally {
    getter.mockRestore()
  }
})
