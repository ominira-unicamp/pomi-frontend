import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { groupApi } from './data/groupApi'
import { canOrganizeEvents, groupWorkspaceDestination } from './groupNavigation'
import { formatGroupDate } from './presentation'
import { GroupAvatar } from '@/features/media/IdentityImages'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { AuthRequiredState } from '@/components/AuthRequiredState'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'

export function MyGroupsPage() {
  const auth = useOptionalAuth()
  const { studentId, studentQuery } = useStudentProfile()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [showAllInvitations, setShowAllInvitations] = useState(false)
  const groups = useQuery({
    queryKey: ['public', 'groups'],
    queryFn: groupApi.list,
  })
  const memberships = useQuery({
    queryKey: ['private', auth.sessionSubject, 'groups', 'memberships'],
    queryFn: () => groupApi.ownMemberships(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const invitations = useQuery({
    queryKey: ['private', auth.sessionSubject, 'groups', 'invitations'],
    queryFn: () => groupApi.invitations(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const accept = useMutation({
    mutationFn: (id: number) =>
      groupApi.accept(studentId!, id, auth.getAccessToken),
    onSuccess: (membership) => {
      void queryClient.invalidateQueries({
        queryKey: ['private', auth.sessionSubject, 'groups'],
      })
      void navigate({
        to: '/meus-grupos/$groupId',
        params: { groupId: String(membership.groupId) },
      })
    },
  })
  const decline = useMutation({
    mutationFn: (id: number) =>
      groupApi.decline(studentId!, id, auth.getAccessToken),
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: ['private', auth.sessionSubject, 'groups', 'invitations'],
      }),
  })

  if (!auth.initialized || (auth.isAuthenticated && studentQuery.isPending))
    return (
      <PageContainer>
        <LoadingState label="Carregando sua participação" />
      </PageContainer>
    )
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <AuthRequiredState
          title="Entre para ver seus grupos"
          description="Convites e vínculos são informações da sua conta."
          onLogin={() => void auth.login(window.location.href)}
        />
      </PageContainer>
    )
  if (!studentId)
    return (
      <PageContainer>
        <ErrorState
          title="Perfil necessário para participar"
          description="No momento, criar ou participar de grupos exige um perfil de estudante associado à sua conta."
        />
      </PageContainer>
    )

  const groupById = new Map(
    groups.data?.map((group) => [group.id, group]) ?? [],
  )
  const pending = (invitations.data ?? []).filter(
    (invite) =>
      invite.status === 'PENDING' &&
      new Date(invite.expiresAt).getTime() > Date.now(),
  )
  const visiblePending =
    pending.length > 2 && !showAllInvitations ? [] : pending
  const pastInvitations = (invitations.data ?? []).filter(
    (invite) => !pending.includes(invite),
  )
  const active = (memberships.data ?? []).filter((item) => !item.leftAt)
  const history = (memberships.data ?? []).filter((item) => item.leftAt)
  const label = (id: number) => groupById.get(id)?.name ?? `Grupo #${id}`

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Sua comunidade"
        title="Meus grupos"
        description="Acesse seus grupos e continue o que você organiza com eles."
        compact
        actions={
          <>
            <Link
              to="/grupos"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              Explorar grupos
            </Link>
            <Link
              to="/grupos/novo"
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Criar grupo
            </Link>
          </>
        }
      />
      {(invitations.isPending || invitations.isError || pending.length > 0) && (
        <section className="mb-8" aria-labelledby="pending-invitations-title">
          <h2
            id="pending-invitations-title"
            className="mb-3 text-xl font-extrabold"
          >
            {pending.length > 0
              ? `Convites para responder · ${pending.length}`
              : 'Convites'}
          </h2>
          {invitations.isPending ? (
            <p role="status" className="text-sm text-muted-foreground">
              Verificando convites...
            </p>
          ) : invitations.isError ? (
            <div className="flex flex-wrap items-center gap-3">
              <p role="alert" className="text-sm text-destructive">
                Não foi possível carregar os convites.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void invitations.refetch()}
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              {visiblePending.length > 0 && (
                <ul className="space-y-3">
                  {visiblePending.map((invite) => (
                    <li
                      key={invite.id}
                      className="rounded-md border-2 border-strong-border p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="flex items-center gap-3 font-extrabold">
                            <GroupAvatar
                              mediaId={
                                groupById.get(invite.groupId)?.avatarMediaId
                              }
                              name={label(invite.groupId)}
                              size="small"
                            />{' '}
                            {label(invite.groupId)}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Válido até{' '}
                            {new Date(invite.expiresAt).toLocaleDateString(
                              'pt-BR',
                            )}
                          </p>
                          <Link
                            to="/grupos/$groupId"
                            params={{ groupId: String(invite.groupId) }}
                            className="pomi-focus mt-2 inline-block text-sm font-bold text-primary hover:underline"
                          >
                            Conhecer grupo
                          </Link>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            disabled={accept.isPending || decline.isPending}
                            onClick={() => accept.mutate(invite.id)}
                          >
                            Aceitar convite
                          </Button>
                          <Button
                            variant="outline"
                            disabled={accept.isPending || decline.isPending}
                            onClick={() => decline.mutate(invite.id)}
                          >
                            Recusar
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {pending.length > 2 && (
                <Button
                  className="mt-3"
                  variant="ghost"
                  size="sm"
                  aria-expanded={showAllInvitations}
                  onClick={() => setShowAllInvitations((value) => !value)}
                >
                  {showAllInvitations
                    ? 'Mostrar menos convites'
                    : 'Ver ' + pending.length + ' convites'}
                </Button>
              )}
            </>
          )}
          {(accept.isError || decline.isError) && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              Não foi possível responder ao convite. Ele pode ter expirado ou já
              ter sido respondido.
            </p>
          )}
        </section>
      )}
      <section className="mb-10" aria-labelledby="my-active-groups-title">
        <h2
          id="my-active-groups-title"
          className="mb-4 text-2xl font-extrabold"
        >
          Meus grupos ativos
        </h2>
        {groups.isError && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <p role="alert" className="text-destructive">
              Não foi possível carregar os nomes dos grupos.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void groups.refetch()}
            >
              Tentar novamente
            </Button>
          </div>
        )}
        {memberships.isPending ? (
          <LoadingState label="Carregando seus grupos" />
        ) : memberships.isError ? (
          <ErrorState
            title="Não foi possível carregar seus grupos"
            description="Tente novamente."
            action={{
              label: 'Tentar novamente',
              onClick: () => void memberships.refetch(),
            }}
          />
        ) : active.length === 0 ? (
          <div className="space-y-4">
            <EmptyState
              title="Você ainda não participa de um grupo"
              description="A participação começa com um convite. Conheça os grupos da comunidade enquanto isso."
            />
            <Link
              to="/grupos"
              className={buttonVariants({ variant: 'outline' })}
            >
              Explorar grupos
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {active.map((item) => (
              <li
                key={item.id}
                className="flex min-w-0 flex-col rounded-md border-2 border-strong-border bg-card p-5"
              >
                <h3 className="flex items-center gap-3 text-xl font-extrabold leading-tight">
                  <GroupAvatar
                    mediaId={groupById.get(item.groupId)?.avatarMediaId}
                    name={label(item.groupId)}
                    size="small"
                  />{' '}
                  {label(item.groupId)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Você participa deste grupo
                  {item.joinedAt && ` desde ${formatGroupDate(item.joinedAt)}`}.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {canOrganizeEvents(item.permissions) && (
                    <Link
                      to="/grupos/$groupId/gerenciar/eventos"
                      params={{ groupId: String(item.groupId) }}
                      className={buttonVariants({ size: 'sm' })}
                    >
                      Organizar eventos
                    </Link>
                  )}
                  {!canOrganizeEvents(item.permissions) &&
                    item.permissions.length > 0 && (
                      <Link
                        to={groupWorkspaceDestination(item.permissions)}
                        params={{ groupId: String(item.groupId) }}
                        className={buttonVariants({ size: 'sm' })}
                      >
                        Abrir espaço de trabalho
                      </Link>
                    )}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-sm">
                  <Link
                    to="/grupos/$groupId"
                    params={{ groupId: String(item.groupId) }}
                    className="pomi-focus text-sm font-bold text-primary hover:underline"
                  >
                    Ver grupo
                  </Link>
                  <Link
                    to="/meus-grupos/$groupId"
                    params={{ groupId: String(item.groupId) }}
                    className="pomi-focus text-sm font-bold text-primary hover:underline"
                  >
                    Minha participação
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      {(history.length > 0 || pastInvitations.length > 0) && (
        <section aria-labelledby="participation-history-title">
          <h2
            id="participation-history-title"
            className="mb-4 text-xl font-extrabold"
          >
            Histórico
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {history.map((item) => (
              <li
                key={`member-${item.id}`}
                className="flex flex-wrap items-center gap-2"
              >
                Vínculo encerrado ·{' '}
                <GroupAvatar
                  mediaId={groupById.get(item.groupId)?.avatarMediaId}
                  name={label(item.groupId)}
                  size="small"
                />{' '}
                {label(item.groupId)}
              </li>
            ))}
            {pastInvitations.map((invite) => (
              <li key={`invite-${invite.id}`}>
                Convite{' '}
                {invite.status === 'PENDING'
                  ? 'expirado'
                  : invite.status === 'DECLINED'
                    ? 'recusado'
                    : invite.status === 'ACCEPTED'
                      ? 'aceito'
                      : invite.status === 'CANCELLED'
                        ? 'cancelado'
                        : 'expirado'}{' '}
                ·{' '}
                <GroupAvatar
                  mediaId={groupById.get(invite.groupId)?.avatarMediaId}
                  name={label(invite.groupId)}
                  size="small"
                />{' '}
                {label(invite.groupId)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageContainer>
  )
}
