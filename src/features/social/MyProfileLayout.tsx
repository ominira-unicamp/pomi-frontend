import { Link, Outlet } from '@tanstack/react-router'
import { Bell, Copy, Eye, UserRound, Users } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useOptionalAuth } from '@/auth/AuthProvider'
import { AuthRequiredState } from '@/components/AuthRequiredState'
import {
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { getPublicProfile } from '@/features/friends/studentSocialApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import { PersonAvatar } from '@/features/media/IdentityImages'

const tabs = [
  { to: '/perfil', label: 'Informações', icon: UserRound, exact: true },
  { to: '/perfil/amigos', label: 'Amigos', icon: Users },
  {
    to: '/perfil/solicitacoes',
    label: 'Solicitações',
    icon: Bell,
  },
] as const

export function MyProfileLayout() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const { studentId } = useStudentProfile()
  const profileQuery = useQuery({
    queryKey: privateQueryKeys.studentSocialProfile(sessionSubject, studentId),
    queryFn: () => getPublicProfile(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const copyCode = useMutation({
    mutationFn: () =>
      navigator.clipboard.writeText(profileQuery.data!.publicId),
  })
  const profileAction = (
    <div className="flex flex-wrap items-center gap-2">
      {profileQuery.data?.publicId ? (
        <Link
          to="/perfis/$publicId"
          params={{ publicId: profileQuery.data.publicId }}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <Eye /> Visualizar perfil
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <Eye /> Visualizar perfil
        </Button>
      )}
      {profileQuery.data?.publicId && (
        <Button
          variant="ghost"
          size="sm"
          disabled={copyCode.isPending}
          onClick={() => copyCode.mutate()}
        >
          <Copy aria-hidden="true" /> Copiar código público
        </Button>
      )}
      {copyCode.isSuccess && (
        <p role="status" className="w-full text-xs text-muted-foreground">
          Código público copiado.
        </p>
      )}
      {copyCode.isError && (
        <p role="alert" className="w-full text-xs text-destructive">
          Não foi possível copiar o código. Tente novamente.
        </p>
      )}
    </div>
  )
  if (!auth.initialized)
    return (
      <PageContainer>
        <LoadingState label="Carregando seu perfil" />
      </PageContainer>
    )
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Comunidade"
          title="Meu perfil"
          description="Gerencie suas informações públicas e conexões no POMI."
        />
        <AuthRequiredState
          title="Entre para acessar seu perfil"
          description="Sua conta reúne informações públicas, interesses, amizades e solicitações."
          onLogin={() => void auth.login(window.location.href)}
        />
      </PageContainer>
    )
  return (
    <PageContainer>
      <PageHeader
        compact
        eyebrow="Comunidade"
        title={
          <span className="flex items-center gap-4">
            <PersonAvatar
              mediaId={profileQuery.data?.avatarMediaId}
              name={profileQuery.data?.displayName ?? 'Meu perfil'}
              access="private"
              size="compact"
            />
            <span>Meu perfil</span>
          </span>
        }
        description="Gerencie suas informações públicas e conexões no POMI."
        actions={profileAction}
      />
      <nav aria-label="Seções do seu perfil" className="mb-6">
        <div className="grid w-full grid-cols-3 border-b border-border/40">
          {tabs.map((tab) => {
            const { to, label, icon: Icon } = tab
            const exact = 'exact' in tab && tab.exact
            return (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                activeProps={{
                  'aria-current': 'page',
                  'data-state': 'active',
                }}
                className="pomi-focus -mb-0.5 inline-flex min-h-11 items-center justify-center gap-2 border-b-4 border-transparent px-1 text-xs sm:px-3 sm:text-sm font-bold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground aria-[current=page]:border-primary aria-[current=page]:text-foreground"
              >
                <Icon aria-hidden="true" className="hidden size-4 sm:block" />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
      <Outlet />
    </PageContainer>
  )
}
