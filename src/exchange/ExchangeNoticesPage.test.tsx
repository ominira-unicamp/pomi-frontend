import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type * as ExchangeApi from '@/exchange/data/exchangeApi'
import { ExchangeNoticesPage } from '@/exchange/ExchangeNoticesPage'

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  listNotices: vi.fn(),
  listPlaces: vi.fn(),
  getSubscription: vi.fn(),
  patchSubscription: vi.fn(),
  auth: {
    initialized: true,
    isAuthenticated: false,
    profile: undefined,
    login: vi.fn(),
    logout: vi.fn(),
    getAccessToken: vi.fn().mockResolvedValue('token'),
    emailVerificationRequired: false,
  },
  student: {
    studentId: undefined as number | undefined,
    studentQuery: {
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    },
    profileQuery: {},
  },
}))

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => mocks.auth,
}))

vi.mock('@/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => mocks.student,
}))

vi.mock('@/exchange/data/exchangeApi', async (importOriginal) => {
  const original = await importOriginal<typeof ExchangeApi>()
  return {
    ...original,
    listExchangeNotices: mocks.listNotices,
    listExchangePlaces: mocks.listPlaces,
    getExchangeNoticeSubscription: mocks.getSubscription,
    patchExchangeNoticeSubscription: mocks.patchSubscription,
  }
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ExchangeNoticesPage />
    </QueryClientProvider>,
  )
}

describe('ExchangeNoticesPage', () => {
  beforeEach(() => {
    mocks.auth.initialized = true
    mocks.auth.isAuthenticated = false
    mocks.auth.login.mockReset()
    mocks.student.studentId = undefined
    mocks.student.studentQuery.isLoading = false
    mocks.student.studentQuery.isError = false
    mocks.listPlaces.mockReset().mockResolvedValue([])
    mocks.listNotices.mockReset().mockResolvedValue([
      {
        id: 1,
        number: '01/2026',
        issuer: 'DERI',
        title: 'Programa África',
        place: null,
        registrationOriginalText: null,
        registrationStart: '2026-09-01',
        registrationEnd: '2026-09-30',
        files: [],
        _paths: { self: '/exchange-notices/1' },
      },
    ])
    mocks.getSubscription.mockReset()
    mocks.patchSubscription.mockReset()
  })

  it('shows the public catalog and starts login returning to exchange', async () => {
    renderPage()

    expect(await screen.findByText('Programa África')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Entrar para configurar' }),
    )
    expect(mocks.auth.login).toHaveBeenCalledWith('/editais-de-intercambio')
  })

  it('saves only the changed subscription field', async () => {
    mocks.auth.isAuthenticated = true
    mocks.student.studentId = 7
    mocks.getSubscription.mockResolvedValue({
      studentId: 7,
      enabled: false,
      placeIds: [],
    })
    mocks.patchSubscription.mockResolvedValue({
      studentId: 7,
      enabled: true,
      placeIds: [],
    })
    renderPage()

    fireEvent.click(
      await screen.findByRole('checkbox', { name: 'Preferência pausada' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Salvar preferências' }))

    await waitFor(() =>
      expect(mocks.patchSubscription).toHaveBeenCalledWith(
        7,
        { enabled: true },
        mocks.auth.getAccessToken,
      ),
    )
    expect(
      await screen.findByText('Preferências de editais salvas.'),
    ).toBeTruthy()
  })
})
