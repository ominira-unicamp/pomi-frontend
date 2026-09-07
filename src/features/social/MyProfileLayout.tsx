import { Link, Outlet } from '@tanstack/react-router'
import { Bell, Eye, UserRound, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { useOptionalAuth } from '@/auth/AuthProvider'
import { PageContainer, PageHeader } from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { getPublicProfile } from '@/features/friends/studentSocialApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

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
  const profileAction = profileQuery.data?.publicId ? (
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
  )
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Comunidade"
        title="Meu perfil"
        description="Gerencie suas informações públicas e conexões no POMI."
        actions={profileAction}
      />
      <nav aria-label="Seções do seu perfil" className="mb-6">
        <div
          role="tablist"
          aria-label="Seções do seu perfil"
          className="grid w-full grid-cols-1 border-b-2 border-strong-border sm:grid-cols-3"
        >
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
                role="tab"
                className="pomi-focus -mb-0.5 inline-flex min-h-11 items-center justify-center gap-2 border-b-4 border-transparent px-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground aria-[current=page]:border-primary aria-[current=page]:text-foreground"
              >
                <Icon className="size-4" />
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
