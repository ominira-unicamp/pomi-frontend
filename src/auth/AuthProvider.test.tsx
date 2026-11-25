import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from '@/auth/AuthProvider'

const keycloak = vi.hoisted(() => ({
  authenticated: false,
  tokenParsed: undefined as { sub: string } | undefined,
  init: vi.fn<() => Promise<boolean>>(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  clearToken: vi.fn(),
  updateToken: vi.fn(),
  onAuthSuccess: undefined as undefined | (() => void),
  onAuthRefreshSuccess: undefined as undefined | (() => void),
  onAuthLogout: undefined as undefined | (() => void),
  onAuthRefreshError: undefined as undefined | (() => void),
  onTokenExpired: undefined as undefined | (() => void),
}))

vi.mock('keycloak-js', () => ({
  default: vi.fn(function MockKeycloak() {
    return keycloak
  }),
}))

function SessionStatus() {
  const auth = useAuth()
  return (
    <div>
      {auth.initialized ? 'ready' : 'waiting'}:
      {auth.isAuthenticated ? 'authenticated' : 'guest'}
      <button onClick={() => void auth.register('/cursos')}>Criar conta</button>
    </div>
  )
}

afterEach(() => {
  vi.useRealTimers()
})

it('keeps public content available when silent SSO stalls and clears failed sessions locally', async () => {
  vi.useFakeTimers()
  let resolveInit: (authenticated: boolean) => void = () => {}
  keycloak.init.mockReturnValue(
    new Promise<boolean>((resolve) => {
      resolveInit = resolve
    }),
  )
  keycloak.clearToken.mockImplementation(() => {
    keycloak.authenticated = false
    keycloak.tokenParsed = undefined
    keycloak.onAuthLogout?.()
  })

  render(
    <AuthProvider>
      <SessionStatus />
    </AuthProvider>,
  )

  expect(screen.getByText('waiting:guest')).toBeTruthy()
  expect(keycloak.init).toHaveBeenCalledWith(
    expect.objectContaining({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      silentCheckSsoFallback: false,
    }),
  )

  await act(async () => {
    vi.advanceTimersByTime(5_000)
    await Promise.resolve()
  })
  expect(screen.getByText('ready:guest')).toBeTruthy()

  await act(async () => {
    keycloak.authenticated = true
    keycloak.tokenParsed = { sub: 'student-1' }
    resolveInit(true)
    await Promise.resolve()
  })
  expect(screen.getByText('ready:authenticated')).toBeTruthy()

  await act(async () => {
    keycloak.onAuthRefreshError?.()
    await Promise.resolve()
  })
  expect(screen.getByText('ready:guest')).toBeTruthy()
  expect(keycloak.clearToken).toHaveBeenCalledOnce()
  expect(keycloak.logout).not.toHaveBeenCalled()
})

it('opens registration with a return URL on the frontend origin', () => {
  render(
    <AuthProvider>
      <SessionStatus />
    </AuthProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
  expect(keycloak.register).toHaveBeenCalledWith({
    redirectUri: `${window.location.origin}/cursos`,
  })
})
