import { afterEach, describe, expect, it } from 'vitest'

import {
  clearDraftHandoff,
  loadDraftHandoff,
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
