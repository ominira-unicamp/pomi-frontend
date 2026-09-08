import { fireEvent, render, screen, within } from '@testing-library/react'
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
  const curriculumPlanningRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/planejamentos-de-curriculo/$planningId',
    component: () => <h1>Planejamento de currículo</h1>,
  })
  const semesterPlanningRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/planejamentos-de-semestre/compartilhado/$shareId',
    component: () => <h1>Planejamento de semestre</h1>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      indexRoute,
      aboutRoute,
      publicProfileRoute,
      curriculumPlanningRoute,
      semesterPlanningRoute,
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
    const navigation = await screen.findByRole('navigation', {
      name: 'Navegação principal',
    })

    expect(
      within(navigation).getByRole('link', { name: 'Início' }),
    ).toBeTruthy()
    expect(
      within(navigation).getByRole('link', { name: 'Currículo' }),
    ).toBeTruthy()
    expect(
      within(navigation).getByRole('link', { name: 'Intercâmbio' }),
    ).toBeTruthy()
    expect(screen.getByText('Planejamento')).toBeTruthy()
    expect(screen.getByText('Catálogo acadêmico')).toBeTruthy()
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

  it('replaces the mobile hamburger with four quick destinations', async () => {
    renderShell()
    const navigation = await screen.findByRole('navigation', {
      name: 'Navegação rápida',
    })

    expect(
      within(navigation).getByRole('link', { name: 'Início' }),
    ).toBeTruthy()
    expect(
      within(navigation).getByRole('link', { name: 'Currículo' }),
    ).toBeTruthy()
    expect(
      within(navigation).getByRole('link', { name: 'Semestre' }),
    ).toBeTruthy()
    expect(
      within(navigation).getByRole('button', { name: 'Menu' }),
    ).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Abrir menu' })).toBeNull()
  })

  it('opens a scrollable bottom sheet from the mobile navigation', async () => {
    renderShell()
    const navigation = await screen.findByRole('navigation', {
      name: 'Navegação rápida',
    })
    const menuButton = within(navigation).getByRole('button', { name: 'Menu' })
    fireEvent.click(menuButton)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeTruthy()
    expect(within(dialog).getByRole('heading', { name: 'Menu' })).toBeTruthy()
    expect(dialog.className).toContain('bottom-0')
    expect(dialog.className).toContain('slide-in-from-bottom')
    expect(dialog.className).toContain('h-[90dvh]')
    expect(dialog.querySelector('.pomi-scrollbar')?.className).toContain(
      'overflow-y-auto',
    )
    expect(menuButton.getAttribute('aria-expanded')).toBe('true')
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
    const mainNavigation = await screen.findByRole('navigation', {
      name: 'Navegação principal',
    })
    const quickNavigation = screen.getByRole('navigation', {
      name: 'Navegação rápida',
    })
    const homeLink = within(mainNavigation).getByRole('link', {
      name: 'Início',
    })
    const peopleLink = within(mainNavigation).getByRole('link', {
      name: 'Pessoas',
    })

    expect(homeLink.getAttribute('aria-current')).toBeNull()
    expect(peopleLink.getAttribute('aria-current')).toBe('page')
    expect(
      within(quickNavigation).getByRole('button', {
        name: 'Menu, seção atual',
      }).dataset.active,
    ).toBe('true')
  })

  it.each([
    ['/planejamentos-de-curriculo/plan-id', 'Currículo'],
    ['/planejamentos-de-semestre/compartilhado/share-id', 'Semestre'],
  ])(
    'marks a deep planning route in the quick navigation',
    async (path, name) => {
      renderShell(path)
      const navigation = await screen.findByRole('navigation', {
        name: 'Navegação rápida',
      })

      expect(
        within(navigation)
          .getByRole('link', { name })
          .getAttribute('aria-current'),
      ).toBe('page')
      expect(
        within(navigation).getByRole('button', { name: 'Menu' }).dataset.active,
      ).toBe('false')
    },
  )

  it('places the footer after a full-viewport main beside the sidebar', async () => {
    const { container } = renderShell()
    const main = await screen.findByRole('main')
    const footer = screen.getByRole('contentinfo')
    const sidebar = container.querySelector('aside')

    expect(main.className).toContain('min-h-[calc(100svh-4.5rem)]')
    expect(main.nextElementSibling).toBe(footer)
    expect(sidebar?.parentElement).toBe(main.parentElement?.parentElement)
    expect(container.firstElementChild?.className).toContain(
      'pb-[calc(3.5rem+env(safe-area-inset-bottom))]',
    )
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
