import { afterEach, describe, expect, it, vi } from 'vitest'

import { loadCurriculumSuggestions } from './curriculumSuggestionApi'
import type { CatalogProgramId } from '@pomi/planner-domain/curriculum'

describe('loadCurriculumSuggestions', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads public suggestions for one catalog program', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json([
        {
          id: 7,
          catalogProgramId: 3,
          code: 'GERAL',
          name: 'Sugestão geral',
          type: 'GENERAL',
          specialization: null,
          semesters: [
            {
              semester: 1,
              electiveCredits: 0,
              courses: [
                { id: 9, code: 'AB100', name: 'Algoritmos', credits: 4 },
              ],
            },
          ],
        },
      ]),
    )
    vi.stubGlobal('fetch', fetchMock)

    const suggestions = await loadCurriculumSuggestions('3' as CatalogProgramId)

    expect(suggestions[0]).toMatchObject({
      id: '7',
      catalogProgramId: '3',
      type: 'GENERAL',
      semesters: [{ courses: [{ id: '9' }] }],
    })
    const [request] = fetchMock.mock.calls[0] as [string]
    const url = new URL(request)
    expect(url.pathname).toBe('/curriculum-suggestions')
    expect(url.searchParams.get('catalogProgramId')).toBe('3')
  })
})
