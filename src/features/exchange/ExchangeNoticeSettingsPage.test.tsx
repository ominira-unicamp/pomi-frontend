import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import type * as Router from '@tanstack/react-router'

import type * as ExchangeApi from '@/features/exchange/data/exchangeApi'
import { ExchangeNoticeSettingsPage } from '@/features/exchange/ExchangeNoticeSettingsPage'

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof Router>()),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

const mocks = vi.hoisted(() => ({
  auth: {
    initialized: true,
    isAuthenticated: true,
    profile: undefined,
    login: vi.fn(),
    logout: vi.fn(),
    getAccessToken: vi.fn().mockResolvedValue('token'),
    emailVerificationRequired: false,
  },
  student: {
    studentId: 7 as number | undefined,
    studentQuery: {
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    },
    profileQuery: {},
  },
  listPlaces: vi.fn(),
  getSubscription: vi.fn(),
  patchSubscription: vi.fn(),
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
    listExchangePlaces: mocks.listPlaces,
    getExchangeNoticeSubscription: mocks.getSubscription,
    patchExchangeNoticeSubscription: mocks.patchSubscription,
  }
})

function renderPage() {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <ExchangeNoticeSettingsPage />
    </QueryClientProvider>,
  )
}

describe('ExchangeNoticeSettingsPage', () => {
  beforeEach(() => {
    mocks.auth.initialized = true
    mocks.auth.isAuthenticated = true
    mocks.auth.login.mockReset()
    mocks.student.studentId = 7
    mocks.student.studentQuery.isLoading = false
    mocks.student.studentQuery.isError = false
    mocks.listPlaces
      .mockReset()
      .mockResolvedValue([{ id: 3, name: 'França', normalizedName: 'franca' }])
    mocks.getSubscription.mockReset().mockResolvedValue({
      studentId: 7,
      enabled: false,
      placeIds: [3],
    })
    mocks.patchSubscription.mockReset().mockResolvedValue({
      studentId: 7,
      enabled: true,
      placeIds: [3],
    })
  })

  it('returns to settings after login', async () => {
    mocks.auth.isAuthenticated = false
    renderPage()

    await waitFor(() =>
      expect(mocks.auth.login).toHaveBeenCalledWith(
        '/editais-de-intercambio/configuracoes',
      ),
    )
  })

  it('keeps places disabled while paused and patches only enabled', async () => {
    renderPage()

    expect(
      (
        await screen.findByRole<HTMLButtonElement>('button', {
          name: '1 selecionado',
        })
      ).disabled,
    ).toBe(true)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Pausado' }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    await waitFor(() =>
      expect(mocks.patchSubscription).toHaveBeenCalledWith(
        7,
        { enabled: true },
        mocks.auth.getAccessToken,
      ),
    )
  })
})
