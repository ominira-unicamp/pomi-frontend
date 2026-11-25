import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, expect, it, vi } from 'vitest'
import { WelcomePage } from './Welcome'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  completeWelcome: vi.fn(),
  refetch: vi.fn(),
  create: vi.fn(),
  updateStudent: vi.fn(),
  updateProfile: vi.fn(),
  getProfile: vi.fn(),
  blocker: vi.fn(),
  current: {
    data: {
      welcomePending: true,
      userId: 1,
      studentId: null as number | null,
      roles: [] as Array<string>,
    },
    isPending: false,
    isError: false,
  },
  email: 'person@example.com',
}))
vi.mock('./index', () => ({
  useCurrentUser: () => ({ ...mocks.current, refetch: mocks.refetch }),
}))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    initialized: true,
    isAuthenticated: true,
    sessionSubject: 'new-user',
    profile: { email: mocks.email },
    getAccessToken: () => Promise.resolve('token'),
    logout: vi.fn(),
  }),
}))
vi.mock('@/components/ThemeMenu', () => ({ ThemeMenu: () => null }))
vi.mock('@/features/media/MediaEditor', () => ({
  MediaEditor: () => <p>Foto do perfil</p>,
}))
vi.mock('@/catalog/data/curriculumCatalogApi', () => ({
  createCurriculumCatalogDataSource: () => ({
    load: () => Promise.resolve({ ok: true, value: { catalogPrograms: [] } }),
  }),
}))
vi.mock('@/api/client', () => ({
  pomiSdk: {
    app: {
      currentUser: { completeWelcome: mocks.completeWelcome },
      students: {
        create: mocks.create,
        update: mocks.updateStudent,
        get: () =>
          Promise.resolve({
            id: 5,
            name: 'Aluno',
            programId: null,
            catalogId: null,
            entryYear: null,
            languageId: null,
            specializationId: null,
          }),
      },
      userSocial: {
        getProfile: mocks.getProfile,
        updateProfile: mocks.updateProfile,
      },
      courseAttempts: { listAll: () => Promise.resolve([]) },
    },
  },
}))
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: { children: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
  useRouterState: vi.fn(),
  useBlocker: (value: unknown) => mocks.blocker(value),
}))

function show() {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <WelcomePage />
    </QueryClientProvider>,
  )
}
function skip() {
  fireEvent.click(screen.getByRole('button', { name: 'Pular esta etapa' }))
}
beforeEach(() => {
  vi.clearAllMocks()
  mocks.current = {
    data: { welcomePending: true, userId: 1, studentId: null, roles: [] },
    isPending: false,
    isError: false,
  }
  mocks.email = 'person@example.com'
  mocks.getProfile.mockResolvedValue({
    displayName: 'Pessoa',
    bio: null,
    enabled: false,
    currentCoursesVisibility: 'PRIVATE',
    avatarMediaId: null,
  })
  mocks.updateProfile.mockImplementation((_id, body) =>
    Promise.resolve({
      displayName: 'Pessoa',
      bio: null,
      enabled: false,
      currentCoursesVisibility: 'PRIVATE',
      ...body,
    }),
  )
  mocks.completeWelcome.mockRejectedValue(new Error('offline'))
  mocks.create.mockResolvedValue({ id: 5 })
})
it('starts with academic life and keeps history available without a Student', async () => {
  show()
  expect(screen.getByRole('heading', { name: 'Vida acadêmica' })).toBeTruthy()
  expect(screen.getByText(/vínculo acadêmico exige/)).toBeTruthy()
  skip()
  expect(screen.getByRole('heading', { name: 'Histórico' })).toBeTruthy()
  await waitFor(() =>
    expect(
      screen
        .getByRole('button', { name: 'Selecionar PDF da DAC' })
        .hasAttribute('disabled'),
    ).toBe(false),
  )
  expect(mocks.completeWelcome).not.toHaveBeenCalled()
})
it('moves through all five steps without completing and preserves drafts on back', async () => {
  show()
  skip()
  skip()
  const input = await screen.findByLabelText('Nome de exibição')
  fireEvent.change(input, { target: { value: 'Meu nome' } })
  skip()
  expect(screen.getByRole('heading', { name: 'Privacidade' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))
  expect(
    screen.getByLabelText<HTMLInputElement>('Nome de exibição').value,
  ).toBe('Meu nome')
  expect(mocks.updateProfile).not.toHaveBeenCalled()
  expect(mocks.completeWelcome).not.toHaveBeenCalled()
})
it('saves public identity without enabling publication', async () => {
  show()
  skip()
  skip()
  fireEvent.change(await screen.findByLabelText('Nome de exibição'), {
    target: { value: 'Novo nome' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Salvar e continuar' }))
  await screen.findByRole('heading', { name: 'Privacidade' })
  expect(mocks.updateProfile).toHaveBeenCalledWith(
    1,
    { displayName: 'Novo nome', bio: null },
    expect.objectContaining({ getAccessToken: expect.any(Function) }),
  )
  expect(mocks.completeWelcome).not.toHaveBeenCalled()
})
it('preserves public profile drafts when saving fails', async () => {
  mocks.updateProfile.mockRejectedValueOnce(new Error('offline'))
  show()
  skip()
  skip()
  fireEvent.change(await screen.findByLabelText('Nome de exibição'), {
    target: { value: 'Rascunho' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Salvar e continuar' }))
  await screen.findByRole('alert')
  expect(
    screen.getByLabelText<HTMLInputElement>('Nome de exibição').value,
  ).toBe('Rascunho')
  expect(screen.getByRole('heading', { name: 'Perfil público' })).toBeTruthy()
})
it('saves privacy only after confirmation', async () => {
  show()
  skip()
  skip()
  skip()
  fireEvent.click(
    await screen.findByRole('checkbox', { name: /Ativar meu perfil público/ }),
  )
  fireEvent.click(screen.getByRole('radio', { name: 'Meus amigos' }))
  expect(mocks.updateProfile).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Salvar e continuar' }))
  await screen.findByRole('heading', { name: 'Conclusão' })
  expect(mocks.updateProfile).toHaveBeenCalledWith(
    1,
    { enabled: true, currentCoursesVisibility: 'FRIENDS' },
    expect.objectContaining({ getAccessToken: expect.any(Function) }),
  )
})
it('creates a Student for an eligible DAC account instead of patching', async () => {
  mocks.email = 'a123456@dac.unicamp.br'
  mocks.current.data.roles = ['STUDENT']
  show()
  fireEvent.change(await screen.findByLabelText('Nome acadêmico'), {
    target: { value: 'Aluno DAC' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Salvar e continuar' }))
  await screen.findByRole('heading', { name: 'Histórico' })
  expect(mocks.create).toHaveBeenCalledWith(
    1,
    expect.objectContaining({ ra: '123456', name: 'Aluno DAC' }),
    expect.any(Object),
  )
  expect(mocks.updateStudent).not.toHaveBeenCalled()
})
it('patches an existing academic profile', async () => {
  mocks.current.data.studentId = 5
  show()
  fireEvent.change(await screen.findByLabelText('Ano de ingresso'), {
    target: { value: '2026' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Salvar e continuar' }))
  await screen.findByRole('heading', { name: 'Histórico' })
  expect(mocks.updateStudent).toHaveBeenCalledWith(
    1,
    expect.objectContaining({ entryYear: 2026 }),
    expect.any(Object),
  )
  expect(mocks.create).not.toHaveBeenCalled()
})
it('keeps academic values and allows retry after rejection', async () => {
  mocks.email = 'a123456@dac.unicamp.br'
  mocks.current.data.roles = ['STUDENT']
  mocks.create.mockRejectedValueOnce(new Error('RA já vinculado'))
  show()
  fireEvent.change(await screen.findByLabelText('Nome acadêmico'), {
    target: { value: 'Aluno' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Salvar e continuar' }))
  await screen.findByText('RA já vinculado')
  expect(screen.getByLabelText<HTMLInputElement>('Nome acadêmico').value).toBe(
    'Aluno',
  )
  fireEvent.click(screen.getByRole('button', { name: 'Salvar e continuar' }))
  await screen.findByRole('heading', { name: 'Histórico' })
})
it('only completes explicitly and allows retry after failure', async () => {
  show()
  skip()
  skip()
  skip()
  skip()
  expect(mocks.completeWelcome).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Começar a usar o POMI' }))
  await screen.findByRole('alert')
  fireEvent.click(screen.getByRole('button', { name: 'Começar a usar o POMI' }))
  await waitFor(() => expect(mocks.completeWelcome).toHaveBeenCalledTimes(2))
})
it('can finish early without changing profile or academic data', async () => {
  show()
  fireEvent.click(screen.getByRole('button', { name: 'Configurar depois' }))
  await waitFor(() => expect(mocks.completeWelcome).toHaveBeenCalledOnce())
  expect(mocks.updateProfile).not.toHaveBeenCalled()
  expect(mocks.create).not.toHaveBeenCalled()
})
it('protects unsaved changes before finishing early', async () => {
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
  show()
  skip()
  skip()
  fireEvent.change(await screen.findByLabelText('Nome de exibição'), {
    target: { value: 'Rascunho' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Configurar depois' }))
  expect(confirm).toHaveBeenCalled()
  expect(mocks.completeWelcome).not.toHaveBeenCalled()
  confirm.mockRestore()
})
it('allows retrying account loading', () => {
  mocks.current.isError = true
  show()
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
  expect(mocks.refetch).toHaveBeenCalledOnce()
})
it('does not offer onboarding again for a completed account', () => {
  mocks.current.data.welcomePending = false
  show()
  expect(screen.queryByRole('button', { name: 'Configurar depois' })).toBeNull()
  expect(
    screen.getByRole('button', { name: 'Acessar minha conta' }),
  ).toBeTruthy()
})
