import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { useCurrentUser } from '@/features/identity'
import { AuthRequiredState } from '@/components/AuthRequiredState'
import {
  ErrorState,
  LoadingState,
  PageContainer,
} from '@/components/PageLayout'

export function useAdminAccess() {
  const auth = useOptionalAuth()
  const identity = useCurrentUser()
  const isAdmin =
    auth.initialized &&
    auth.isAuthenticated &&
    !identity.isError &&
    Boolean(identity.data?.roles.includes('ADMIN'))
  return { auth, identity, isAdmin }
}

export function AdminAccess({ children }: { children: ReactNode }) {
  const { auth, identity, isAdmin } = useAdminAccess()
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!isAdmin && auth.sessionSubject) {
      const queryKey = ['private', auth.sessionSubject, 'admin']
      void queryClient
        .cancelQueries({ queryKey })
        .then(() => queryClient.removeQueries({ queryKey }))
    }
  }, [auth.sessionSubject, isAdmin, queryClient])

  if (!auth.initialized || (auth.isAuthenticated && identity.isPending))
    return <LoadingState label="Verificando acesso administrativo" />
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <AuthRequiredState
          title="Entre para acessar a administração"
          description="Esta área é exclusiva para administradores."
          onLogin={() => void auth.login(window.location.href)}
        />
      </PageContainer>
    )
  if (identity.isError)
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível verificar seu acesso"
          description="Tente novamente para consultar suas permissões."
          action={{
            label: 'Tentar novamente',
            onClick: () => void identity.refetch(),
          }}
        />
      </PageContainer>
    )
  if (!isAdmin)
    return (
      <PageContainer>
        <ErrorState
          title="Acesso restrito a administradores"
          description="Sua conta não possui permissão para acessar esta área."
        />
      </PageContainer>
    )
  return children
}
