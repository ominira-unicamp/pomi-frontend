import { AlertCircle, Inbox, LoaderCircle } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function PageContainer({
  className,
  size = 'default',
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: 'default' | 'wide' }) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 py-8 sm:px-8 sm:py-10',
        size === 'default' ? 'max-w-5xl' : 'max-w-7xl',
        className,
      )}
      {...props}
    />
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  compact = false,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  compact?: boolean
}) {
  return (
    <header
      className={cn(
        'flex flex-col border-b-2 border-strong-border sm:flex-row sm:justify-between',
        compact
          ? 'mb-6 gap-3 pb-4 sm:items-center'
          : 'mb-8 gap-5 pb-6 sm:items-start',
      )}
    >
      <div className="min-w-0 flex-1 max-w-3xl">
        {eyebrow && (
          <p
            className={cn(
              'text-xs font-black tracking-[0.18em] text-primary uppercase',
              compact ? 'mb-1' : 'mb-2',
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            'font-black tracking-tight',
            compact ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl',
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              'text-muted-foreground',
              compact ? 'mt-1 text-sm' : 'mt-3 text-base sm:text-lg',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex w-full max-w-full shrink-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:max-w-[60%] sm:justify-end">
          {actions}
        </div>
      )}
    </header>
  )
}

type PageStateProps = {
  title: string
  description: string
  action?: Readonly<{
    label: string
    onClick: () => void
  }>
}

function PageState({
  icon,
  title,
  description,
  action,
}: PageStateProps & { icon: ReactNode }) {
  return (
    <section className="grid min-h-72 place-items-center rounded-lg border-2 border-dashed border-strong-border bg-card px-6 py-12 text-center">
      <div className="max-w-md">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-sm bg-primary text-primary-foreground">
          {icon}
        </span>
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
        {action && (
          <Button className="mt-6" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </section>
  )
}

export function EmptyState(props: PageStateProps) {
  return <PageState icon={<Inbox className="size-6" />} {...props} />
}

export function ErrorState(props: PageStateProps) {
  return <PageState icon={<AlertCircle className="size-6" />} {...props} />
}

export function LoadingState({ label = 'Carregando' }: { label?: string }) {
  return (
    <section
      className="grid min-h-72 place-items-center px-2 py-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-xl rounded-lg border-2 border-strong-border bg-card p-5 shadow-[4px_4px_0_var(--strong-border)] sm:p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <LoaderCircle className="size-5 animate-spin" />
          </span>
          <div className="min-w-0">
            <strong className="block text-base font-extrabold sm:text-lg">
              {label}
            </strong>
            <span className="text-sm text-muted-foreground">
              Organizando as informações para você.
            </span>
          </div>
        </div>
        <div className="mt-6 space-y-3" aria-hidden="true">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
    </section>
  )
}
