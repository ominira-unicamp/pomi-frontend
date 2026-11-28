import { useMutation } from '@tanstack/react-query'
import { Link, useBlocker } from '@tanstack/react-router'
import { useState } from 'react'
import type { ManagedGroupMembership } from '@ominira/pomi-sdk/generated/app'
import { groupApi } from '@/features/groups/data/groupApi'
import { displayLocalDateTime, preserveUnchangedInstant } from '@/features/groups/dateFields'
import { Failure } from '@/features/groups/EditorFeedback'
import { useGroupManagement } from '@/features/groups/GroupManagementLayout'
import { LocalDateTimeField } from '@/features/groups/LocalDateTimeField'
import { formatEventDate, formatGroupDate } from '@/features/groups/presentation'
import { PersonAvatar } from '@/media/IdentityImages'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState, LoadingState } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { peoplePath, useManagedMembers } from '@/features/groups/peopleManagementQueries'

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
  const { userId, group } = useGroupManagement()
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
    mutationFn: (body: Parameters<typeof groupApi.updateMember>[3]) =>
      groupApi.updateMember(
        userId,
        group.id,
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
  const { group, own, userId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const { query, allowed } = useManagedMembers()
  const [editing, setEditing] = useState<number | 'new'>()
  const [positionSaved, setPositionSaved] = useState(false)
  const member = query.data?.find((item) => item.id === membershipId)
  const canManage =
    own.permissions.includes('MEMBER_MANAGE') &&
    Boolean(member && !member.leftAt)
  const update = useMutation({
    mutationFn: (body: Parameters<typeof groupApi.updateMember>[3]) =>
      groupApi.updateMember(
        userId,
        group.id,
        membershipId,
        body,
        auth.getAccessToken,
      ),
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
