import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { AppShell } from '@/components/AppShell'
import { ErrorState, PageContainer } from '@/components/PageLayout'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function RootComponent() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

function NotFoundPage() {
  return (
    <PageContainer>
      <ErrorState
        title="Página não encontrada"
        description="O endereço informado não pertence ao POMI."
      />
    </PageContainer>
  )
}
