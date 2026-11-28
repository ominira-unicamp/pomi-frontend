import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { ManagedEventsSearch } from '@/lib/navigation'
import { ContextLink as Link } from '@/app/navigation/NavigationContext'
import { groupApi } from '@/features/groups/data/groupApi'
import { Failure } from '@/features/groups/EditorFeedback'
import { useGroupManagement } from '@/features/groups/GroupManagementLayout'
import { formatEventDate } from '@/features/groups/presentation'
import { ApiError } from '@/api/errors'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState, LoadingState } from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { EventBack, eventTime, statusLabel, useManagedEvents } from '@/features/groups/eventManagementQueries'

import { EventForm } from '@/features/groups/GroupEventForm'

export function GroupEventsManagementPage({
  search,
  onSearchChange,
}: {
  search?: ManagedEventsSearch
  onSearchChange?: (search: ManagedEventsSearch) => void
} = {}) {
  const { group, own, refresh } = useGroupManagement()
  const { query, allowed } = useManagedEvents()
  const [localStatus, setLocalStatus] = useState('ALL')
  const status = search ? (search.status ?? 'ALL') : localStatus
  const setStatus = (value: string) => {
    if (onSearchChange)
      onSearchChange({
        status:
          value === 'ALL'
            ? undefined
            : (value as ManagedEventsSearch['status']),
      })
    else setLocalStatus(value)
  }
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

export function GroupEventCreatePage() {
  return <EventForm />
}

export function GroupEventDetailPage({ eventId }: { eventId: number }) {
  const { group, own, userId, refresh } = useGroupManagement()
  const auth = useOptionalAuth()
  const { query, allowed } = useManagedEvents()
  const event = query.data?.find((item) => item.id === eventId)
  const action = useMutation({
    mutationFn: (kind: 'publish' | 'cancel') =>
      kind === 'publish'
        ? groupApi.publishEvent(userId, group.id, eventId, auth.getAccessToken)
        : groupApi.cancelEvent(userId, group.id, eventId, auth.getAccessToken),
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
