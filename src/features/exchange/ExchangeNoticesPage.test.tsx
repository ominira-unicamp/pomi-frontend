import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import type * as Router from '@tanstack/react-router'

import type * as ExchangeApi from '@/features/exchange/data/exchangeApi'
import { ExchangeNoticesPage } from '@/features/exchange/ExchangeNoticesPage'

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof Router>()),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

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

vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => mocks.student,
}))

vi.mock('@/features/exchange/data/exchangeApi', async (importOriginal) => {
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
    fireEvent.click(screen.getByRole('button', { name: 'Configurar alertas' }))
    expect(mocks.auth.login).toHaveBeenCalledWith('/editais-de-intercambio')
  })

  it('summarizes active alerts without hiding the public catalog', async () => {
    mocks.auth.isAuthenticated = true
    mocks.student.studentId = 7
    mocks.getSubscription.mockResolvedValue({
      studentId: 7,
      enabled: true,
      placeIds: [3, 5],
    })
    renderPage()

    expect(await screen.findByText('Alertas configurados')).toBeTruthy()
    expect(screen.getByText(/Você acompanha 2 locais/)).toBeTruthy()
    expect(screen.getByText('Programa África')).toBeTruthy()
  })

  it('adds and removes advanced filters individually', async () => {
    renderPage()

    await screen.findByText('Programa África')
    fireEvent.pointerDown(
      screen.getByRole('button', { name: 'Mais filtros' }),
      {
        button: 0,
        ctrlKey: false,
      },
    )
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Locais' }))

    expect(screen.getByText('Locais')).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Remover filtro Locais' }),
    )
    expect(
      screen.queryByRole('button', { name: 'Remover filtro Locais' }),
    ).toBeNull()
  })
})
