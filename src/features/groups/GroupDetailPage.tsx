import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, Mail, Users } from 'lucide-react'

import { groupApi } from './data/groupApi'
import { canOrganizeEvents } from './groupNavigation'
import { EventCard, formatEventDate } from './presentation'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { buttonVariants } from '@/components/ui/button'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'

export function GroupDetailPage({ groupId }: { groupId: number }) {
  const auth = useOptionalAuth()
  const { studentId } = useStudentProfile()
  const group = useQuery({
    queryKey: ['public', 'groups', groupId],
    queryFn: () => groupApi.get(groupId),
    enabled: Number.isSafeInteger(groupId) && groupId > 0,
    retry: false,
  })
  const members = useQuery({
    queryKey: ['public', 'groups', groupId, 'members'],
    queryFn: () => groupApi.members(groupId),
    enabled: Number.isSafeInteger(groupId) && groupId > 0,
  })
  const events = useQuery({
    queryKey: ['public', 'groups', groupId, 'events'],
    queryFn: () => groupApi.events(groupId),
    enabled: Number.isSafeInteger(groupId) && groupId > 0,
  })
  const memberships = useQuery({
    queryKey: ['private', auth.sessionSubject, 'groups', 'memberships'],
    queryFn: () => groupApi.ownMemberships(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const own = memberships.data?.find(
    (membership) => membership.groupId === groupId && !membership.leftAt,
  )

  if (!Number.isSafeInteger(groupId) || groupId <= 0) {
    return (
      <PageContainer>
        <ErrorState
          title="Grupo inválido"
          description="Confira o endereço e tente novamente."
        />
      </PageContainer>
    )
  }
  if (group.isPending) {
    return (
      <PageContainer>
        <LoadingState label="Carregando grupo" />
      </PageContainer>
    )
  }
  if (group.isError) {
    return (
      <PageContainer>
        <ErrorState
          title="Grupo indisponível"
          description="O grupo não foi encontrado ou não está mais público."
          action={{
            label: 'Tentar novamente',
            onClick: () => void group.refetch(),
          }}
        />
      </PageContainer>
    )
  }

  const value = group.data
  return (
    <PageContainer>
      <Link
        to="/grupos"
        className="pomi-focus mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Explorar grupos
      </Link>
      <PageHeader
        eyebrow="Comunidade · Grupo"
        title={value.name}
        description={
          value.description ||
          'Conheça as atividades e os contatos deste grupo.'
        }
        actions={
          own && (
            <div className="flex flex-wrap gap-2">
              <Link
                to="/meus-grupos/$groupId"
                params={{ groupId: String(groupId) }}
                className={buttonVariants({ variant: 'outline' })}
              >
                Minha participação
              </Link>
              {own.permissions.length > 0 && (
                <Link
                  to="/grupos/$groupId/gerenciar"
                  params={{ groupId: String(groupId) }}
                  className={buttonVariants()}
                >
                  Abrir espaço de trabalho
                </Link>
              )}
            </div>
          )
        }
      />
      {value.tags.length > 0 && (
        <div
          className="mb-8 flex flex-wrap gap-2"
          aria-label="Assuntos do grupo"
        >
          {value.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-sm border border-border bg-muted px-3 py-1 text-xs font-bold"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      <div
        className={
          value.contacts.length || value.externalLinks.length
            ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]'
            : 'space-y-8'
        }
      >
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="group-events-title">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="group-events-title" className="text-2xl font-extrabold">
                Atividades e eventos
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {own && canOrganizeEvents(own.permissions) && (
                  <Link
                    to="/grupos/$groupId/gerenciar/eventos"
                    params={{ groupId: String(groupId) }}
                    className="pomi-focus text-sm font-bold text-primary hover:underline"
                  >
                    Organizar eventos
                  </Link>
                )}
                <Link
                  to="/eventos"
                  className="pomi-focus text-sm font-bold text-primary hover:underline"
                >
                  Explorar eventos
                </Link>
              </div>
            </div>
            {events.isPending ? (
              <LoadingState label="Carregando eventos" />
            ) : events.isError ? (
              <ErrorState
                title="Não foi possível carregar os eventos"
                description="Tente novamente."
                action={{
                  label: 'Tentar novamente',
                  onClick: () => void events.refetch(),
                }}
              />
            ) : events.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Este grupo ainda não tem eventos publicados.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {events.data.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>
          <section aria-labelledby="group-members-title">
            <h2
              id="group-members-title"
              className="mb-4 text-2xl font-extrabold"
            >
              Pessoas do grupo
            </h2>
            {members.isPending ? (
              <LoadingState label="Carregando membros públicos" />
            ) : members.isError ? (
              <ErrorState
                title="Não foi possível carregar os membros públicos"
                description="Tente novamente."
                action={{
                  label: 'Tentar novamente',
                  onClick: () => void members.refetch(),
                }}
              />
            ) : members.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum membro com perfil público. Isso não significa que o grupo
                não tenha membros.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {members.data.map((member) => (
                  <li
                    key={member.id}
                    className="rounded-md border border-border p-4"
                  >
                    {member.profilePublicId ? (
                      <Link
                        to="/perfis/$publicId"
                        params={{ publicId: member.profilePublicId }}
                        className="pomi-focus inline-flex items-center gap-2 font-bold text-primary hover:underline"
                      >
                        <Users aria-hidden="true" className="size-4" />
                        {member.displayName}
                      </Link>
                    ) : (
                      <p className="flex items-center gap-2 font-bold">
                        <Users aria-hidden="true" className="size-4" />
                        {member.displayName}
                      </p>
                    )}
                    {member.positions.map((position) => (
                      <p
                        key={position.id}
                        className="mt-1 text-sm text-muted-foreground"
                      >
                        {position.title}
                        {position.startedAt || position.endedAt
                          ? ` · ${position.startedAt ? formatEventDate(position.startedAt) : 'Início não informado'} até ${position.endedAt ? formatEventDate(position.endedAt) : 'Fim não informado'}`
                          : ''}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        {(value.contacts.length > 0 || value.externalLinks.length > 0) && (
          <aside className="min-w-0 space-y-7">
            <section aria-labelledby="group-contact-title">
              <h2
                id="group-contact-title"
                className="mb-3 text-lg font-extrabold"
              >
                Como saber mais
              </h2>
              <div className="space-y-3">
                {value.contacts.map((contact) => (
                  <p
                    key={contact.id}
                    className="flex items-start gap-2 break-words text-sm"
                  >
                    <Mail
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0"
                    />
                    <span>
                      <strong>{contact.label || contact.type}:</strong>{' '}
                      {contact.value}
                    </span>
                  </p>
                ))}
                {value.externalLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pomi-focus flex items-start gap-2 break-all text-sm font-bold text-primary hover:underline"
                  >
                    <ExternalLink
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0"
                    />
                    {link.label}
                  </a>
                ))}
              </div>
            </section>
            <p className="border-t border-border pt-5 text-xs text-muted-foreground">
              A participação neste grupo acontece por convite de quem o
              organiza.
            </p>
          </aside>
        )}
      </div>
      {value.contacts.length === 0 && value.externalLinks.length === 0 && (
        <p className="border-t border-border pt-5 text-sm text-muted-foreground">
          A participação neste grupo acontece por convite de quem o organiza.
        </p>
      )}
    </PageContainer>
  )
}
