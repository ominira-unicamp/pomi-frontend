import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { useHistoryImport } from './useHistoryImport'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({ parse: vi.fn(), save: vi.fn() }))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    sessionSubject: 'subject',
    getAccessToken: () => Promise.resolve('token'),
  }),
}))
vi.mock('@/features/student/historyImport/studentHistoryParser', () => ({
  parseStudentHistoryPdf: mocks.parse,
}))
vi.mock('@/features/student/data/studentApi', () => ({
  importStudentHistory: mocks.save,
}))
const value = {
  format: 'pomi.student-history',
  version: 1,
  student: { ra: '123456', name: 'Aluno' },
  semesters: [],
} as never
const parsed = { value, warnings: [] }
const summary = { created: 2, updated: 1, skipped: 0, warnings: [] }
function setup() {
  const client = new QueryClient()
  const invalidate = vi.spyOn(client, 'invalidateQueries')
  const hook = renderHook(() => useHistoryImport(7), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  })
  return { ...hook, invalidate }
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.parse.mockResolvedValue(parsed)
  mocks.save.mockResolvedValue(summary)
})
it('previews before sending and imports for the account without requiring a Student', async () => {
  const { result, invalidate } = setup()
  await act(() => result.current.parse(new File(['pdf'], 'history.pdf')))
  expect(result.current.pending).toEqual(parsed)
  expect(mocks.save).not.toHaveBeenCalled()
  await act(() => result.current.confirm(value))
  expect(mocks.save).toHaveBeenCalledWith(7, value, expect.any(Function))
  expect(result.current.pending).toBeUndefined()
  expect(result.current.summary).toEqual(summary)
  expect(invalidate).toHaveBeenCalled()
})
it('retains the preview after failure and allows retry', async () => {
  mocks.save.mockRejectedValueOnce(new Error('offline'))
  const { result } = setup()
  await act(() => result.current.parse(new File([], 'history.pdf')))
  await act(() => result.current.confirm(value))
  expect(result.current.pending).toEqual(parsed)
  expect(result.current.error).toBe('offline')
  await act(() => result.current.confirm(value))
  expect(result.current.summary).toEqual(summary)
})
it('blocks concurrent submissions and does not resend after success', async () => {
  let resolve!: (value: typeof summary) => void
  mocks.save.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      }),
  )
  const { result } = setup()
  await act(() => result.current.parse(new File([], 'history.pdf')))
  let saving!: Promise<void>
  act(() => {
    saving = result.current.confirm(value)
    void result.current.confirm(value)
  })
  expect(mocks.save).toHaveBeenCalledTimes(1)
  await act(async () => {
    resolve(summary)
    await saving
  })
  await act(() => result.current.confirm(value))
  expect(mocks.save).toHaveBeenCalledTimes(1)
})
it('reports unreadable files without sending records', async () => {
  mocks.parse.mockRejectedValueOnce(new Error('PDF inválido'))
  const { result } = setup()
  await act(() => result.current.parse(new File([], 'bad.pdf')))
  await waitFor(() => expect(result.current.error).toBe('PDF inválido'))
  expect(mocks.save).not.toHaveBeenCalled()
})
