import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function DataList({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('divide-y divide-border', className)} {...props} />
}

export function DataRow({
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0',
        interactive &&
          'pomi-focus -mx-2 rounded-md px-2 transition-colors hover:bg-muted',
        className,
      )}
      {...props}
    />
  )
}
