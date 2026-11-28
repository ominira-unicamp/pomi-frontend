import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import {
  CurriculumPlannerProvider,
  useCurriculumPlanner,
} from './CurriculumPlannerProvider'
import type { CurriculumPlannerContextValue } from './CurriculumPlannerProvider'
import type { CurriculumDocument } from './data/curriculumPersistenceApi'

const mocks = vi.hoisted(() => ({
  subject: 'account-a',
  patch: vi.fn(),
  token: vi.fn(() => Promise.resolve('token')),
}))
const documentFor = (id: number): CurriculumDocument => ({
  id,
  name: `Plano ${id}`,
  isFavorite: false,
  selection: {
    catalogProgramId: null,
    catalogProgramVariantId: null,
    languageId: null,
  },
  planningStart: null,
  currentPeriodId: null,
  periods: [],
  courses: [],
})
const documentA = documentFor(1)
const documentB = documentFor(2)
const remoteFor = (userId: number, document: CurriculumDocument) => ({
  remoteQuery: {
    data: {
      userId,
      document,
      completed: [],
      summaries: [{ ...document, id: document.id! }],
    },
    isLoading: false,
    refetch: vi.fn(),
  },
  studentProfileQuery: { data: undefined },
  attemptsQuery: { data: [], isLoading: false },
})
const remoteA = remoteFor(7, documentA)
const remoteB = remoteFor(8, documentB)
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    initialized: true,
    isAuthenticated: true,
    sessionSubject: mocks.subject,
    getAccessToken: mocks.token,
  }),
}))
vi.mock('./hooks/useCurriculumRemoteData', () => ({
  useCurriculumRemoteData: () =>
    mocks.subject === 'account-a' ? remoteA : remoteB,
}))
vi.mock('@/catalog/data/curriculumCatalogApi', () => ({
  createCurriculumCatalogDataSource: () => ({
    load: () =>
      Promise.resolve({
        ok: true,
        value: { courses: [], catalogPrograms: [] },
      }),
  }),
}))
vi.mock('./data/curriculumPersistenceApi', async (original) => ({
  ...(await original<object>()),
  patchCurriculum: mocks.patch,
}))

it('does not reuse an old account document after a delayed rename confirmation', async () => {
  let finish!: (document: CurriculumDocument) => void
  const response = new Promise<CurriculumDocument>((resolve) => {
    finish = resolve
  })
  mocks.subject = 'account-a'
  mocks.patch
    .mockReset()
    .mockReturnValueOnce(response)
    .mockResolvedValueOnce({ ...documentB, name: 'Conta B' })
  let current!: CurriculumPlannerContextValue
  function Probe() {
    current = useCurriculumPlanner()
    return null
  }
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const tree = (id: string) => (
    <QueryClientProvider client={client}>
      <CurriculumPlannerProvider routeCurriculumId={id}>
        <Probe />
      </CurriculumPlannerProvider>
    </QueryClientProvider>
  )
  const view = render(tree('1'))
  await waitFor(() => expect(current.isLoading).toBe(false))
  let oldRename!: Promise<boolean>
  act(() => {
    oldRename = current.renameCurriculum('Conta A')
  })
  await waitFor(() => expect(mocks.patch).toHaveBeenCalledTimes(1))
  mocks.subject = 'account-b'
  view.rerender(tree('2'))
  await waitFor(() => expect(current.activeCurriculumId).toBe(2))
  await act(async () => {
    finish({ ...documentA, name: 'Conta A' })
    expect(await oldRename).toBe(false)
  })
  await act(async () => {
    expect(await current.renameCurriculum('Conta B')).toBe(true)
  })
  expect(mocks.patch).toHaveBeenLastCalledWith(
    8,
    2,
    { name: 'Conta B' },
    mocks.token,
  )
  expect(
    client.getQueryData(['private', 'account-b', 'user', 8, 'curricula', 1]),
  ).toBeUndefined()
})
