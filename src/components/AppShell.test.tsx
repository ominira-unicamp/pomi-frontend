import { fireEvent, render, screen } from '@testing-library/react'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AppShell } from '@/components/AppShell'
import { ThemeProvider } from '@/components/ThemeProvider'

const login = vi.fn()
const logout = vi.fn()
const authState = {
  initialized: true,
  isAuthenticated: false,
  profile: undefined,
  login,
  logout,
  getAccessToken: vi.fn(),
}

vi.mock('@/auth/AuthProvider', () => ({
  useAuth: () => authState,
}))

function renderShell() {
  const rootRoute = createRootRoute({
    component: () => (
      <AppShell>
        <Outlet />
      </AppShell>
    ),
  })
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <h1>Conteúdo</h1>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  return render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>,
  )
}

describe('AppShell', () => {
  beforeEach(() => {
    login.mockReset()
    logout.mockReset()
  })

  it('renders the only real navigation item and starts login', async () => {
    renderShell()

    expect(
      await screen.findByRole('link', { name: 'Planejamento' }),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(login).toHaveBeenCalledOnce()
  })

  it('opens the mobile navigation as a dialog', async () => {
    renderShell()
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir menu' }))

    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(screen.getByText('Navegação do POMI')).toBeTruthy()
  })

  it('collapses the desktop navigation', async () => {
    const { container } = renderShell()
    fireEvent.click(
      await screen.findByRole('button', { name: 'Recolher navegação' }),
    )

    expect(container.querySelector('aside')?.dataset.collapsed).toBe('true')
  })
})
