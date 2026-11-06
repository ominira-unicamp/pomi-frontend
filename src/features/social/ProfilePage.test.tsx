import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProfilePage } from './ProfilePage'
import { MyProfileLayout } from './MyProfileLayout'
import type { ReactNode } from 'react'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const mocks = vi.hoisted(() => ({
  profile: vi.fn(),
  update: vi.fn(),
  interests: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  tags: vi.fn(),
  blocker: vi.fn(),
  clipboard: vi.fn(),
}))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    initialized: true,
    isAuthenticated: true,
    sessionSubject: 'session',
    getAccessToken: () => Promise.resolve('token'),
  }),
}))
vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useStudentProfile: () => ({
    studentId: 7,
    studentQuery: { isLoading: false },
  }),
}))
vi.mock('@tanstack/react-router', () => ({
  useBlocker: mocks.blocker,
  Outlet: () => null,
  Link: ({ to, children }: { to: string; children: ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}))
vi.mock('@/features/friends/studentSocialApi', () => ({
  getPublicProfile: mocks.profile,
  updatePublicProfile: mocks.update,
}))
vi.mock('@/features/student-interests/data/studentTagInterestApi', () => ({
  listStudentTagInterests: mocks.interests,
  putStudentTagInterest: mocks.add,
  deleteStudentTagInterest: mocks.remove,
}))
vi.mock('@/features/tag-taxonomy/data/tagTaxonomyApi', () => ({
  listTags: mocks.tags,
}))
vi.mock('@/features/media/MediaEditor', () => ({
  MediaEditor: () => <p>Foto do perfil</p>,
}))
vi.mock('@/features/media/IdentityImages', () => ({ PersonAvatar: () => null }))
const initial = {
  publicId: 'self',
  displayName: 'Ana',
  bio: 'Bio original',
  enabled: true,
  currentCoursesVisibility: 'PRIVATE',
  avatarMediaId: null,
  interests: [],
  currentCourses: [],
  program: null,
  specialization: null,
  entryYear: null,
}
const key = privateQueryKeys.studentSocialProfile('session', 7)
function renderPage(layout = false) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const view = render(
    <QueryClientProvider client={client}>
      {layout ? <MyProfileLayout /> : <ProfilePage />}
    </QueryClientProvider>,
  )
  return { ...view, client }
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.profile.mockResolvedValue({ ...initial })
  mocks.update.mockImplementation((_id, body) =>
    Promise.resolve({
      ...initial,
      ...body,
    }),
  )
  mocks.interests.mockResolvedValue([{ id: 1, name: 'Música' }])
  mocks.tags.mockResolvedValue([
    { id: 1, name: 'Música' },
    { id: 2, name: 'Computação' },
  ])
  mocks.add.mockResolvedValue(undefined)
  mocks.remove.mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: mocks.clipboard.mockResolvedValue(undefined) },
  })
})

describe('profile editing', () => {
  it('saves only identity fields and clears the unsaved changes guard', async () => {
    renderPage()
    const name = await screen.findByRole<HTMLInputElement>('textbox', {
      name: 'Nome público',
    })
    expect(
      screen.getByRole<HTMLButtonElement>('button', {
        name: 'Salvar alterações',
      }).disabled,
    ).toBe(true)
    fireEvent.change(name, { target: { value: 'Ana Silva' } })
    expect(mocks.blocker.mock.lastCall?.[0].enableBeforeUnload).toBe(true)
    fireEvent.click(
      screen.getByRole<HTMLButtonElement>('button', {
        name: 'Salvar alterações',
      }),
    )
    await waitFor(() =>
      expect(mocks.update).toHaveBeenCalledWith(
        7,
        { displayName: 'Ana Silva', bio: 'Bio original' },
        expect.any(Function),
      ),
    )
    expect(await screen.findByText('Nome e bio salvos.')).toBeTruthy()
    expect(mocks.blocker.mock.lastCall?.[0].enableBeforeUnload).toBe(false)
  })
  it('keeps identity drafts after privacy saves and media query refreshes', async () => {
    const { client } = renderPage()
    const name = await screen.findByRole<HTMLInputElement>('textbox', {
      name: 'Nome público',
    })
    fireEvent.change(name, { target: { value: 'Nome ainda não salvo' } })
    mocks.profile.mockResolvedValue({
      ...initial,
      currentCoursesVisibility: 'FRIENDS',
    })
    fireEvent.change(
      screen.getByRole<HTMLSelectElement>('combobox', {
        name: 'Compartilhar disciplinas cursando',
      }),
      { target: { value: 'FRIENDS' } },
    )
    expect(await screen.findByText('Privacidade atualizada.')).toBeTruthy()
    expect(mocks.update.mock.calls[0][1]).toEqual({
      currentCoursesVisibility: 'FRIENDS',
    })
    expect(name.value).toBe('Nome ainda não salvo')
    act(() =>
      client.setQueryData(key, { ...initial, avatarMediaId: 'new-photo' }),
    )
    expect(name.value).toBe('Nome ainda não salvo')
    expect(
      screen.getByText('Nome e bio têm alterações não salvas.'),
    ).toBeTruthy()
  })
  it('keeps the form and draft visible when a background refresh fails', async () => {
    const { client } = renderPage()
    const name = await screen.findByRole<HTMLInputElement>('textbox', {
      name: 'Nome público',
    })
    fireEvent.change(name, { target: { value: 'Rascunho local' } })
    mocks.profile.mockRejectedValue(new Error('offline'))
    await act(async () => {
      await client.refetchQueries({ queryKey: key })
    })
    expect(await screen.findByText(/Seu rascunho foi mantido/)).toBeTruthy()
    expect(
      screen.getByRole<HTMLInputElement>('textbox', {
        name: 'Nome público',
      }).value,
    ).toBe('Rascunho local')
  })

  it('confirms profile visibility without saving draft identity fields', async () => {
    renderPage()
    fireEvent.change(
      await screen.findByRole<HTMLInputElement>('textbox', {
        name: 'Nome público',
      }),
      { target: { value: 'Rascunho' } },
    )
    fireEvent.click(
      screen.getByRole<HTMLButtonElement>('button', {
        name: 'Desativar perfil público',
      }),
    )
    expect(mocks.update).not.toHaveBeenCalled()
    expect(await screen.findByRole('dialog')).toBeTruthy()
    fireEvent.click(
      screen.getByRole<HTMLButtonElement>('button', {
        name: 'Desativar perfil',
      }),
    )
    await waitFor(() =>
      expect(mocks.update.mock.calls[0][1]).toEqual({ enabled: false }),
    )
    expect(
      screen.getByRole<HTMLInputElement>('textbox', {
        name: 'Nome público',
      }).value,
    ).toBe('Rascunho')
  })
  it('retains edited values on save failure and supports explicit discard', async () => {
    mocks.update.mockRejectedValue(new Error('offline'))
    renderPage()
    const name = await screen.findByRole<HTMLInputElement>('textbox', {
      name: 'Nome público',
    })
    fireEvent.change(name, { target: { value: 'Rascunho' } })
    fireEvent.click(
      screen.getByRole<HTMLButtonElement>('button', {
        name: 'Salvar alterações',
      }),
    )
    expect(await screen.findByRole('alert')).toBeTruthy()
    expect(name.value).toBe('Rascunho')
    fireEvent.click(
      screen.getByRole<HTMLButtonElement>('button', {
        name: 'Descartar alterações',
      }),
    )
    expect(name.value).toBe('Ana')
  })
  it('restores the persisted privacy choice when its save fails', async () => {
    mocks.update.mockRejectedValue(new Error('offline'))
    renderPage()
    const choice = await screen.findByRole<HTMLSelectElement>('combobox', {
      name: 'Compartilhar disciplinas cursando',
    })
    fireEvent.change(choice, { target: { value: 'PUBLIC' } })
    expect(
      await screen.findByText(/A configuração anterior foi mantida/),
    ).toBeTruthy()
    expect(choice.value).toBe('PRIVATE')
  })
  it('shows interests first, excludes duplicates and adds a selected suggestion immediately', async () => {
    renderPage()
    const remove = await screen.findByRole<HTMLButtonElement>('button', {
      name: 'Remover interesse em Música',
    })
    const input = screen.getByRole<HTMLSelectElement>('combobox', {
      name: 'Novo interesse',
    })
    expect(
      remove.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Computação' } })
    expect(screen.queryByRole('option', { name: 'Música' })).toBeNull()
    mocks.interests.mockResolvedValue([
      { id: 1, name: 'Música' },
      { id: 2, name: 'Computação' },
    ])
    fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() =>
      expect(mocks.add).toHaveBeenCalledWith(7, 2, expect.any(Function)),
    )
    expect(
      await screen.findByRole<HTMLButtonElement>('button', {
        name: 'Remover interesse em Computação',
      }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: 'Adicionar interesse' }),
    ).toBeNull()
  })
  it('keeps interests on failed removal and reports the error', async () => {
    mocks.remove.mockRejectedValue(new Error('offline'))
    renderPage()
    fireEvent.click(
      await screen.findByRole<HTMLButtonElement>('button', {
        name: 'Remover interesse em Música',
      }),
    )
    expect(await screen.findByText(/Ele foi mantido no perfil/)).toBeTruthy()
    expect(
      screen.getByRole<HTMLButtonElement>('button', {
        name: 'Remover interesse em Música',
      }),
    ).toBeTruthy()
  })
  it('does not render an interest loading error as an empty profile', async () => {
    mocks.interests.mockRejectedValue(new Error('offline'))
    renderPage()
    expect(
      await screen.findByText('Não foi possível carregar seus interesses.'),
    ).toBeTruthy()
    expect(
      screen.queryByText('Você ainda não adicionou nenhum interesse.'),
    ).toBeNull()
  })
  it('keeps profile sections and public code copying in the shared header', async () => {
    renderPage(true)
    fireEvent.click(
      await screen.findByRole<HTMLButtonElement>('button', {
        name: 'Copiar código público',
      }),
    )
    expect(await screen.findByText('Código público copiado.')).toBeTruthy()
    expect(mocks.clipboard).toHaveBeenCalledWith('self')
    for (const name of [
      'Informações',
      'Amigos',
      'Solicitações',
      'Visualizar perfil',
    ])
      expect(screen.getByRole('link', { name })).toBeTruthy()
  })
})
