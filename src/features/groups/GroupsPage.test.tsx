import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GroupsPage } from './GroupsPage'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  auth: { isAuthenticated: false },
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: { children: ReactNode; to: string }) => (
    <a href={props.to}>{children}</a>
  ),
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('./data/groupApi', () => ({ groupApi: mocks }))

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <GroupsPage />
    </QueryClientProvider>,
  )
}

describe('GroupsPage', () => {
  beforeEach(() => {
    mocks.auth.isAuthenticated = false
    mocks.list.mockReset().mockResolvedValue([
      {
        id: 42,
        name: 'Coletivo Cultural',
        description: 'Arte e cultura no campus',
        tags: [{ id: 3, name: 'Cultura', categoryId: 1 }],
      },
      { id: 43, name: 'Grupo sem descrição', description: null, tags: [] },
    ])
  })

  it('shows useful public cards and filters by description and tag', async () => {
    renderPage()
    expect(await screen.findByText('Coletivo Cultural')).toBeTruthy()
    expect(screen.getByText('Arte e cultura no campus')).toBeTruthy()
    expect(screen.getByText('Grupo sem descrição')).toBeTruthy()
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar grupos' }), {
      target: { value: 'Cultura' },
    })
    expect(screen.getByText('Coletivo Cultural')).toBeTruthy()
    expect(screen.queryByText('Grupo sem descrição')).toBeNull()
    fireEvent.change(screen.getByRole('textbox', { name: 'Buscar grupos' }), {
      target: { value: 'Inexistente' },
    })
    expect(screen.getByText('Nenhum grupo encontrado')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Limpar busca' })).toBeTruthy()
  })

  it('keeps discovery public without requesting personal data', async () => {
    renderPage()
    expect(await screen.findByText('Coletivo Cultural')).toBeTruthy()
    expect(screen.queryByText('Convites para você')).toBeNull()
    expect(screen.queryByText('Criar grupo')).toBeNull()
    expect(screen.queryByRole('navigation', { name: 'Comunidade' })).toBeNull()
  })

  it('offers a separate creation route after login', async () => {
    mocks.auth.isAuthenticated = true
    renderPage()
    expect(
      (await screen.findByRole('link', { name: 'Criar grupo' })).getAttribute(
        'href',
      ),
    ).toBe('/grupos/novo')
    expect(screen.getByRole('link', { name: 'Meus grupos' })).toBeTruthy()
  })

  it('keeps a name-only group compact and navigable', async () => {
    mocks.list.mockResolvedValue([
      { id: 43, name: 'Grupo sem descrição', description: null, tags: [] },
    ])
    renderPage()
    expect(await screen.findByText('Grupo sem descrição')).toBeTruthy()
    expect(screen.queryByText('Sem tags')).toBeNull()
    expect(screen.getByText('1 grupo')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Conhecer grupo' })).toBeTruthy()
  })

  it('explains when the public group list is empty', async () => {
    mocks.list.mockResolvedValue([])
    renderPage()
    expect(await screen.findByText('Ainda não há grupos')).toBeTruthy()
    expect(screen.queryByText('Nenhum grupo encontrado')).toBeNull()
  })
})
