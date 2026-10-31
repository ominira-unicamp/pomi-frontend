import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { routeTree } from '@/routeTree.gen'

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  listEvents: vi.fn(),
  auth: { isAuthenticated: false },
}))

vi.mock('@/components/AppShell', () => ({
  AppShell: ({ children }: { children: ReactNode }) => <>{children}</>,
}))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => mocks.auth,
}))
vi.mock('./data/groupApi', () => ({ groupApi: mocks }))

function renderPath(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

beforeEach(() => {
  mocks.list.mockReset().mockResolvedValue([
    {
      id: 42,
      name: 'Coletivo Cultural',
      description: 'Arte no campus',
      tags: [],
    },
    { id: 43, name: 'Centro Acadêmico', description: null, tags: [] },
  ])
  mocks.listEvents.mockReset().mockResolvedValue([
    {
      id: 51,
      groupId: 42,
      name: 'Evento futuro',
      description: '',
      startsAt: '2099-11-14T15:00:00Z',
      endsAt: null,
      location: null,
      tags: [],
    },
    {
      id: 52,
      groupId: 43,
      name: 'Evento anterior',
      description: '',
      startsAt: '2020-09-04T15:00:00Z',
      endsAt: null,
      location: null,
      tags: [],
    },
  ])
})

it('restores a group search from the URL and keeps edits in the URL', async () => {
  const router = renderPath('/grupos?q=arte')
  const input = await screen.findByRole('textbox', { name: 'Buscar grupos' })
  expect((input as HTMLInputElement).value).toBe('arte')
  expect(screen.queryByText('Centro Acadêmico')).toBeNull()
  fireEvent.change(input, { target: { value: 'centro' } })
  await waitFor(() => expect(router.state.location.search.q).toBe('centro'))
  expect(await screen.findByText('Centro Acadêmico')).toBeTruthy()
})

it('restores the agenda period from the URL and navigates between periods', async () => {
  const router = renderPath('/eventos?period=past')
  expect(
    await screen.findByRole('link', { name: 'Evento anterior' }),
  ).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'Evento futuro' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Próximos' }))
  await waitFor(() =>
    expect(router.state.location.search.period).toBeUndefined(),
  )
  expect(
    await screen.findByRole('link', { name: 'Evento futuro' }),
  ).toBeTruthy()
})
