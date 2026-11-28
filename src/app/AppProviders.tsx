import { Provider as QueryProvider } from '../integrations/tanstack-query/root-provider'
import { AuthProvider } from '../auth/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import { PrivateQueryCacheBoundary } from '../integrations/tanstack-query/PrivateQueryCacheBoundary'
import { FeedbackReportProvider } from '../features/feedback/FeedbackReportProvider'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export function AppProviders({
  children,
  queryClient,
}: {
  children: ReactNode
  queryClient: QueryClient
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider queryClient={queryClient}>
          <PrivateQueryCacheBoundary>
            <FeedbackReportProvider>{children}</FeedbackReportProvider>
          </PrivateQueryCacheBoundary>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
