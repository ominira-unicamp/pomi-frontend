import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContextLink, NavigationContextProvider } from './NavigationContext'
import { ContextBackLink } from './ContextBackLink'
import { readReturnTo } from '@/lib/navigation'

function setup(initialEntry: string) {
  const root = createRootRoute({
    component: () => (
      <NavigationContextProvider>
        <Outlet />
      </NavigationContextProvider>
    ),
  })
  const list = createRoute({
    getParentRoute: () => root,
    path: '/disciplinas',
    validateSearch: (search: Record<string, unknown>) => ({
      q: typeof search.q === 'string' ? search.q : undefined,
      page: Number(search.page) || 1,
    }),
    component: () => (
      <>
        <h1>Resultados</h1>
        <ContextLink
          to="/disciplinas/$courseId"
          params={{ courseId: '42' }}
          search={{ catalogYear: 2026 }}
        >
          MC102
        </ContextLink>
      </>
    ),
  })
  const detail = createRoute({
    getParentRoute: () => root,
    path: '/disciplinas/$courseId',
    validateSearch: (
      search: Record<string, unknown>,
    ): { returnTo?: string; catalogYear?: number } => ({
      returnTo: readReturnTo(search.returnTo),
      catalogYear: Number(search.catalogYear) || undefined,
    }),
    component: () => (
      <>
        <h1>Disciplina {detail.useParams().courseId}</h1>
        <ContextBackLink to="/disciplinas" label="Explorar disciplinas" />
        <ContextLink
          to="/disciplinas/$courseId"
          params={{ courseId: '43' }}
          search={{}}
        >
          Pré-requisito
        </ContextLink>
      </>
    ),
  })
  const catalog = createRoute({
    getParentRoute: () => root,
    path: '/cursos/$programId',
    component: () => <h1>Currículo oficial</h1>,
  })
  const router = createRouter({
    routeTree: root.addChildren([list, detail, catalog]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  })
  render(<RouterProvider router={router} />)
  return router
}

describe('contextual navigation with the router', () => {
  it('keeps the initial result page across a prerequisite chain and browser history', async () => {
    const router = setup('/disciplinas?q=MC&page=3')
    fireEvent.click(await screen.findByRole('link', { name: 'MC102' }))
    await screen.findByRole('heading', { name: 'Disciplina 42' })
    expect(router.state.location.search.returnTo).toBe(
      '/disciplinas?q=MC&page=3',
    )
    fireEvent.click(screen.getByRole('link', { name: 'Pré-requisito' }))
    await screen.findByRole('heading', { name: 'Disciplina 43' })
    expect(router.state.location.search.returnTo).toBe(
      '/disciplinas?q=MC&page=3',
    )
    expect(router.state.location.search.catalogYear).toBe(2026)
    fireEvent.click(screen.getByRole('link', { name: 'Voltar aos resultados' }))
    await screen.findByRole('heading', { name: 'Resultados' })
    expect(router.state.location.search).toEqual({ q: 'MC', page: 3 })
    act(() => router.history.back())
    await screen.findByRole('heading', { name: 'Disciplina 43' })
    act(() => router.history.forward())
    await screen.findByRole('heading', { name: 'Resultados' })
  })

  it('restores context from a direct URL and rejects an external return', async () => {
    const router = setup(
      '/disciplinas/42?catalogYear=2026&returnTo=%2Fcursos%2F34',
    )
    const back = await screen.findByRole('link', {
      name: 'Voltar ao currículo oficial',
    })
    expect(back.getAttribute('href')).toBe('/cursos/34')
    await act(() =>
      router.navigate({
        to: '/disciplinas/$courseId',
        params: { courseId: '42' },
        search: { returnTo: 'https://evil.test' },
      }),
    )
    await waitFor(() =>
      expect(
        screen
          .getByRole('link', { name: 'Explorar disciplinas' })
          .getAttribute('href'),
      ).toContain('/disciplinas'),
    )
  })
})
