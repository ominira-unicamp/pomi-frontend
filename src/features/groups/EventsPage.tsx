import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import { useState } from 'react'

import { groupApi } from './data/groupApi'
import type { GroupEvent } from '@ominira/pomi-sdk/generated/app'
import { GroupAvatar } from '@/features/media/IdentityImages'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'

type AgendaView = 'upcoming' | 'past' | 'undated'

function eventMonth(event: GroupEvent) {
  if (!event.startsAt) return 'Data a confirmar'
  const label = new Date(event.startsAt).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function eventTime(event: GroupEvent) {
  if (!event.startsAt) return 'Horário a confirmar'
  const start = new Date(event.startsAt)
  const startTime = start.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  if (!event.endsAt) return startTime
  const end = new Date(event.endsAt)
  const sameDay = start.toDateString() === end.toDateString()
  return sameDay
    ? startTime +
        '–' +
        end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : startTime +
        ' · até ' +
        end.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function EventAgendaItem({
  event,
  groupName,
  groupAvatarMediaId,
}: {
  event: GroupEvent
  groupName?: string
  groupAvatarMediaId?: string | null
}) {
  const start = event.startsAt ? new Date(event.startsAt) : null
  return (
    <article className="grid min-w-0 gap-4 rounded-md border-2 border-strong-border bg-card p-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:p-5">
      <div className="flex items-baseline gap-2 text-primary sm:block">
        <span className="text-3xl font-black leading-none">
          {start ? start.toLocaleDateString('pt-BR', { day: '2-digit' }) : '—'}
        </span>
        <span className="text-xs font-bold uppercase tracking-wide sm:mt-1 sm:block">
          {start
            ? start.toLocaleDateString('pt-BR', { weekday: 'short' })
            : 'Sem data'}
        </span>
      </div>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-muted-foreground">
          <span>{eventTime(event)}</span>
          {event.location && (
            <span className="inline-flex items-center gap-1 font-medium">
              <MapPin aria-hidden="true" className="size-4" />
              {event.location}
            </span>
          )}
        </p>
        <h3 className="mt-2 text-xl font-extrabold leading-tight">
          <Link
            to="/eventos/$eventId"
            params={{ eventId: String(event.id) }}
            className="pomi-focus hover:text-primary"
          >
            {event.name}
          </Link>
        </h3>
        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
          <Link
            to="/grupos/$groupId"
            params={{ groupId: String(event.groupId) }}
            className="pomi-focus inline-flex items-center gap-2 font-bold text-primary hover:underline"
          >
            <GroupAvatar
              mediaId={groupAvatarMediaId}
              name={groupName ?? 'Grupo'}
              size="small"
            />{' '}
            {groupName ?? 'Conhecer grupo organizador'}
          </Link>
          <Link
            to="/eventos/$eventId"
            params={{ eventId: String(event.id) }}
            className="pomi-focus inline-flex items-center gap-1 font-bold text-primary hover:underline"
          >
            Ver evento <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {event.tags.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            {event.tags.map((tag) => tag.name).join(' · ')}
          </p>
        )}
      </div>
    </article>
  )
}

export function EventsPage({
  period,
  onPeriodChange,
}: {
  period?: AgendaView
  onPeriodChange?: (value: AgendaView) => void
} = {}) {
  const [localView, setLocalView] = useState<AgendaView>('upcoming')
  const view = period ?? localView
  const setView = onPeriodChange ?? setLocalView
  const events = useQuery({
    queryKey: ['public', 'group-events'],
    queryFn: groupApi.listEvents,
  })
  const groups = useQuery({
    queryKey: ['public', 'groups'],
    queryFn: groupApi.list,
  })
  const groupById = new Map(
    groups.data?.map((group) => [group.id, group]) ?? [],
  )
  const now = Date.now()
  const upcoming = (events.data ?? [])
    .filter(
      (event) => event.startsAt && new Date(event.startsAt).getTime() >= now,
    )
    .sort((a, b) => a.startsAt!.localeCompare(b.startsAt!) || a.id - b.id)
  const past = (events.data ?? [])
    .filter(
      (event) => event.startsAt && new Date(event.startsAt).getTime() < now,
    )
    .sort((a, b) => b.startsAt!.localeCompare(a.startsAt!) || b.id - a.id)
  const undated = (events.data ?? []).filter((event) => !event.startsAt)
  const visible =
    view === 'upcoming' ? upcoming : view === 'past' ? past : undated
  const sections = new Map<string, Array<GroupEvent>>()
  for (const event of visible) {
    const title = eventMonth(event)
    sections.set(title, [...(sections.get(title) ?? []), event])
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Comunidade"
        title="Explorar eventos"
        description="Descubra as atividades publicadas pelos grupos da comunidade."
        compact
        actions={
          <Link
            to="/grupos"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Explorar grupos
          </Link>
        }
      />
      <div
        className="mb-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Período dos eventos"
      >
        <Button
          variant={view === 'upcoming' ? 'default' : 'outline'}
          size="sm"
          aria-pressed={view === 'upcoming'}
          onClick={() => setView('upcoming')}
        >
          Próximos
        </Button>
        {(past.length > 0 || view === 'past') && (
          <Button
            variant={view === 'past' ? 'default' : 'outline'}
            size="sm"
            aria-pressed={view === 'past'}
            onClick={() => setView('past')}
          >
            Anteriores
          </Button>
        )}
        {(undated.length > 0 || view === 'undated') && (
          <Button
            variant={view === 'undated' ? 'default' : 'outline'}
            size="sm"
            aria-pressed={view === 'undated'}
            onClick={() => setView('undated')}
          >
            Sem data
          </Button>
        )}
      </div>
      {events.isPending ? (
        <LoadingState label="Carregando agenda" />
      ) : events.isError ? (
        <ErrorState
          title="Não foi possível carregar os eventos"
          description="Confira a conexão e tente novamente."
          action={{
            label: 'Tentar novamente',
            onClick: () => void events.refetch(),
          }}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title={
            view === 'upcoming'
              ? 'Nenhum próximo evento publicado'
              : view === 'past'
                ? 'Nenhum evento anterior'
                : 'Nenhum evento sem data'
          }
          description={
            view === 'upcoming'
              ? past.length > 0
                ? 'Há atividades anteriores para consultar.'
                : undated.length > 0
                  ? 'Há atividades publicadas sem data definida.'
                  : 'Novas atividades aparecerão aqui quando forem publicadas.'
              : view === 'past'
                ? 'Não há eventos anteriores publicados.'
                : 'Não há atividades publicadas sem data definida.'
          }
          action={
            view === 'upcoming'
              ? past.length > 0
                ? { label: 'Ver anteriores', onClick: () => setView('past') }
                : undated.length > 0
                  ? {
                      label: 'Ver eventos sem data',
                      onClick: () => setView('undated'),
                    }
                  : undefined
              : undefined
          }
        />
      ) : (
        <div className="max-w-4xl space-y-7">
          {groups.isError && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              Os nomes dos grupos não carregaram.
              <Button
                size="sm"
                variant="outline"
                onClick={() => void groups.refetch()}
              >
                Tentar novamente
              </Button>
            </div>
          )}
          {[...sections].map(([title, items]) => (
            <section key={title} aria-label={title} className="space-y-3">
              <h2 className="text-lg font-extrabold">{title}</h2>
              <ul className="space-y-3">
                {items.map((event) => (
                  <li key={event.id}>
                    <EventAgendaItem
                      event={event}
                      groupName={groupById.get(event.groupId)?.name}
                      groupAvatarMediaId={
                        groupById.get(event.groupId)?.avatarMediaId
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
