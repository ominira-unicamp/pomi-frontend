import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  GroupEventCreatePage,
  GroupEventDetailPage,
  GroupEventEditPage,
  GroupEventsManagementPage,
} from './GroupEventManagement'
import {
  GroupInvitePage,
  GroupMemberDetailPage,
  GroupPeopleManagementPage,
} from './GroupPeopleManagement'
import {
  GroupAccessManagementPage,
  GroupRoleAssignmentPage,
  GroupRoleDetailPage,
} from './GroupAccessManagement'
import type { ReactNode } from 'react'
import { ApiError } from '@/api/errors'

const mocks = vi.hoisted(() => ({
  context: {
    group: {
      id: 42,
      name: 'Coletivo',
      description: null,
      contacts: [],
      externalLinks: [],
      tags: [],
    },
    own: { id: 1, permissions: ['EVENT_CREATE'] as Array<string> },
    studentId: 7,
    refresh: vi.fn(),
  },
  events: vi.fn(),
  members: vi.fn(),
  roles: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  publishEvent: vi.fn(),
  cancelEvent: vi.fn(),
  invite: vi.fn(),
  managedInvitations: vi.fn(),
  updateMember: vi.fn(),
  searchPeople: vi.fn(),
  tags: vi.fn(),
  navigate: vi.fn(),
  auth: {
    sessionSubject: 'person-1',
    getAccessToken: vi.fn().mockResolvedValue('token'),
  },
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
  useBlocker: vi.fn(),
  useNavigate: () => mocks.navigate,
}))
vi.mock('./GroupManagementLayout', () => ({
  useGroupManagement: () => mocks.context,
}))
vi.mock('@/auth/AuthProvider', () => ({ useOptionalAuth: () => mocks.auth }))
vi.mock('./data/groupApi', () => ({
  groupApi: {
    managedEvents: mocks.events,
    managedMembers: mocks.members,
    roles: mocks.roles,
    createEvent: mocks.createEvent,
    updateEvent: mocks.updateEvent,
    publishEvent: mocks.publishEvent,
    cancelEvent: mocks.cancelEvent,
    invite: mocks.invite,
    managedInvitations: mocks.managedInvitations,
    updateMember: mocks.updateMember,
  },
}))
vi.mock('@/features/friends/studentSocialApi', () => ({
  searchPeople: mocks.searchPeople,
}))
vi.mock('@/api/client', () => ({
  pomiSdk: { app: { tags: { listAll: mocks.tags } } },
}))

const draft = {
  id: 50,
  groupId: 42,
  name: 'Oficina',
  description: 'Aprender juntos',
  startsAt: '2026-10-20T13:00:00.000Z',
  endsAt: null,
  location: null,
  tags: [],
  status: 'DRAFT',
}
const member = {
  id: 9,
  groupId: 42,
  studentId: 15,
  studentName: 'Ana',
  joinedAt: '2026-10-01T12:00:00Z',
  leftAt: null,
  isPublic: false,
  positions: [],
  roles: [],
  permissions: [],
}
const sentInvitation = {
  id: 12,
  groupId: 42,
  recipientStudentId: 15,
  recipientPublicId: 'person-2',
  recipientName: 'Bia',
  inviterStudentId: 7,
  status: 'PENDING',
  createdAt: '2026-10-01T00:00:00.000Z',
  expiresAt: '2099-10-20T00:00:00.000Z',
  respondedAt: null,
}
function renderPage(content: ReactNode) {
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
      {content}
    </QueryClientProvider>,
  )
}
beforeEach(() => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  mocks.context.own.permissions = ['EVENT_CREATE']
  mocks.context.refresh.mockReset()
  mocks.events.mockReset().mockResolvedValue([draft])
  mocks.members.mockReset().mockResolvedValue([member])
  mocks.roles
    .mockReset()
    .mockResolvedValue([
      { id: 4, groupId: 42, name: 'Gestão', permissions: ['ROLE_MANAGE'] },
    ])
  mocks.tags.mockReset().mockResolvedValue([])
  mocks.createEvent.mockReset().mockResolvedValue({ id: 51 })
  mocks.updateEvent.mockReset().mockResolvedValue(draft)
  mocks.publishEvent
    .mockReset()
    .mockResolvedValue({ ...draft, status: 'PUBLISHED' })
  mocks.cancelEvent
    .mockReset()
    .mockResolvedValue({ ...draft, status: 'CANCELLED' })
  mocks.invite.mockReset().mockResolvedValue({ id: 12 })
  mocks.managedInvitations.mockReset().mockResolvedValue([])
  mocks.updateMember.mockReset().mockResolvedValue(member)
  mocks.searchPeople.mockReset().mockResolvedValue({
    items: [{ publicId: 'person-2', displayName: 'Bia' }],
  })
  mocks.navigate.mockReset()
})

describe('event management by permission', () => {
  it('starts with a list and a create action only for EVENT_CREATE', async () => {
    renderPage(<GroupEventsManagementPage />)
    expect(await screen.findByText('Oficina')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Novo evento' })).toBeTruthy()
    expect(screen.queryByRole('textbox', { name: 'Nome' })).toBeNull()
  })
  it('shows real event states separately from future, past and undated dates', async () => {
    mocks.events.mockResolvedValue([
      {
        ...draft,
        id: 61,
        name: 'Evento passado',
        status: 'CANCELLED',
        startsAt: '2020-01-01T12:00:00.000Z',
      },
      { ...draft, id: 62, name: 'Sem data', status: 'DRAFT', startsAt: null },
      {
        ...draft,
        id: 63,
        name: 'Evento futuro',
        status: 'PUBLISHED',
        startsAt: '2099-01-01T12:00:00.000Z',
      },
    ])
    renderPage(<GroupEventsManagementPage />)
    expect(await screen.findByText('Evento futuro')).toBeTruthy()
    const links = screen.getAllByRole('link', { name: /Ver detalhes/ })
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/grupos/42/gerenciar/eventos/63',
      '/grupos/42/gerenciar/eventos/62',
      '/grupos/42/gerenciar/eventos/61',
    ])
    expect(links.map((link) => link.textContent)).toEqual([
      expect.stringContaining('Publicado · Futuro'),
      expect.stringContaining('Rascunho · Sem data definida'),
      expect.stringContaining('Cancelado · Passado'),
    ])
    fireEvent.change(
      screen.getByRole('combobox', { name: 'Mostrar eventos' }),
      {
        target: { value: 'CANCELLED' },
      },
    )
    expect(screen.getByText('Evento passado')).toBeTruthy()
    expect(screen.queryByText('Evento futuro')).toBeNull()
  })
  it('hides event actions when the administrative event read is denied', async () => {
    mocks.events.mockRejectedValue(new Error('Forbidden'))
    renderPage(<GroupEventsManagementPage />)
    expect(
      await screen.findByText('Não foi possível carregar os eventos'),
    ).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Novo evento' })).toBeNull()
    expect(
      screen.getByRole('button', { name: 'Verificar novamente' }),
    ).toBeTruthy()
  })
  it('distinguishes a new group from an empty status filter', async () => {
    mocks.events.mockResolvedValue([])
    const view = renderPage(<GroupEventsManagementPage />)
    expect(
      await screen.findByText(
        'Este grupo ainda não tem eventos. Comece criando um rascunho.',
      ),
    ).toBeTruthy()
    view.unmount()

    mocks.events.mockResolvedValue([draft])
    renderPage(<GroupEventsManagementPage />)
    expect(await screen.findByText('Oficina')).toBeTruthy()
    fireEvent.change(
      screen.getByRole('combobox', { name: 'Mostrar eventos' }),
      {
        target: { value: 'CANCELLED' },
      },
    )
    expect(screen.getByText('Nenhum evento neste estado.')).toBeTruthy()
    expect(screen.queryByText('Oficina')).toBeNull()
  })
  it('does not promise creation to a manager who can only edit', async () => {
    mocks.context.own.permissions = ['EVENT_EDIT']
    mocks.events.mockResolvedValue([])
    renderPage(<GroupEventsManagementPage />)
    expect(
      await screen.findByText(
        'Este grupo ainda não tem eventos disponíveis para gestão.',
      ),
    ).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Novo evento' })).toBeNull()
  })
  it('lets EVENT_CREATE save a draft and return to the list without edit actions', async () => {
    renderPage(<GroupEventCreatePage />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Nome' }), {
      target: { value: 'Nova oficina' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))
    await waitFor(() => expect(mocks.createEvent).toHaveBeenCalled())
    expect(await screen.findByText('Rascunho criado')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Ver eventos do grupo' }),
    ).toBeTruthy()
    expect(
      screen.queryByRole('link', { name: 'Ver detalhes do rascunho' }),
    ).toBeNull()
  })
  it('lets EVENT_PUBLISH publish a valid draft without edit controls', async () => {
    mocks.context.own.permissions = ['EVENT_PUBLISH']
    renderPage(<GroupEventDetailPage eventId={50} />)
    expect(
      await screen.findByRole('button', { name: 'Publicar evento' }),
    ).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Editar evento' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Publicar evento' }))
    await waitFor(() =>
      expect(mocks.publishEvent).toHaveBeenCalledWith(
        7,
        50,
        mocks.auth.getAccessToken,
      ),
    )
  })
  it('lets EVENT_EDIT save an existing event while preserving its instant', async () => {
    mocks.context.own.permissions = ['EVENT_EDIT']
    const original = { ...draft, startsAt: '2026-10-20T13:00:37.000Z' }
    mocks.events.mockResolvedValue([original])
    renderPage(<GroupEventEditPage eventId={50} />)
    expect(
      await screen.findByRole('button', { name: 'Salvar evento' }),
    ).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Publicar evento' })).toBeNull()
    fireEvent.change(screen.getByRole('textbox', { name: 'Descrição' }), {
      target: { value: 'Descrição revisada' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar evento' }))
    await waitFor(() =>
      expect(mocks.updateEvent).toHaveBeenCalledWith(
        7,
        50,
        expect.objectContaining({
          startsAt: original.startsAt,
          description: 'Descrição revisada',
        }),
        mocks.auth.getAccessToken,
      ),
    )
  })
  it('shows missing publication requirements and blocks an invalid draft', async () => {
    mocks.context.own.permissions = ['EVENT_PUBLISH']
    mocks.events.mockResolvedValue([
      { ...draft, description: '', startsAt: null },
    ])
    renderPage(<GroupEventDetailPage eventId={50} />)
    expect(
      await screen.findByText(
        /Para publicar, complete: descrição, data de início/,
      ),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'Publicar evento' })
        .hasAttribute('disabled'),
    ).toBe(true)
  })
  it('asks before cancelling a published event and hides edit controls', async () => {
    mocks.context.own.permissions = ['EVENT_PUBLISH']
    mocks.events.mockResolvedValue([{ ...draft, status: 'PUBLISHED' }])
    renderPage(<GroupEventDetailPage eventId={50} />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Cancelar evento' }),
    )
    expect(window.confirm).toHaveBeenCalled()
    await waitFor(() =>
      expect(mocks.cancelEvent).toHaveBeenCalledWith(
        7,
        50,
        mocks.auth.getAccessToken,
      ),
    )
    expect(screen.queryByRole('link', { name: 'Editar evento' })).toBeNull()
  })
})

describe('people and access management', () => {
  it('lists sent invitations and prevents inviting a person with a pending invitation', async () => {
    mocks.context.own.permissions = ['MEMBER_MANAGE']
    mocks.managedInvitations.mockResolvedValue([sentInvitation])
    const peoplePage = renderPage(<GroupPeopleManagementPage />)
    expect(await screen.findByText('Convites enviados')).toBeTruthy()
    expect(await screen.findByText('Bia')).toBeTruthy()
    expect(screen.getByText(/Pendente · Enviado em/)).toBeTruthy()

    peoplePage.unmount()
    renderPage(<GroupInvitePage />)
    expect(await screen.findByText('Convites enviados')).toBeTruthy()
    expect(await screen.findByText('Bia')).toBeTruthy()
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Buscar pessoa pelo nome' }),
      { target: { value: 'Bi' } },
    )
    expect(await screen.findByText('Convite pendente')).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'Selecionar' })
        .hasAttribute('disabled'),
    ).toBe(true)
    expect(screen.queryByRole('button', { name: 'Enviar convite' })).toBeNull()
    expect(mocks.invite).not.toHaveBeenCalled()
  })
  it('shows ROLE_MANAGE a readable member list and detail without membership mutations', async () => {
    mocks.context.own.permissions = ['ROLE_MANAGE']
    const view = renderPage(<GroupPeopleManagementPage />)
    expect(await screen.findByText('Ana')).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Convidar pessoa' })).toBeNull()
    view.rerender(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <GroupMemberDetailPage membershipId={9} />
      </QueryClientProvider>,
    )
    expect(await screen.findByText('Ana')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Adicionar cargo' })).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'Encerrar vínculo' }),
    ).toBeNull()
  })
  it('lets MEMBER_MANAGE select a person by name without showing an identifier field', async () => {
    mocks.context.own.permissions = ['MEMBER_MANAGE']
    mocks.managedInvitations
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValue([sentInvitation])
    renderPage(<GroupInvitePage />)
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Buscar pessoa pelo nome' }),
      { target: { value: 'Bi' } },
    )
    expect(await screen.findByText('Bia')).toBeTruthy()
    expect(screen.queryByRole('textbox', { name: /identificador/i })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enviar convite' }))
    await waitFor(() =>
      expect(mocks.invite).toHaveBeenCalledWith(
        7,
        42,
        'person-2',
        mocks.auth.getAccessToken,
      ),
    )
    expect(await screen.findByText(/Pendente · Enviado em/)).toBeTruthy()
    expect(mocks.managedInvitations).toHaveBeenCalledTimes(3)
  })
  it('rechecks sent invitations before posting when a different manager has already invited the person', async () => {
    mocks.context.own.permissions = ['MEMBER_MANAGE']
    mocks.managedInvitations
      .mockResolvedValueOnce([])
      .mockResolvedValue([sentInvitation])
    renderPage(<GroupInvitePage />)
    expect(await screen.findByText('Nenhum convite enviado.')).toBeTruthy()
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Buscar pessoa pelo nome' }),
      { target: { value: 'Bi' } },
    )
    fireEvent.click(await screen.findByRole('button', { name: 'Selecionar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enviar convite' }))
    expect(
      await screen.findByText(
        'Já existe um convite pendente para essa pessoa neste grupo.',
      ),
    ).toBeTruthy()
    expect(await screen.findByText('Convite pendente')).toBeTruthy()
    expect(mocks.invite).not.toHaveBeenCalled()
  })
  it('explains an existing pending invitation and allows inviting another person', async () => {
    mocks.context.own.permissions = ['MEMBER_MANAGE']
    mocks.managedInvitations
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValue([sentInvitation])
    mocks.searchPeople.mockResolvedValue({
      items: [
        { publicId: 'person-2', displayName: 'Bia' },
        { publicId: 'person-3', displayName: 'Caio' },
      ],
    })
    mocks.invite.mockRejectedValueOnce(
      new ApiError(409, {
        type: 'urn:pomi:problem:conflict',
        title: 'Conflito ao concluir a ação',
        status: 409,
        detail: 'Já existe convite pendente.',
      }),
    )
    renderPage(<GroupInvitePage />)
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Buscar pessoa pelo nome' }),
      { target: { value: 'Bi' } },
    )
    expect(await screen.findByText('Bia')).toBeTruthy()
    fireEvent.click(screen.getAllByRole('button', { name: 'Selecionar' })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Enviar convite' }))
    expect(
      await screen.findByText(
        'Já existe um convite pendente para essa pessoa neste grupo.',
      ),
    ).toBeTruthy()
    expect(await screen.findByText('Convite pendente')).toBeTruthy()
    expect(mocks.managedInvitations).toHaveBeenCalledTimes(3)
    expect(
      screen
        .getByRole('button', { name: 'Enviar convite' })
        .hasAttribute('disabled'),
    ).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar' }))
    expect(screen.queryByRole('alert')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Enviar convite' }))
    await waitFor(() =>
      expect(mocks.invite).toHaveBeenLastCalledWith(
        7,
        42,
        'person-3',
        mocks.auth.getAccessToken,
      ),
    )
  })
  it('adds a public position with optional Brazilian date and time fields', async () => {
    mocks.context.own.permissions = ['MEMBER_MANAGE']
    renderPage(<GroupMemberDetailPage membershipId={9} />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Adicionar cargo' }),
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Nome do cargo' }), {
      target: { value: 'Presidência' },
    })
    fireEvent.change(
      screen.getByRole('textbox', {
        name: 'Início (opcional): data (dd/mm/aaaa)',
      }),
      { target: { value: '20/10/2026' } },
    )
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Início (opcional): hora (hh:mm)' }),
      { target: { value: '00:00' } },
    )
    fireEvent.click(screen.getByRole('button', { name: 'Salvar cargo' }))
    await waitFor(() =>
      expect(mocks.updateMember).toHaveBeenCalledWith(
        7,
        9,
        {
          positions: {
            add: [
              {
                title: 'Presidência',
                startedAt: expect.any(String),
                endedAt: null,
              },
            ],
          },
        },
        mocks.auth.getAccessToken,
      ),
    )
    expect(await screen.findByText('Cargo público salvo.')).toBeTruthy()
  })
  it('shows role summaries first and assigns a role in a distinct context', async () => {
    mocks.context.own.permissions = ['ROLE_MANAGE']
    const view = renderPage(<GroupAccessManagementPage />)
    expect(await screen.findByText('Gestão')).toBeTruthy()
    expect(screen.queryByRole('checkbox')).toBeNull()
    view.rerender(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <GroupRoleAssignmentPage membershipId={9} />
      </QueryClientProvider>,
    )
    expect(
      await screen.findByRole('button', { name: 'Atribuir função' }),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Atribuir função' }))
    await waitFor(() =>
      expect(mocks.updateMember).toHaveBeenCalledWith(
        7,
        9,
        { roles: { add: [4] } },
        mocks.auth.getAccessToken,
      ),
    )
  })
  it('does not offer deletion while a function is assigned', async () => {
    mocks.context.own.permissions = ['ROLE_MANAGE']
    mocks.members.mockResolvedValue([
      { ...member, roles: [{ id: 4, name: 'Gestão' }] },
    ])
    renderPage(<GroupRoleDetailPage roleId={4} />)
    expect(
      await screen.findByRole('button', { name: 'Excluir função' }),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: 'Excluir função' })
        .hasAttribute('disabled'),
    ).toBe(true)
  })
  it('explains a rejected removal of the last access manager', async () => {
    mocks.context.own.permissions = ['ROLE_MANAGE']
    mocks.members.mockResolvedValue([
      { ...member, roles: [{ id: 4, name: 'Gestão' }] },
    ])
    mocks.updateMember.mockRejectedValueOnce(new Error('last manager'))
    renderPage(<GroupRoleAssignmentPage membershipId={9} />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Remover função' }),
    )
    expect(
      await screen.findByText(/última pessoa capaz de gerenciar acessos/),
    ).toBeTruthy()
  })
})
