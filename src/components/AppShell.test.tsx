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

function renderShell(initialEntry = '/') {
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
  const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/sobre',
    component: () => <h1>Sobre</h1>,
  })
  const publicProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/perfis/$publicId',
    component: () => <h1>Perfil público</h1>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      indexRoute,
      aboutRoute,
      publicProfileRoute,
    ]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
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
    window.localStorage.removeItem('pomi.sidebar.collapsed')
  })

  it('renders the main navigation and starts login', async () => {
    renderShell()

    expect(await screen.findByRole('link', { name: 'Início' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Currículo' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Intercâmbio' })).toBeTruthy()
    expect(screen.getByText('Planejamento')).toBeTruthy()
    expect(screen.getByText('Vida acadêmica')).toBeTruthy()
    expect(screen.getByText('Comunidade')).toBeTruthy()
    expect(screen.getByText('Recursos')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Sobre nós' })).toBeTruthy()
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

  it('groups secondary mobile actions in a menu', async () => {
    renderShell()
    fireEvent.pointerDown(
      await screen.findByRole('button', { name: 'Abrir ações' }),
      { button: 0, ctrlKey: false },
    )

    expect(
      await screen.findByRole('menuitem', { name: 'Enviar feedback' }),
    ).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: 'Tema' })).toBeTruthy()
    expect(screen.getByRole('menuitem', { name: 'Sobre nós' })).toBeTruthy()
  })

  it('marks private destinations without hiding them', async () => {
    renderShell()
    const profileLink = await screen.findByRole('link', { name: 'Meu perfil' })

    expect(profileLink.querySelector('.lucide-lock-keyhole')).toBeTruthy()
  })

  it('marks only the contextual primary destination as active', async () => {
    renderShell('/perfis/person-id')
    const homeLink = await screen.findByRole('link', { name: 'Início' })
    const peopleLink = screen.getByRole('link', { name: 'Pessoas' })

    expect(homeLink.getAttribute('aria-current')).toBeNull()
    expect(peopleLink.getAttribute('aria-current')).toBe('page')
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
    expect(sidebar?.querySelector('.pomi-scrollbar')).toBeTruthy()
  })

  it('starts expanded and persists the desktop navigation preference', async () => {
    renderShell()
    const sidebar = await screen.findByRole('complementary', {
      name: 'Navegação lateral',
    })
    expect(sidebar.dataset.collapsed).toBe('false')
    fireEvent.click(screen.getByRole('button', { name: 'Recolher navegação' }))

    expect(sidebar.dataset.collapsed).toBe('true')
    expect(
      screen.getByRole('link', { name: 'Meu perfil, requer conta' }),
    ).toBeTruthy()
    expect(window.localStorage.getItem('pomi.sidebar.collapsed')).toBe('true')
  })
})
