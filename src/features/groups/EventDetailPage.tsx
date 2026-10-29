import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'

import { groupApi } from './data/groupApi'
import { formatEventDate } from './presentation'
import { GroupAvatar } from '@/features/media/IdentityImages'
import {
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { buttonVariants } from '@/components/ui/button'

export function EventDetailPage({ eventId }: { eventId: number }) {
  const event = useQuery({
    queryKey: ['public', 'group-events', eventId],
    queryFn: () => groupApi.getEvent(eventId),
    enabled: Number.isSafeInteger(eventId) && eventId > 0,
    retry: false,
  })
  const groupId = event.data?.groupId
  const group = useQuery({
    queryKey: ['public', 'groups', groupId],
    queryFn: () => groupApi.get(groupId!),
    enabled: Boolean(groupId),
    retry: false,
  })
  if (!Number.isSafeInteger(eventId) || eventId <= 0)
    return (
      <PageContainer>
        <ErrorState
          title="Evento inválido"
          description="Confira o endereço e tente novamente."
        />
      </PageContainer>
    )
  if (event.isPending)
    return (
      <PageContainer>
        <LoadingState label="Carregando evento" />
      </PageContainer>
    )
  if (event.isError)
    return (
      <PageContainer>
        <ErrorState
          title="Evento indisponível"
          description="O evento não foi encontrado ou não está mais publicado."
          action={{
            label: 'Tentar novamente',
            onClick: () => void event.refetch(),
          }}
        />
      </PageContainer>
    )

  const value = event.data
  return (
    <PageContainer>
      <Link
        to="/eventos"
        className="pomi-focus mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Explorar eventos
      </Link>
      <PageHeader
        eyebrow="Comunidade · Evento"
        title={value.name}
        description={value.description || undefined}
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <section
            aria-labelledby="event-when"
            className="rounded-md border-2 border-strong-border p-5"
          >
            <h2 id="event-when" className="mb-3 text-lg font-extrabold">
              Quando e onde
            </h2>
            <p className="flex items-start gap-2">
              <CalendarDays
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-primary"
              />
              <span>
                {formatEventDate(value.startsAt)}
                {value.endsAt && ` até ${formatEventDate(value.endsAt)}`}
              </span>
            </p>
            {value.location && (
              <p className="mt-3 flex items-start gap-2">
                <MapPin
                  aria-hidden="true"
                  className="mt-1 size-5 shrink-0 text-primary"
                />
                {value.location}
              </p>
            )}
          </section>
          {value.tags.length > 0 && (
            <div
              className="flex flex-wrap gap-2"
              aria-label="Assuntos do evento"
            >
              {value.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-sm bg-muted px-3 py-1 text-xs font-bold"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <aside className="space-y-3 rounded-md border border-border p-5">
          <h2 className="text-lg font-extrabold">Organizado por</h2>
          <p className="flex items-center gap-3 font-bold">
            <GroupAvatar
              mediaId={group.data?.avatarMediaId}
              name={group.data?.name ?? `Grupo #${value.groupId}`}
            />
            {group.data?.name ?? `Grupo #${value.groupId}`}
          </p>
          {group.isError && (
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar o nome do grupo.
            </p>
          )}
          <Link
            to="/grupos/$groupId"
            params={{ groupId: String(value.groupId) }}
            className={buttonVariants({ variant: 'outline' })}
          >
            Conhecer o grupo
          </Link>
        </aside>
      </div>
    </PageContainer>
  )
}
