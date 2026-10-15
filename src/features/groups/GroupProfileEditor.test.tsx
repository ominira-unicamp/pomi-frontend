import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProfileEditor } from './GroupProfileEditor'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  update: vi.fn(),
  tags: vi.fn(),
  auth: {
    sessionSubject: 'person-1',
    getAccessToken: vi.fn().mockResolvedValue('token'),
  },
}))
vi.mock('@tanstack/react-router', () => ({
  useBlocker: vi.fn(),
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('@/api/client', () => ({
  pomiSdk: { app: { tags: { listAll: mocks.tags } } },
}))
vi.mock('./data/groupApi', () => ({ groupApi: mocks }))
function renderEditor(editor: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>{editor}</QueryClientProvider>,
  )
}

const group = {
  id: 42,
  name: 'Coletivo',
  description: 'Arte',
  contacts: [],
  externalLinks: [],
  tags: [],
}
beforeEach(() => {
  mocks.update.mockReset().mockResolvedValue(group)
  mocks.tags
    .mockReset()
    .mockResolvedValue([{ id: 3, name: 'Cultura', categoryId: 1 }])
})

describe('partial group permissions', () => {
  it('saves a managed public profile and confirms the result', async () => {
    const refresh = vi.fn()
    mocks.update.mockResolvedValueOnce({ ...group, name: 'Novo coletivo' })
    renderEditor(
      <ProfileEditor
        group={group as never}
        studentId={7}
        permissions={['GROUP_EDIT']}
        refresh={refresh}
      />,
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Nome' }), {
      target: { value: 'Novo coletivo' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: 'Salvar nome e descrição' }),
    )
    await waitFor(() =>
      expect(mocks.update).toHaveBeenCalledWith(
        7,
        42,
        { name: 'Novo coletivo', description: 'Arte' },
        mocks.auth.getAccessToken,
      ),
    )
    expect((await screen.findByRole('status')).textContent).toContain(
      'Alterações salvas.',
    )
    expect(refresh).toHaveBeenCalled()
  })
  it('lets a tag manager add a tag without exposing name editing or archive', async () => {
    renderEditor(
      <ProfileEditor
        group={group as never}
        studentId={7}
        permissions={['GROUP_TAG_MANAGE']}
        refresh={vi.fn()}
      />,
    )
    expect(
      screen.queryByRole('button', { name: 'Salvar nome e descrição' }),
    ).toBeNull()
    await screen.findByRole('option', { name: 'Cultura' })
    fireEvent.change(screen.getByRole('combobox', { name: 'Escolher tag' }), {
      target: { value: '3' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar tag' }))
    await waitFor(() =>
      expect(mocks.update).toHaveBeenCalledWith(
        7,
        42,
        { tags: { add: [3] } },
        mocks.auth.getAccessToken,
      ),
    )
  })
})
