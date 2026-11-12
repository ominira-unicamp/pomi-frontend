import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ApiError } from '@ominira/pomi-sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminFeedbackReportsPage } from './AdminFeedbackReportsPage'
import {
  listAdminFeedbackReports,
  updateAdminFeedbackReport,
} from './feedbackReportApi'
import type { FeedbackReport } from './feedbackReportApi'
import { AdminAccess } from '@/features/administration'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const state = vi.hoisted(() => ({
  authenticated: true,
  initialized: true,
  roles: ['ADMIN'],
  pending: false,
  failed: false,
  login: vi.fn(),
  refetch: vi.fn(),
}))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    initialized: state.initialized,
    isAuthenticated: state.authenticated,
    sessionSubject: 'admin-session',
    getAccessToken: () => Promise.resolve('token'),
    login: state.login,
  }),
}))
vi.mock('@/features/identity', () => ({
  useCurrentUser: () => ({
    data: { roles: state.roles, userId: 7, studentId: null },
    isPending: state.pending,
    isError: state.failed,
    refetch: state.refetch,
  }),
}))
vi.mock('./feedbackReportApi', () => ({
  listAdminFeedbackReports: vi.fn(),
  updateAdminFeedbackReport: vi.fn(),
}))
const first: FeedbackReport = {
  id: 1,
  kind: 'BUG',
  target: { type: 'GENERAL' },
  title: 'Falha na inscrição',
  description: 'Uma descrição completa do problema encontrado.',
  status: 'OPEN',
  adminMessage: null,
  sourcePath: '/cursos',
  reporterUserId: null,
  createdAt: '2026-11-01T10:00:00Z',
  updatedAt: '2026-11-01T10:00:00Z',
}
const closed: FeedbackReport = {
  ...first,
  id: 2,
  title: 'Sugestão encerrada',
  kind: 'SUGGESTION',
  status: 'CLOSED',
  adminMessage: 'Resolvido.',
  reporterUserId: 12,
}
const list = vi.mocked(listAdminFeedbackReports)
const update = vi.mocked(updateAdminFeedbackReport)
function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const view = render(
    <QueryClientProvider client={client}>
      <AdminAccess>
        <AdminFeedbackReportsPage />
      </AdminAccess>
    </QueryClientProvider>,
  )
  return { client, ...view }
}
async function openFirst() {
  fireEvent.click(
    await screen.findByRole('button', { name: /Falha na inscrição/ }),
  )
  return screen.findByRole('dialog')
}
beforeEach(() => {
  vi.clearAllMocks()
  Element.prototype.scrollIntoView = vi.fn()
  Object.assign(state, {
    authenticated: true,
    initialized: true,
    roles: ['ADMIN'],
    pending: false,
    failed: false,
  })
  list.mockResolvedValue([first, closed])
  update.mockImplementation((id, body) =>
    Promise.resolve({
      ...(id === 1 ? first : closed),
      ...body,
    }),
  )
})
describe('feedback administration', () => {
  it.each(['visitor', 'ordinary', 'loading', 'identity-error'])(
    'does not request feedback for %s',
    (mode) => {
      if (mode === 'visitor') state.authenticated = false
      if (mode === 'ordinary') state.roles = []
      if (mode === 'loading') state.pending = true
      if (mode === 'identity-error') state.failed = true
      setup()
      expect(list).not.toHaveBeenCalled()
      if (mode === 'visitor') {
        fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
        expect(state.login).toHaveBeenCalled()
      }
      if (mode === 'ordinary')
        expect(
          screen.getByText('Acesso restrito a administradores'),
        ).toBeTruthy()
    },
  )
  it('loads without a student profile and filters by status, type and accent-insensitive search', async () => {
    setup()
    await screen.findByRole('button', { name: /Falha na inscrição/ })
    expect(
      screen.queryByRole('button', { name: /Sugestão encerrada/ }),
    ).toBeNull()
    await chooseFilter('Status', 'Todos')
    expect(
      screen.getByRole('button', { name: /Sugestão encerrada/ }),
    ).toBeTruthy()
    await chooseFilter('Tipo', 'Sugestão')
    expect(
      screen.queryByRole('button', { name: /Falha na inscrição/ }),
    ).toBeNull()
    await chooseFilter('Tipo', 'Todos os tipos')
    fireEvent.change(screen.getByLabelText('Buscar feedbacks'), {
      target: { value: 'inscricao' },
    })
    expect(
      screen.getByRole('button', { name: /Falha na inscrição/ }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('button', { name: /Sugestão encerrada/ }),
    ).toBeNull()
  })
  it('shows complete details and confirms closing without a message, removing it from pending', async () => {
    setup()
    await openFirst()
    expect(screen.getByText(first.description)).toBeTruthy()
    expect(screen.getByText('Anônimo')).toBeTruthy()
    expect(screen.getByText('/cursos')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Encerrar' }))
    expect(update).not.toHaveBeenCalled()
    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar encerramento' }),
    )
    await waitFor(() =>
      expect(update).toHaveBeenCalledWith(
        1,
        { status: 'CLOSED' },
        expect.any(Function),
      ),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
  it('marks in progress and saves only modified fields', async () => {
    setup()
    await openFirst()
    fireEvent.change(screen.getByLabelText('Mensagem da equipe (opcional)'), {
      target: { value: ' Estamos verificando. ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Marcar em análise' }))
    await waitFor(() =>
      expect(update).toHaveBeenCalledWith(
        1,
        { status: 'IN_PROGRESS', adminMessage: 'Estamos verificando.' },
        expect.any(Function),
      ),
    )
  })
  it('reopens and removes an existing response with null', async () => {
    setup()
    await screen.findByRole('button', { name: /Falha na inscrição/ })
    await chooseFilter('Status', 'Encerrados')
    fireEvent.click(screen.getByRole('button', { name: /Sugestão encerrada/ }))
    expect(screen.getByText('Usuário #12')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Mensagem da equipe (opcional)'), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Reabrir' }))
    await waitFor(() =>
      expect(update).toHaveBeenCalledWith(
        2,
        { status: 'OPEN', adminMessage: null },
        expect.any(Function),
      ),
    )
  })
  it('blocks repeated submissions and preserves the draft on failure', async () => {
    let reject!: (error: Error) => void
    update.mockReturnValue(
      new Promise((_, fail) => {
        reject = fail
      }),
    )
    setup()
    await openFirst()
    const input = screen.getByLabelText<HTMLTextAreaElement>(
      'Mensagem da equipe (opcional)',
    )
    fireEvent.change(input, { target: { value: 'Resposta mantida' } })
    const save = screen.getByRole('button', { name: 'Salvar mensagem' })
    fireEvent.click(save)
    fireEvent.click(save)
    expect(update).toHaveBeenCalledTimes(1)
    expect((save as HTMLButtonElement).disabled).toBe(true)
    reject(new Error('offline'))
    await screen.findByText(
      'Não foi possível atualizar o feedback. Tente novamente.',
    )
    expect(input.value).toBe('Resposta mantida')
  })
  it.each([401, 403])(
    'hides and clears private reports after HTTP %s',
    async (status) => {
      update.mockRejectedValue(new ApiError(status))
      const { client } = setup()
      await openFirst()
      fireEvent.click(screen.getByRole('button', { name: 'Marcar em análise' }))
      await screen.findByText(
        status === 401
          ? 'Sessão expirada'
          : 'Acesso restrito a administradores',
      )
      expect(screen.queryByRole('dialog')).toBeNull()
      await waitFor(() =>
        expect(
          client.getQueryData(
            privateQueryKeys.adminFeedbackReports('admin-session'),
          ),
        ).toBeUndefined(),
      )
    },
  )
  it('handles a removed feedback by closing and refreshing', async () => {
    update.mockRejectedValue(new ApiError(404))
    setup()
    await openFirst()
    fireEvent.click(screen.getByRole('button', { name: 'Marcar em análise' }))
    await screen.findByText('Este feedback não está mais disponível.')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(list.mock.calls.length).toBeGreaterThan(1)
  })
})

async function chooseFilter(label: string, option: string) {
  fireEvent.click(screen.getByRole('combobox', { name: label }))
  fireEvent.click(
    await screen.findByRole('option', { name: option }),
  )
}
