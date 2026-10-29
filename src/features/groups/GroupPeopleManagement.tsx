import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useBlocker } from '@tanstack/react-router'
import { useState } from 'react'

import { groupApi } from './data/groupApi'
import { displayLocalDateTime, preserveUnchangedInstant } from './dateFields'
import { Failure } from './EditorFeedback'
import { useGroupManagement } from './GroupManagementLayout'
import { LocalDateTimeField } from './LocalDateTimeField'
import { formatEventDate, formatGroupDate } from './presentation'
import type {
  ManagedGroupInvitation,
  ManagedGroupMembership,
} from '@ominira/pomi-sdk/generated/app'
import { PersonAvatar } from '@/features/media/IdentityImages'
import { ApiError } from '@/api/errors'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState, LoadingState } from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { searchPeople } from '@/features/friends/studentSocialApi'

const peoplePath = '/grupos/$groupId/gerenciar/pessoas'

function inviteConflict(error: unknown) {
  if (!(error instanceof ApiError) || error.status !== 409) return undefined
  if (error.problem?.detail === 'Já existe convite pendente.')
    return 'Já existe um convite pendente para essa pessoa neste grupo.'
  if (error.problem?.detail === 'A pessoa já é membro.')
    return 'Essa pessoa já faz parte do grupo.'
  return undefined
}

function useManagedMembers() {
  const { group, own, studentId } = useGroupManagement()
  const auth = useOptionalAuth()
  const allowed =
    own.permissions.includes('MEMBER_MANAGE') ||
    own.permissions.includes('ROLE_MANAGE')
  const query = useQuery({
    queryKey: ['private', auth.sessionSubject, 'groups', group.id, 'members'],
    queryFn: () =>
      groupApi.managedMembers(studentId, group.id, auth.getAccessToken),
    enabled: allowed,
    retry: false,
  })
  return { query, allowed }
}

function useManagedInvitations() {
  const { group, own, studentId } = useGroupManagement()
  const auth = useOptionalAuth()
  return useQuery({
    queryKey: [
      'private',
      auth.sessionSubject,
      'groups',
      group.id,
      'invitations',
    ],
    queryFn: () =>
      groupApi.managedInvitations(studentId, group.id, auth.getAccessToken),
    enabled: own.permissions.includes('MEMBER_MANAGE'),
    refetchOnMount: 'always',
    retry: false,
  })
}

function invitationStatus(invitation: ManagedGroupInvitation) {
  if (invitation.status === 'PENDING') return 'Pendente'
  return {
    ACCEPTED: 'Aceito',
    DECLINED: 'Recusado',
    CANCELLED: 'Cancelado',
    EXPIRED: 'Expirado',
  }[invitation.status]
}

function hasPendingInvitation(invitation: ManagedGroupInvitation) {
  return (
    invitation.status === 'PENDING' &&
    new Date(invitation.expiresAt).getTime() > Date.now()
  )
}

function SentInvitations({
  invitations,
}: {
  invitations: ReturnType<typeof useManagedInvitations>
}) {
  const pending = invitations.data?.filter(hasPendingInvitation) ?? []
  const history =
    invitations.data?.filter(
      (invitation) => !hasPendingInvitation(invitation),
    ) ?? []
  return (
    <section className="border-t border-border pt-6">
      <h3 className="mb-3 text-lg font-extrabold">Convites enviados</h3>
      {invitations.isPending ? (
        <LoadingState label="Carregando convites enviados" />
      ) : invitations.isError ? (
        <div className="space-y-2">
          <Failure message="Não foi possível carregar os convites enviados." />
          <Button variant="outline" onClick={() => void invitations.refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : invitations.data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum convite enviado.</p>
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground">
            {pending.length}{' '}
            {pending.length === 1 ? 'convite pendente' : 'convites pendentes'}
          </p>
          <ul className="divide-y divide-border rounded-md border border-border">
            {[...pending, ...history].map((invitation) => (
              <li key={invitation.id} className="p-4">
                <p className="flex items-center gap-3 font-bold">
                  <PersonAvatar
                    mediaId={invitation.recipientAvatarMediaId}
                    name={invitation.recipientName}
                    size="small"
                  />
                  {invitation.recipientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invitationStatus(invitation)} · Enviado em{' '}
                  {formatGroupDate(invitation.createdAt)}
                  {hasPendingInvitation(invitation) &&
                    ` · Válido até ${formatGroupDate(invitation.expiresAt)}`}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export function GroupPeopleManagementPage() {
  const { group, own } = useGroupManagement()
  const { query, allowed } = useManagedMembers()
  const invitations = useManagedInvitations()
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não tem permissão para consultar os vínculos deste grupo."
      />
    )
  const active = query.data?.filter((member) => !member.leftAt) ?? []
  const history = query.data?.filter((member) => member.leftAt) ?? []
  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Pessoas e convites</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cargos públicos descrevem a atuação. Funções de gestão definem
            acessos.
          </p>
        </div>
        {own.permissions.includes('MEMBER_MANAGE') && (
          <Link
            to="/grupos/$groupId/gerenciar/pessoas/convidar"
            params={{ groupId: String(group.id) }}
            className={buttonVariants()}
          >
            Convidar pessoa
          </Link>
        )}
      </div>
      {own.permissions.includes('MEMBER_MANAGE') && (
        <SentInvitations invitations={invitations} />
      )}
      {query.isPending ? (
        <LoadingState label="Carregando membros" />
      ) : query.isError ? (
        <Failure message="Não foi possível carregar os membros." />
      ) : (
        <>
          <h3 className="text-lg font-extrabold">Participações ativas</h3>
          {active.length ? (
            <ul className="divide-y divide-border rounded-md border border-border">
              {active.map((member) => (
                <li
                  key={member.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <p className="flex items-center gap-3 font-bold">
                      <PersonAvatar
                        mediaId={member.avatarMediaId}
                        name={member.studentName}
                        size="small"
                      />
                      {member.studentName}
                    </p>
                    {member.positions.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {member.positions
                          .map((position) => position.title)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <Link
                    to="/grupos/$groupId/gerenciar/pessoas/$membershipId"
                    params={{
                      groupId: String(group.id),
                      membershipId: String(member.id),
                    }}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })}
                  >
                    Ver vínculo
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma participação ativa.
            </p>
          )}
          {history.length > 0 && (
            <section className="border-t border-border pt-6">
              <h3 className="mb-3 text-lg font-extrabold">
                Histórico de vínculos
              </h3>
              <ul className="space-y-2">
                {history.map((member) => (
                  <li key={member.id}>
                    <Link
                      to="/grupos/$groupId/gerenciar/pessoas/$membershipId"
                      params={{
                        groupId: String(group.id),
                        membershipId: String(member.id),
                      }}
                      className="pomi-focus text-sm font-bold text-primary hover:underline"
                    >
                      <PersonAvatar
                        mediaId={member.avatarMediaId}
                        name={member.studentName}
                        size="small"
                      />{' '}
                      {member.studentName} · Vínculo encerrado
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </section>
  )
}

export function GroupInvitePage() {
  const { group, own, studentId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const invitations = useManagedInvitations()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<{
    publicId: string
    displayName: string
    avatarMediaId: string | null
  }>()
  const people = useQuery({
    queryKey: [
      'private',
      auth.sessionSubject,
      'group-invite-people',
      search.trim(),
    ],
    queryFn: () => searchPeople(studentId, search.trim(), auth.getAccessToken),
    enabled:
      own.permissions.includes('MEMBER_MANAGE') && search.trim().length >= 2,
  })
  const invite = useMutation({
    mutationFn: async (recipientPublicId: string) => {
      const current = await invitations.refetch()
      if (current.isError || !current.data)
        throw new Error('Não foi possível verificar os convites enviados.')
      if (
        current.data.some(
          (invitation) =>
            invitation.recipientPublicId === recipientPublicId &&
            hasPendingInvitation(invitation),
        )
      )
        throw new ApiError(409, {
          type: 'urn:pomi:problem:conflict',
          title: 'Conflito ao concluir a ação',
          status: 409,
          detail: 'Já existe convite pendente.',
        })
      return groupApi.invite(
        studentId,
        group.id,
        recipientPublicId,
        auth.getAccessToken,
      )
    },
    onSuccess: () => {
      setSelected(undefined)
      setSearch('')
      void invitations.refetch()
      refresh()
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409)
        void invitations.refetch()
    },
  })
  const conflict = invite.isError ? inviteConflict(invite.error) : undefined
  const pendingRecipients = new Set(
    (invitations.data ?? [])
      .filter(hasPendingInvitation)
      .map((invitation) => invitation.recipientPublicId),
  )
  const selectedHasPendingInvitation = selected
    ? pendingRecipients.has(selected.publicId)
    : false
  const selectedHasConflict =
    Boolean(conflict) && invite.variables === selected?.publicId
  if (!own.permissions.includes('MEMBER_MANAGE'))
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não pode enviar convites para este grupo."
      />
    )
  return (
    <section className="max-w-2xl space-y-5">
      <Link
        to={peoplePath}
        params={{ groupId: String(group.id) }}
        className="pomi-focus text-sm font-bold text-primary hover:underline"
      >
        ← Pessoas e convites
      </Link>
      <h2 className="text-2xl font-extrabold">Convidar pessoa</h2>
      <p className="text-sm text-muted-foreground">
        A pessoa poderá aceitar ou recusar o convite. Ao aceitar, seu vínculo
        começa privado.
      </p>
      <SentInvitations invitations={invitations} />
      <label className="block text-sm font-bold">
        Buscar pessoa pelo nome
        <Input
          value={search}
          placeholder="Digite pelo menos 2 letras"
          onChange={(e) => {
            setSearch(e.target.value)
            setSelected(undefined)
            invite.reset()
          }}
        />
      </label>
      {people.isPending && search.trim().length >= 2 && (
        <LoadingState label="Buscando pessoas" />
      )}
      {people.isError && <Failure message="Não foi possível buscar pessoas." />}
      {people.data && (
        <ul className="divide-y divide-border rounded-md border border-border">
          {people.data.items.length === 0 && (
            <li className="p-4 text-sm text-muted-foreground">
              Nenhuma pessoa encontrada.
            </li>
          )}
          {people.data.items.map((person) => (
            <li
              key={person.publicId}
              className="flex items-center justify-between gap-3 p-3"
            >
              <span className="flex items-center gap-3 font-semibold">
                <PersonAvatar
                  mediaId={person.avatarMediaId}
                  name={person.displayName}
                  size="small"
                />
                {person.displayName}
              </span>
              {pendingRecipients.has(person.publicId) && (
                <span className="text-sm text-muted-foreground">
                  Convite pendente
                </span>
              )}
              <Button
                type="button"
                size="sm"
                disabled={
                  invitations.isPending ||
                  invitations.isFetching ||
                  invitations.isError ||
                  pendingRecipients.has(person.publicId)
                }
                variant={
                  selected?.publicId === person.publicId ? 'default' : 'outline'
                }
                aria-pressed={selected?.publicId === person.publicId}
                onClick={() => {
                  setSelected({
                    publicId: person.publicId,
                    displayName: person.displayName,
                    avatarMediaId: person.avatarMediaId,
                  })
                  if (selected?.publicId !== person.publicId) invite.reset()
                }}
              >
                {selected?.publicId === person.publicId
                  ? 'Selecionada'
                  : 'Selecionar'}
              </Button>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <div className="space-y-3 rounded-md border border-border p-4">
          <p>
            <PersonAvatar
              mediaId={selected.avatarMediaId}
              name={selected.displayName}
            />{' '}
            Convidar <strong>{selected.displayName}</strong>?
          </p>
          <Button
            disabled={
              invite.isPending ||
              invitations.isPending ||
              invitations.isFetching ||
              invitations.isError ||
              selectedHasPendingInvitation ||
              selectedHasConflict
            }
            onClick={() => invite.mutate(selected.publicId)}
          >
            {invite.isPending ? 'Enviando...' : 'Enviar convite'}
          </Button>
        </div>
      )}
      {invite.isSuccess && (
        <p role="status">
          Convite enviado. A pessoa poderá responder antes do prazo de
          expiração.
        </p>
      )}
      {invite.isError && (
        <Failure
          message={
            conflict ?? 'Não foi possível enviar o convite. Tente novamente.'
          }
        />
      )}
    </section>
  )
}

type Position = ManagedGroupMembership['positions'][number]
function PositionForm({
  membership,
  position,
  onClose,
  onSaved,
}: {
  membership: ManagedGroupMembership
  position?: Position
  onClose: () => void
  onSaved: () => void
}) {
  const { studentId } = useGroupManagement()
  const auth = useOptionalAuth()
  const start = displayLocalDateTime(position?.startedAt ?? null)
  const end = displayLocalDateTime(position?.endedAt ?? null)
  const [title, setTitle] = useState(position?.title ?? '')
  const [startDate, setStartDate] = useState(start.date)
  const [startTime, setStartTime] = useState(start.time)
  const [endDate, setEndDate] = useState(end.date)
  const [endTime, setEndTime] = useState(end.time)
  const [error, setError] = useState('')
  const dirty =
    title !== (position?.title ?? '') ||
    startDate !== start.date ||
    startTime !== start.time ||
    endDate !== end.date ||
    endTime !== end.time
  useBlocker({
    disabled: !dirty,
    enableBeforeUnload: dirty,
    shouldBlockFn: () =>
      !window.confirm('Descartar alterações não salvas do cargo?'),
  })
  const save = useMutation({
    mutationFn: (body: Parameters<typeof groupApi.updateMember>[2]) =>
      groupApi.updateMember(
        studentId,
        membership.id,
        body,
        auth.getAccessToken,
      ),
    onSuccess: () => {
      onSaved()
      onClose()
    },
  })
  return (
    <form
      className="space-y-4 rounded-md border border-border p-4"
      onSubmit={(submit) => {
        submit.preventDefault()
        const begins = preserveUnchangedInstant(
          startDate,
          startTime,
          position?.startedAt ?? null,
        )
        const ends = preserveUnchangedInstant(
          endDate,
          endTime,
          position?.endedAt ?? null,
        )
        if (begins.error || ends.error) {
          setError(
            begins.error ? `Início: ${begins.error}` : `Fim: ${ends.error}`,
          )
          return
        }
        if (
          begins.value &&
          ends.value &&
          new Date(ends.value) < new Date(begins.value)
        ) {
          setError('O fim não pode anteceder o início.')
          return
        }
        setError('')
        const value = {
          title: title.trim(),
          startedAt: begins.value,
          endedAt: ends.value,
        }
        save.mutate(
          position
            ? { positions: { update: [{ id: position.id, ...value }] } }
            : { positions: { add: [value] } },
        )
      }}
    >
      <h4 className="font-extrabold">
        {position ? 'Editar cargo público' : 'Adicionar cargo público'}
      </h4>
      <label className="block text-sm font-bold">
        Nome do cargo
        <Input
          value={title}
          maxLength={120}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <LocalDateTimeField
          label="Início (opcional)"
          date={startDate}
          time={startTime}
          onDateChange={setStartDate}
          onTimeChange={setStartTime}
        />
        <LocalDateTimeField
          label="Fim (opcional)"
          date={endDate}
          time={endTime}
          onDateChange={setEndDate}
          onTimeChange={setEndTime}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {save.isError && (
        <Failure message="Não foi possível salvar o cargo. Confira os dados e sua permissão." />
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={save.isPending || !title.trim()}>
          Salvar cargo
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Fechar edição
        </Button>
      </div>
    </form>
  )
}

export function GroupMemberDetailPage({
  membershipId,
}: {
  membershipId: number
}) {
  const { group, own, studentId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const { query, allowed } = useManagedMembers()
  const [editing, setEditing] = useState<number | 'new'>()
  const [positionSaved, setPositionSaved] = useState(false)
  const member = query.data?.find((item) => item.id === membershipId)
  const canManage =
    own.permissions.includes('MEMBER_MANAGE') &&
    Boolean(member && !member.leftAt)
  const update = useMutation({
    mutationFn: (body: Parameters<typeof groupApi.updateMember>[2]) =>
      groupApi.updateMember(studentId, membershipId, body, auth.getAccessToken),
    onSuccess: refresh,
  })
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não pode consultar este vínculo."
      />
    )
  if (query.isPending) return <LoadingState label="Carregando vínculo" />
  if (query.isError || !member)
    return (
      <ErrorState
        title="Vínculo indisponível"
        description="Confira o endereço ou sua permissão."
      />
    )
  return (
    <section className="max-w-3xl space-y-7">
      <Link
        to={peoplePath}
        params={{ groupId: String(group.id) }}
        className="pomi-focus text-sm font-bold text-primary hover:underline"
      >
        ← Pessoas e convites
      </Link>
      <div>
        <h2 className="flex items-center gap-3 text-2xl font-extrabold">
          <PersonAvatar
            mediaId={member.avatarMediaId}
            name={member.studentName}
          />
          {member.studentName}
        </h2>
        <p className="text-sm text-muted-foreground">
          {member.leftAt
            ? `Vínculo encerrado em ${formatGroupDate(member.leftAt)}`
            : `Participa desde ${formatGroupDate(member.joinedAt)}`}{' '}
          · {member.isPublic ? 'Participação pública' : 'Participação privada'}
        </p>
      </div>
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold">Cargos públicos</h3>
          {canManage && editing === undefined && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing('new')}
            >
              Adicionar cargo
            </Button>
          )}
        </div>
        {member.positions.length ? (
          <ul className="space-y-2">
            {member.positions.map((position) => (
              <li
                key={position.id}
                className="rounded-md border border-border p-4"
              >
                <p className="font-bold">{position.title}</p>
                <p className="text-sm text-muted-foreground">
                  {position.startedAt
                    ? formatEventDate(position.startedAt)
                    : 'Início não informado'}{' '}
                  ·{' '}
                  {position.endedAt
                    ? formatEventDate(position.endedAt)
                    : 'Fim não informado'}
                </p>
                {canManage && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(position.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={update.isPending}
                      onClick={() => {
                        if (
                          window.confirm(`Remover o cargo ${position.title}?`)
                        )
                          update.mutate({
                            positions: { remove: [position.id] },
                          })
                      }}
                    >
                      Remover cargo
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum cargo público informado.
          </p>
        )}
        {editing !== undefined && (
          <PositionForm
            key={String(editing)}
            membership={member}
            position={
              editing === 'new'
                ? undefined
                : member.positions.find((position) => position.id === editing)
            }
            onClose={() => setEditing(undefined)}
            onSaved={() => {
              setPositionSaved(true)
              refresh()
            }}
          />
        )}
        {positionSaved && (
          <p role="status" className="text-sm font-semibold">
            Cargo público salvo.
          </p>
        )}
      </section>
      <section className="border-t border-border pt-6">
        <h3 className="text-lg font-extrabold">Funções de gestão</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Funções concedem permissões; cargos públicos não concedem acesso.
        </p>
        <p className="mt-2 text-sm">
          {member.roles.map((role) => role.name).join(', ') ||
            'Nenhuma função atribuída'}
        </p>
        {own.permissions.includes('ROLE_MANAGE') && (
          <Link
            to="/grupos/$groupId/gerenciar/acessos/atribuicoes/$membershipId"
            params={{
              groupId: String(group.id),
              membershipId: String(member.id),
            }}
            className="pomi-focus mt-2 inline-block text-sm font-bold text-primary hover:underline"
          >
            Gerenciar funções desta pessoa
          </Link>
        )}
      </section>
      {canManage && (
        <section className="border-t border-border pt-6">
          <h3 className="text-lg font-extrabold">Encerrar vínculo</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            A pessoa deixará de fazer parte do grupo. Cargos e funções atuais
            deixarão de valer. Esta operação não é uma edição de cargo.
          </p>
          <Button
            className="mt-3"
            variant="outline"
            disabled={update.isPending}
            onClick={() => {
              if (
                window.confirm(
                  `Encerrar o vínculo de ${member.studentName} com ${group.name}?`,
                )
              )
                update.mutate({ leave: true })
            }}
          >
            {member.id === own.id ? 'Sair do grupo' : 'Encerrar vínculo'}
          </Button>
        </section>
      )}
      {update.isSuccess && <p role="status">Vínculo atualizado.</p>}
      {update.isError && (
        <Failure message="Não foi possível atualizar o vínculo. A última pessoa capaz de gerenciar acessos não pode perder essa capacidade." />
      )}
    </section>
  )
}
