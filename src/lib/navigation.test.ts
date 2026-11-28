import { describe, expect, it } from 'vitest'
import { navigationHref, readExchangeSearch, readManagedEventsSearch, readPeopleSearch, readReturnTo, readSituationSearch } from '@/lib/navigation'

describe('navigation state', () => {
  it('keeps explicit academic selections and drops unsupported values', () => {
    expect(
      readSituationSearch({
        tab: 'curriculum',
        studyPeriodId: '12',
        curriculumTab: 'dependencies',
        dependencyCourseId: 42,
        hideCompleted: 'true',
      }),
    ).toEqual({
      tab: 'curriculum',
      studyPeriodId: 12,
      curriculumTab: 'dependencies',
      dependencyCourseId: 42,
      hideCompleted: true,
    })
    expect(
      readSituationSearch({
        tab: 'enrolled',
        studyPeriodId: -1,
        curriculumTab: 'full',
        hideCompleted: 'false',
      }),
    ).toEqual({
      tab: undefined,
      studyPeriodId: undefined,
      curriculumTab: undefined,
      dependencyCourseId: undefined,
      hideCompleted: undefined,
    })
    expect(readPeopleSearch({ q: 'João', token: 'private' })).toEqual({
      q: 'João',
    })
    expect(readManagedEventsSearch({ status: 'PUBLISHED' })).toEqual({
      status: 'PUBLISHED',
    })
    expect(readManagedEventsSearch({ status: 'ALL' })).toEqual({
      status: undefined,
    })
  })

  it('round trips exchange filters and omits defaults and invalid dates', () => {
    const search = readExchangeSearch({
      search: 'França',
      issuers: ['DAC', 'DAC'],
      placeIds: [3, '4', -1, null],
      registrationStartAfter: '2026-02-30',
      registrationEndBefore: '2027-02-28',
      sortField: 'registrationStart',
      sortDirection: 'asc',
      page: 3,
    })
    const result = readReturnTo(
      navigationHref('/editais-de-intercambio', search),
    )!
    expect(result).toContain('page=3')
    expect(result).toContain('registrationEndBefore=2027-02-28')
    expect(result).not.toContain('registrationStartAfter')
    expect(search.placeIds).toEqual([3, 4])
    expect(search.issuers).toEqual(['DAC'])
    expect(
      readReturnTo(
        navigationHref(
          '/editais-de-intercambio',
          readExchangeSearch({
            sortField: 'registrationEnd',
            sortDirection: 'desc',
            page: 1,
          }),
        ),
      ),
    ).toBe('/editais-de-intercambio')
  })
})

describe('contextual return destinations', () => {
  it.each([
    'https://evil.test/',
    '//evil.test/',
    '/\\evil.test',
    '/%2f%2fevil.test',
    '/admin/feedbacks',
    '/disciplinas/42',
    '/grupos/0',
    '/planejamentos-de-curriculo/novo',
    '/pessoas\n',
  ])('rejects unsafe or unsupported origin %s', (origin) => {
    expect(readReturnTo(origin)).toBeUndefined()
  })

  it('preserves searches that look like JSON primitives', () => {
    for (const q of ['102', 'true', 'null', '[1]']) {
      const href = navigationHref('/pessoas', { q })
      expect(readReturnTo(href)).toBe(href)
    }
  })

  it('rejects self returns and removes nested return chains and unknown state', () => {
    expect(readReturnTo('/pessoas?q=Ana', '/pessoas')).toBeUndefined()
    expect(
      readReturnTo(
        '/disciplinas?q=MC102&page=3&token=secret&returnTo=%2Fpessoas',
      ),
    ).toBe('/disciplinas?q=MC102&page=3')
  })

  it.each([
    '/cursos/34?catalogId=1&catalogProgramVariantId=5&tab=dependencies&dependencyCourseId=42',
    '/cursos/34?catalogId=1&catalogProgramVariantId=5&tab=about',
    '/situacao-do-curso?tab=curriculum&curriculumTab=about',
    '/situacao-do-curso?tab=curriculum&curriculumTab=proposal&hideCompleted=true',
    '/planejamentos-de-curriculo/17',
    '/planejamentos-de-curriculo/rascunho',
    '/grupos/12',
    '/grupos/12/gerenciar/eventos?status=CANCELLED',
    '/taxonomia/tags/4?q=dados&page=2',
    '/eventos?period=past',
  ])('accepts existing internal context %s', (origin) => {
    const actual = new URL(readReturnTo(origin)!, 'https://pomi.invalid')
    const expected = new URL(origin, 'https://pomi.invalid')
    expect(actual.pathname).toBe(expected.pathname)
    expect(Object.fromEntries(actual.searchParams)).toEqual(
      Object.fromEntries(expected.searchParams),
    )
  })
})
