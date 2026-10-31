import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
import { CreateGroupPage } from './CreateGroupPage'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  auth: {
    initialized: true,
    isAuthenticated: true,
    sessionSubject: 'person-1',
    getAccessToken: vi.fn().mockResolvedValue('token'),
    login: vi.fn(),
  },
  student: { studentId: 7, studentQuery: { isPending: false } },
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useBlocker: vi.fn(),
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => mocks.student,
}))
vi.mock('./data/groupApi', () => ({ groupApi: mocks }))
function renderPage() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <CreateGroupPage />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mocks.create.mockReset().mockResolvedValue({ id: 42 })
})

it('explains public visibility before creation and offers next steps after success', async () => {
  renderPage()
  expect(screen.getByText(/imediatamente visível/)).toBeTruthy()
  fireEvent.change(screen.getByRole('textbox', { name: 'Nome do grupo' }), {
    target: { value: 'Coletivo Cultural' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Criar grupo público' }))
  await waitFor(() =>
    expect(mocks.create).toHaveBeenCalledWith(
      7,
      { name: 'Coletivo Cultural', description: null },
      mocks.auth.getAccessToken,
    ),
  )
  expect(
    await screen.findByRole('heading', { name: 'Seu grupo já está no ar' }),
  ).toBeTruthy()
  expect(screen.getByText('Completar perfil e organizar')).toBeTruthy()
  expect(screen.getByText('Ver perfil público')).toBeTruthy()
})
