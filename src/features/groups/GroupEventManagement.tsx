import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useBlocker, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'

import { groupApi } from './data/groupApi'
import { displayLocalDateTime, preserveUnchangedInstant } from './dateFields'
import { Failure } from './EditorFeedback'
import { useGroupManagement } from './GroupManagementLayout'
import { LocalDateTimeField } from './LocalDateTimeField'
import { formatEventDate } from './presentation'
import type { ManagedGroupEvent, Tag } from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'
import { ApiError } from '@/api/errors'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState, LoadingState } from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const statusLabel = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  CANCELLED: 'Cancelado',
} as const
const eventsPath = '/grupos/$groupId/gerenciar/eventos'

function eventTime(event: ManagedGroupEvent, now: number) {
  if (!event.startsAt) return { order: 1, label: 'Sem data definida', time: 0 }
  const time = new Date(event.startsAt).getTime()
  return time >= now
    ? { order: 0, label: 'Futuro', time }
    : { order: 2, label: 'Passado', time }
}

function EventBack({ groupId }: { groupId: number }) {
  return (
    <Link
      to={eventsPath}
      params={{ groupId: String(groupId) }}
      className="pomi-focus text-sm font-bold text-primary hover:underline"
    >
      ← Eventos do grupo
    </Link>
  )
}

function useManagedEvents() {
  const { group, studentId, own } = useGroupManagement()
  const auth = useOptionalAuth()
  const allowed = own.permissions.some((permission) =>
    permission.startsWith('EVENT_'),
  )
  const query = useQuery({
    queryKey: ['private', auth.sessionSubject, 'groups', group.id, 'events'],
    queryFn: () =>
      groupApi.managedEvents(studentId, group.id, auth.getAccessToken),
    enabled: allowed,
    retry: false,
  })
  return { query, allowed }
}

export function GroupEventsManagementPage() {
  const { group, own, refresh } = useGroupManagement()
  const { query, allowed } = useManagedEvents()
  const [status, setStatus] = useState('ALL')
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não tem permissão para consultar eventos deste grupo."
      />
    )
  const now = Date.now()
  const items = (query.data ?? [])
    .filter((event) => status === 'ALL' || event.status === status)
    .sort((left, right) => {
      const a = eventTime(left, now)
      const b = eventTime(right, now)
      return (
        a.order - b.order ||
        (a.order === 2 ? b.time - a.time : a.time - b.time) ||
        left.id - right.id
      )
    })
  const permissionChanged =
    query.error instanceof ApiError && query.error.status === 403
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">Eventos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize rascunhos, publicações e cancelamentos de {group.name}.
          </p>
        </div>
        {own.permissions.includes('EVENT_CREATE') && !query.isError && (
          <Link
            to="/grupos/$groupId/gerenciar/eventos/novo"
            params={{ groupId: String(group.id) }}
            className={buttonVariants()}
          >
            Novo evento
          </Link>
        )}
      </div>
      {query.isPending ? (
        <LoadingState label="Carregando eventos" />
      ) : query.isError ? (
        <ErrorState
          title={
            permissionChanged
              ? 'Acesso aos eventos indisponível'
              : 'Não foi possível carregar os eventos'
          }
          description={
            permissionChanged
              ? 'Sua permissão neste grupo pode ter mudado.'
              : 'Tente novamente para consultar os eventos deste grupo.'
          }
          action={{
            label: 'Verificar novamente',
            onClick: () => {
              refresh()
              void query.refetch()
            },
          }}
        />
      ) : (
        <>
          {query.data.length > 0 && (
            <label className="block max-w-xs text-sm font-bold">
              Mostrar eventos
              <select
                className="pomi-focus mt-1 min-h-10 w-full rounded-md border-2 border-input bg-background px-3"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="ALL">Todos</option>
                <option value="DRAFT">Rascunhos</option>
                <option value="PUBLISHED">Publicados</option>
                <option value="CANCELLED">Cancelados</option>
              </select>
            </label>
          )}
          {items.length === 0 ? (
            <p className="rounded-md border border-border p-5 text-sm text-muted-foreground">
              {query.data.length
                ? 'Nenhum evento neste estado.'
                : own.permissions.includes('EVENT_CREATE')
                  ? 'Este grupo ainda não tem eventos. Comece criando um rascunho.'
                  : 'Este grupo ainda não tem eventos disponíveis para gestão.'}
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-md border border-border">
              {items.map((event) => (
                <li key={event.id}>
                  <Link
                    to="/grupos/$groupId/gerenciar/eventos/$eventId"
                    params={{
                      groupId: String(group.id),
                      eventId: String(event.id),
                    }}
                    className="pomi-focus group flex min-w-0 flex-wrap items-center justify-between gap-3 p-4 hover:bg-muted focus-visible:bg-muted"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-bold text-primary">
                        {statusLabel[event.status]} ·{' '}
                        {eventTime(event, now).label}
                      </p>
                      <h3 className="break-words text-lg font-extrabold group-hover:text-primary">
                        {event.name}
                      </h3>
                      {(event.startsAt || event.location) && (
                        <p className="break-words text-sm text-muted-foreground">
                          {event.startsAt && formatEventDate(event.startsAt)}
                          {event.startsAt && event.location ? ' · ' : ''}
                          {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="line-clamp-2 break-words text-sm">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-primary">
                      Ver detalhes →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

function EventForm({ event }: { event?: ManagedGroupEvent }) {
  const { group, own, studentId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const originalStart = displayLocalDateTime(event?.startsAt ?? null)
  const originalEnd = displayLocalDateTime(event?.endsAt ?? null)
  const [name, setName] = useState(event?.name ?? '')
  const [description, setDescription] = useState(event?.description ?? '')
  const [startDate, setStartDate] = useState(originalStart.date)
  const [startTime, setStartTime] = useState(originalStart.time)
  const [endDate, setEndDate] = useState(originalEnd.date)
  const [endTime, setEndTime] = useState(originalEnd.time)
  const [location, setLocation] = useState(event?.location ?? '')
  const [tagIds, setTagIds] = useState(event?.tags.map((tag) => tag.id) ?? [])
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState<number>()
  const savedRef = useRef(false)
  const canEdit = own.permissions.includes('EVENT_EDIT')
  const allowed = event
    ? canEdit && event.status !== 'CANCELLED'
    : own.permissions.includes('EVENT_CREATE')
  const tags = useQuery({
    queryKey: ['public', 'group-tags'],
    queryFn: () => pomiSdk.app.tags.listAll({}),
    enabled: allowed,
  })
  const dirty =
    !savedId &&
    (event
      ? name !== event.name ||
        description !== event.description ||
        startDate !== originalStart.date ||
        startTime !== originalStart.time ||
        endDate !== originalEnd.date ||
        endTime !== originalEnd.time ||
        location !== (event.location ?? '') ||
        tagIds.join(',') !== event.tags.map((tag) => tag.id).join(',')
      : Boolean(
          name ||
          description ||
          startDate ||
          startTime ||
          endDate ||
          endTime ||
          location ||
          tagIds.length,
        ))
  useBlocker({
    disabled: !dirty,
    enableBeforeUnload: dirty,
    shouldBlockFn: () =>
      !savedRef.current &&
      !window.confirm('Descartar alterações não salvas do evento?'),
  })
  const save = useMutation({
    mutationFn: (body: Parameters<typeof groupApi.createEvent>[2]) =>
      event
        ? groupApi.updateEvent(studentId, event.id, body, auth.getAccessToken)
        : groupApi.createEvent(studentId, group.id, body, auth.getAccessToken),
    onSuccess: (result) => {
      savedRef.current = true
      setSavedId(result.id)
      refresh()
      if (event)
        void navigate({
          to: '/grupos/$groupId/gerenciar/eventos/$eventId',
          params: { groupId: String(group.id), eventId: String(event.id) },
        })
    },
  })
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não tem permissão para esta tarefa."
      />
    )
  if (savedId)
    return (
      <section className="space-y-4">
        <EventBack groupId={group.id} />
        <h2 className="text-2xl font-extrabold">Rascunho criado</h2>
        <p role="status">
          O evento foi salvo e continua visível apenas para a gestão do grupo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={eventsPath}
            params={{ groupId: String(group.id) }}
            className={buttonVariants()}
          >
            Ver eventos do grupo
          </Link>
          {(canEdit || own.permissions.includes('EVENT_PUBLISH')) && (
            <Link
              to="/grupos/$groupId/gerenciar/eventos/$eventId"
              params={{ groupId: String(group.id), eventId: String(savedId) }}
              className={buttonVariants({ variant: 'outline' })}
            >
              Ver detalhes do rascunho
            </Link>
          )}
        </div>
      </section>
    )
  return (
    <section className="max-w-3xl space-y-5">
      <EventBack groupId={group.id} />
      <h2 className="text-2xl font-extrabold">
        {event ? 'Editar evento' : 'Novo evento'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {event
          ? 'Revise os dados antes de salvar.'
          : 'O evento será salvo como rascunho e não aparecerá na página pública.'}
      </p>
      <form
        className="space-y-7"
        onSubmit={(submit) => {
          submit.preventDefault()
          const start = preserveUnchangedInstant(
            startDate,
            startTime,
            event?.startsAt ?? null,
          )
          const end = preserveUnchangedInstant(
            endDate,
            endTime,
            event?.endsAt ?? null,
          )
          if (start.error || end.error) {
            setError(
              start.error ? `Início: ${start.error}` : `Fim: ${end.error}`,
            )
            return
          }
          if (
            start.value &&
            end.value &&
            new Date(end.value) < new Date(start.value)
          ) {
            setError('O fim não pode anteceder o início.')
            return
          }
          setError('')
          save.mutate({
            name: name.trim(),
            description: description.trim(),
            startsAt: start.value,
            endsAt: end.value,
            location: location.trim() || null,
            ...(event
              ? {
                  tags: {
                    add: tagIds.filter(
                      (id) => !event.tags.some((tag) => tag.id === id),
                    ),
                    remove: event.tags
                      .filter((tag) => !tagIds.includes(tag.id))
                      .map((tag) => tag.id),
                  },
                }
              : { tagIds }),
          })
        }}
      >
        <fieldset className="space-y-3 rounded-md border border-border p-4">
          <legend className="px-1 font-extrabold">Informações básicas</legend>
          <label className="block text-sm font-bold">
            Nome
            <Input
              value={name}
              maxLength={160}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-bold">
            Descrição
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </fieldset>
        <fieldset className="space-y-4 rounded-md border border-border p-4">
          <legend className="px-1 font-extrabold">Data, hora e local</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <LocalDateTimeField
              label="Início"
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
          <label className="block text-sm font-bold">
            Local (opcional)
            <Input
              value={location}
              maxLength={320}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
        </fieldset>
        <fieldset className="space-y-3 rounded-md border border-border p-4">
          <legend className="px-1 font-extrabold">Assuntos</legend>
          <label className="block text-sm font-bold">
            Adicionar assunto
            <select
              className="pomi-focus mt-1 min-h-10 w-full rounded-md border-2 border-input bg-background px-3"
              value=""
              onChange={(e) => {
                const id = Number(e.target.value)
                if (id) setTagIds((current) => [...current, id])
              }}
            >
              <option value="">Escolha um assunto</option>
              {(tags.data ?? [])
                .filter((tag: Tag) => !tagIds.includes(tag.id))
                .map((tag: Tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
            </select>
          </label>
          {tags.isError && (
            <Failure message="Não foi possível carregar os assuntos." />
          )}
          {tagIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tagIds.map((id) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setTagIds((current) =>
                      current.filter((value) => value !== id),
                    )
                  }
                >
                  Remover{' '}
                  {tags.data?.find((tag: Tag) => tag.id === id)?.name ??
                    event?.tags.find((tag) => tag.id === id)?.name ??
                    'assunto'}
                </Button>
              ))}
            </div>
          )}
        </fieldset>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {save.isError && (
          <Failure message="Não foi possível salvar o evento. Confira os dados e tente novamente." />
        )}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={save.isPending || !name.trim()}>
            {save.isPending
              ? 'Salvando...'
              : event
                ? 'Salvar evento'
                : 'Salvar rascunho'}
          </Button>
          <Link
            to={
              event ? '/grupos/$groupId/gerenciar/eventos/$eventId' : eventsPath
            }
            params={
              event
                ? { groupId: String(group.id), eventId: String(event.id) }
                : { groupId: String(group.id) }
            }
            className={buttonVariants({ variant: 'outline' })}
          >
            {event ? 'Cancelar edição' : 'Voltar sem criar'}
          </Link>
        </div>
      </form>
    </section>
  )
}

export function GroupEventCreatePage() {
  return <EventForm />
}

export function GroupEventDetailPage({ eventId }: { eventId: number }) {
  const { group, own, studentId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const { query, allowed } = useManagedEvents()
  const event = query.data?.find((item) => item.id === eventId)
  const action = useMutation({
    mutationFn: (kind: 'publish' | 'cancel') =>
      kind === 'publish'
        ? groupApi.publishEvent(studentId, eventId, auth.getAccessToken)
        : groupApi.cancelEvent(studentId, eventId, auth.getAccessToken),
    onSuccess: refresh,
  })
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não tem permissão para consultar eventos deste grupo."
      />
    )
  if (query.isPending) return <LoadingState label="Carregando evento" />
  if (query.isError || !event)
    return (
      <ErrorState
        title="Evento indisponível"
        description="Confira o endereço ou sua permissão neste grupo."
      />
    )
  const missing = [
    !event.name.trim() && 'nome',
    !event.description.trim() && 'descrição',
    !event.startsAt && 'data de início',
    event.startsAt &&
      event.endsAt &&
      new Date(event.endsAt) < new Date(event.startsAt) &&
      'fim anterior ao início',
  ].filter(Boolean)
  return (
    <section className="max-w-3xl space-y-6">
      <EventBack groupId={group.id} />
      <div>
        <p className="text-xs font-bold text-primary">
          {statusLabel[event.status]}
        </p>
        <h2 className="text-2xl font-extrabold">{event.name}</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm">
          {event.description || 'Sem descrição.'}
        </p>
      </div>
      <dl className="grid gap-3 rounded-md border border-border p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-bold">Início</dt>
          <dd>{formatEventDate(event.startsAt)}</dd>
        </div>
        <div>
          <dt className="font-bold">Fim</dt>
          <dd>
            {event.endsAt ? formatEventDate(event.endsAt) : 'Não informado'}
          </dd>
        </div>
        <div>
          <dt className="font-bold">Local</dt>
          <dd>{event.location || 'Não informado'}</dd>
        </div>
        <div>
          <dt className="font-bold">Assuntos</dt>
          <dd>{event.tags.map((tag) => tag.name).join(', ') || 'Nenhum'}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        {event.status !== 'CANCELLED' &&
          own.permissions.includes('EVENT_EDIT') && (
            <Link
              to="/grupos/$groupId/gerenciar/eventos/$eventId/editar"
              params={{ groupId: String(group.id), eventId: String(event.id) }}
              className={buttonVariants({ variant: 'outline' })}
            >
              Editar evento
            </Link>
          )}
        {event.status === 'PUBLISHED' && (
          <Link
            to="/eventos/$eventId"
            params={{ eventId: String(event.id) }}
            className={buttonVariants({ variant: 'outline' })}
          >
            Ver página pública
          </Link>
        )}
        {event.status === 'DRAFT' &&
          own.permissions.includes('EVENT_PUBLISH') && (
            <Button
              disabled={action.isPending || missing.length > 0}
              onClick={() => {
                if (
                  window.confirm(
                    `Publicar ${event.name}? O evento ficará visível para todos.`,
                  )
                )
                  action.mutate('publish')
              }}
            >
              Publicar evento
            </Button>
          )}
        {event.status === 'PUBLISHED' &&
          own.permissions.includes('EVENT_PUBLISH') && (
            <Button
              variant="outline"
              disabled={action.isPending}
              onClick={() => {
                if (
                  window.confirm(
                    `Cancelar ${event.name}? O evento deixará de aparecer nas páginas públicas.`,
                  )
                )
                  action.mutate('cancel')
              }}
            >
              Cancelar evento
            </Button>
          )}
      </div>
      {event.status === 'DRAFT' && missing.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Para publicar, complete: {missing.join(', ')}.
        </p>
      )}
      {action.isSuccess && (
        <p role="status" className="text-sm font-semibold">
          Estado do evento atualizado.
        </p>
      )}
      {action.isError && (
        <Failure message="Não foi possível alterar o estado do evento. Confira os requisitos e sua permissão." />
      )}
    </section>
  )
}

export function GroupEventEditPage({ eventId }: { eventId: number }) {
  const { query, allowed } = useManagedEvents()
  if (!allowed)
    return (
      <ErrorState
        title="Acesso insuficiente"
        description="Você não tem permissão para consultar eventos deste grupo."
      />
    )
  if (query.isPending) return <LoadingState label="Carregando evento" />
  if (query.isError)
    return <Failure message="Não foi possível carregar o evento." />
  const event = query.data.find((item) => item.id === eventId)
  if (!event)
    return (
      <ErrorState
        title="Evento indisponível"
        description="Confira o endereço e tente novamente."
      />
    )
  return <EventForm key={event.id} event={event} />
}
