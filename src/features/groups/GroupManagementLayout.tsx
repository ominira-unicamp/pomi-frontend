import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { createContext, useContext, useEffect, useRef } from 'react'

import { groupApi } from './data/groupApi'
import { canOrganizeEvents } from './groupNavigation'
import type { Group, OwnGroupMembership } from '@ominira/pomi-sdk/generated/app'
import { GroupAvatar } from '@/features/media/IdentityImages'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { AuthRequiredState } from '@/components/AuthRequiredState'
import {
  ErrorState,
  LoadingState,
  PageContainer,
} from '@/components/PageLayout'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'

type ManagementContext = {
  group: Group
  own: OwnGroupMembership
  studentId: number
  refresh: () => void
}
const context = createContext<ManagementContext | null>(null)

export function useGroupManagement() {
  const value = useContext(context)
  if (!value) throw new Error('A página precisa estar na gestão de um grupo.')
  return value
}

export function GroupManagementLayout({ groupId }: { groupId: number }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    contentRef.current?.focus()
  }, [pathname])
  const auth = useOptionalAuth()
  const { studentId, studentQuery } = useStudentProfile()
  const queryClient = useQueryClient()
  const group = useQuery({
    queryKey: ['public', 'groups', groupId],
    queryFn: () => groupApi.get(groupId),
    enabled: groupId > 0,
    retry: false,
  })
  const memberships = useQuery({
    queryKey: ['private', auth.sessionSubject, 'groups', 'memberships'],
    queryFn: () => groupApi.ownMemberships(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const own = memberships.data?.find(
    (item) => item.groupId === groupId && !item.leftAt,
  )
  if (!Number.isSafeInteger(groupId) || groupId <= 0)
    return (
      <PageContainer>
        <ErrorState
          title="Grupo inválido"
          description="Confira o endereço e tente novamente."
        />
      </PageContainer>
    )
  if (!auth.initialized || (auth.isAuthenticated && studentQuery.isPending))
    return (
      <PageContainer>
        <LoadingState label="Carregando gestão" />
      </PageContainer>
    )
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <AuthRequiredState
          title="Entre para gerenciar"
          description="A gestão exige acesso ao grupo."
          onLogin={() => void auth.login(window.location.href)}
        />
      </PageContainer>
    )
  if (!studentId)
    return (
      <PageContainer>
        <ErrorState
          title="Perfil necessário"
          description="No momento, a gestão de grupos exige um perfil de estudante."
        />
      </PageContainer>
    )
  if (group.isPending || memberships.isPending)
    return (
      <PageContainer>
        <LoadingState label="Carregando gestão" />
      </PageContainer>
    )
  if (group.isError || memberships.isError)
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível abrir a gestão"
          description="O grupo pode não estar disponível ou houve uma falha de carregamento."
        />
      </PageContainer>
    )
  if (!own || own.permissions.length === 0)
    return (
      <PageContainer>
        <ErrorState
          title="Acesso insuficiente"
          description="Sua participação não permite gerenciar este grupo."
        />
      </PageContainer>
    )

  const value: ManagementContext = {
    group: group.data,
    own,
    studentId,
    refresh: () => {
      void queryClient.invalidateQueries({ queryKey: ['public', 'groups'] })
      void queryClient.invalidateQueries({
        queryKey: ['public', 'group-memberships'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['public', 'group-events'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['private', auth.sessionSubject, 'groups'],
      })
    },
  }
  const operationLinks = [
    {
      label: 'Eventos',
      to: '/grupos/$groupId/gerenciar/eventos',
      enabled: canOrganizeEvents(own.permissions),
    },
    {
      label: 'Pessoas e convites',
      to: '/grupos/$groupId/gerenciar/pessoas',
      enabled:
        own.permissions.includes('MEMBER_MANAGE') ||
        own.permissions.includes('ROLE_MANAGE'),
    },
  ] as const
  const configurationLinks = [
    {
      label: 'Perfil',
      to: '/grupos/$groupId/gerenciar/perfil',
      enabled:
        own.permissions.includes('GROUP_EDIT') ||
        own.permissions.includes('GROUP_TAG_MANAGE'),
    },
    {
      label: 'Acessos',
      to: '/grupos/$groupId/gerenciar/acessos',
      enabled: own.permissions.includes('ROLE_MANAGE'),
    },
  ] as const
  return (
    <context.Provider value={value}>
      <PageContainer>
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Espaço de trabalho
            </p>
            <h1 className="flex items-center gap-3 text-xl font-extrabold sm:text-2xl">
              <GroupAvatar
                mediaId={group.data.avatarMediaId}
                name={group.data.name}
              />
              {group.data.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold">
            <Link
              to="/meus-grupos"
              className="pomi-focus inline-flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft aria-hidden="true" className="size-4" /> Meus grupos
            </Link>
            <Link
              to="/grupos/$groupId"
              params={{ groupId: String(groupId) }}
              className="pomi-focus text-primary hover:underline"
            >
              Perfil público
            </Link>
          </div>
        </header>
        <div className="grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <nav
            aria-label="Espaço de trabalho do grupo"
            className="flex min-w-0 flex-wrap gap-5 lg:flex-col"
          >
            {[
              { label: 'Operação', items: operationLinks },
              { label: 'Configurações', items: configurationLinks },
            ].map(({ label, items }) =>
              items.some((item) => item.enabled) ? (
                <div key={label} className="min-w-0 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    {items
                      .filter((item) => item.enabled)
                      .map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          params={{ groupId: String(groupId) }}
                          activeProps={{
                            'aria-current': 'page',
                            className: 'bg-primary text-primary-foreground',
                          }}
                          className="pomi-focus rounded-md border border-border px-3 py-2 text-sm font-bold hover:bg-muted"
                        >
                          {item.label}
                        </Link>
                      ))}
                  </div>
                </div>
              ) : null,
            )}
          </nav>
          <div
            ref={contentRef}
            tabIndex={-1}
            role="region"
            aria-label="Conteúdo do espaço de trabalho"
            className="min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Outlet />
          </div>
        </div>
      </PageContainer>
    </context.Provider>
  )
}
