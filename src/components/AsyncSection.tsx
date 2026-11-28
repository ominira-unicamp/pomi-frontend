import { AlertCircle, LoaderCircle, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function AsyncSection({
  children,
  isPending,
  isError,
  isRefreshing = false,
  loadingLabel,
  errorTitle,
  errorDescription,
  onRetry,
}: {
  children: ReactNode
  isPending: boolean
  isError: boolean
  isRefreshing?: boolean
  loadingLabel: string
  errorTitle: string
  errorDescription: string
  onRetry?: () => void
}) {
  if (isPending) {
    return (
      <div
        className="flex min-h-28 items-center justify-center gap-3 rounded-lg border-2 border-dashed border-strong-border bg-card p-5 text-muted-foreground"
        role="status"
      >
        <LoaderCircle className="size-5 animate-spin text-primary" />
        <span className="font-bold">{loadingLabel}</span>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>{errorTitle}</AlertTitle>
        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
          {errorDescription}
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Tentar novamente
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="relative">
      {isRefreshing && (
        <span
          className="absolute top-0 right-0 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground"
          role="status"
        >
          <RefreshCw className="size-3 animate-spin" /> Atualizando
        </span>
      )}
      {children}
    </div>
  )
}
