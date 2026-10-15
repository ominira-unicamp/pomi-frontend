import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EventsPage } from './EventsPage'
import { EventDetailPage } from './EventDetailPage'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  listEvents: vi.fn(),
  getEvent: vi.fn(),
  list: vi.fn(),
  get: vi.fn(),
  auth: { isAuthenticated: false },
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    params,
  }: {
    children: ReactNode
    to: string
    params?: Record<string, string>
  }) => (
    <a
      href={Object.entries(params ?? {}).reduce(
        (path, [key, value]) => path.replace(`$${key}`, value),
        to,
      )}
    >
      {children}
    </a>
  ),
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('./data/groupApi', () => ({ groupApi: mocks }))
function renderPage(page: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>{page}</QueryClientProvider>,
  )
}

const event = {
  id: 12,
  groupId: 4,
  name: 'Oficina aberta',
  description: 'Aprenda em conjunto',
  startsAt: '2099-10-20T13:00:00Z',
  endsAt: null,
  location: 'Biblioteca',
  tags: [],
}

describe('event discovery', () => {
  beforeEach(() => {
    mocks.listEvents.mockReset().mockResolvedValue([event])
    mocks.getEvent.mockReset().mockResolvedValue(event)
    mocks.list
      .mockReset()
      .mockResolvedValue([{ id: 4, name: 'Grupo Cultural' }])
    mocks.get.mockReset().mockResolvedValue({ id: 4, name: 'Grupo Cultural' })
  })
  it('shows upcoming events first and links to the event and its organizer', async () => {
    renderPage(<EventsPage />)
    expect(
      await screen.findByRole(
        'link',
        { name: 'Oficina aberta' },
        { timeout: 5000 },
      ),
    ).toBeTruthy()
    expect(
      await screen.findByRole('link', { name: 'Grupo Cultural' }),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'Próximos' })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    expect(
      screen.getByRole('link', { name: 'Oficina aberta' }).getAttribute('href'),
    ).toBe('/eventos/12')
    expect(
      screen.getByRole('link', { name: 'Grupo Cultural' }).getAttribute('href'),
    ).toBe('/grupos/4')
    expect(screen.queryByRole('navigation', { name: 'Comunidade' })).toBeNull()
    expect(mocks.listEvents).toHaveBeenCalledTimes(1)
  })
  it('offers past events when there are no upcoming events', async () => {
    mocks.listEvents.mockResolvedValue([
      { ...event, startsAt: '2020-10-20T00:00:00Z' },
    ])
    renderPage(<EventsPage />)
    expect(
      await screen.findByText('Nenhum próximo evento publicado'),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Ver anteriores' }))
    expect(screen.getByRole('link', { name: 'Oficina aberta' })).toBeTruthy()
    expect(screen.queryByText(/dia inteiro/i)).toBeNull()
  })
  it('shows an undated published event without inventing a date', async () => {
    mocks.listEvents.mockResolvedValue([{ ...event, startsAt: null }])
    renderPage(<EventsPage />)
    expect(
      await screen.findByText('Nenhum próximo evento publicado'),
    ).toBeTruthy()
    fireEvent.click(
      screen.getByRole('button', { name: 'Ver eventos sem data' }),
    )
    expect(screen.getByText('Horário a confirmar')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Oficina aberta' })).toBeTruthy()
  })
  it('shows a public event and its organizer on a direct detail page', async () => {
    renderPage(<EventDetailPage eventId={12} />)
    expect(
      await screen.findByRole('heading', { name: 'Oficina aberta' }),
    ).toBeTruthy()
    expect(await screen.findByText('Grupo Cultural')).toBeTruthy()
    expect(screen.getByText('Biblioteca')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Conhecer o grupo' })).toBeTruthy()
    expect(mocks.getEvent).toHaveBeenCalledWith(12)
  })
})
