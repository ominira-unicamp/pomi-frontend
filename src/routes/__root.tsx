import { Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { WelcomeGate } from '@/workflows/onboarding'
import { NavigationContextProvider } from '@/app/navigation/NavigationContext'
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
  const standalone = useRouterState({
    select: (state) =>
      state.location.pathname.replace(/\/$/, '') === '/boas-vindas',
  })
  return (
    <NavigationContextProvider>
      <WelcomeGate />
      {standalone ? (
        <Outlet />
      ) : (
        <AppShell>
          <Outlet />
        </AppShell>
      )}
    </NavigationContextProvider>
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
