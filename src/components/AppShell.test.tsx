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
    expect(screen.getByRole('contentinfo')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Ominira' }).getAttribute('href'),
    ).toBe('https://github.com/ominira-unicamp/')
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(login).toHaveBeenCalledOnce()
  })

  it('opens the mobile navigation as a dialog', async () => {
    renderShell()
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir menu' }))

    expect(await screen.findByRole('dialog')).toBeTruthy()
    expect(screen.getByText('Navegação do POMI')).toBeTruthy()
  })

  it('places the footer after a full-viewport main beside the sidebar', async () => {
    const { container } = renderShell()
    const main = await screen.findByRole('main')
    const footer = screen.getByRole('contentinfo')
    const sidebar = container.querySelector('aside')

    expect(main.className).toContain('min-h-[calc(100svh-4.5rem)]')
    expect(main.nextElementSibling).toBe(footer)
    expect(sidebar?.parentElement).toBe(main.parentElement?.parentElement)
  })

  it('keeps the header and sidebar fixed while the content scrolls', async () => {
    const { container } = renderShell()
    const header = await screen.findByRole('banner')
    const sidebar = container.querySelector('aside')

    expect(header.className).toContain('sticky top-0')
    expect(sidebar?.className).toContain('sticky top-18')
    expect(sidebar?.className).toContain('h-[calc(100svh-4.5rem)]')
  })

  it('starts collapsed and persists the desktop navigation preference', async () => {
    const { container } = renderShell()
    fireEvent.click(
      await screen.findByRole('button', { name: 'Expandir navegação' }),
    )

    expect(container.querySelector('aside')?.dataset.collapsed).toBe('false')
    expect(window.localStorage.getItem('pomi.sidebar.collapsed')).toBe('false')
  })
})
