import { AlertCircle, Inbox, LoaderCircle } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
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
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b-2 border-strong-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-black tracking-[0.18em] text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
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
    <div
      className="flex min-h-72 items-center justify-center gap-3 text-muted-foreground"
      role="status"
    >
      <LoaderCircle className="size-5 animate-spin" />
      <span className="font-semibold">{label}</span>
    </div>
  )
}
