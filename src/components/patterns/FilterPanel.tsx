import { SlidersHorizontal } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function FilterPanel({
  title = 'Filtros',
  actions,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title?: string
  actions?: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-lg border-2 border-strong-border bg-card p-4',
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-extrabold">
          <SlidersHorizontal className="size-4" /> {title}
        </h2>
        {actions}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  )
}
