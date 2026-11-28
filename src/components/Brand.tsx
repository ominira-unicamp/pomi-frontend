import { Link } from '@tanstack/react-router'

import { PomiMark } from './PomiMark'
import { cn } from '@/lib/utils'

export function Brand({
  compact = false,
  surface = 'sidebar',
}: {
  compact?: boolean
  surface?: 'sidebar' | 'page'
}) {
  return (
    <Link
      to="/"
      aria-label="POMI — ir para o início"
      className={cn(
        'pomi-focus inline-flex items-center gap-3 rounded-sm',
        surface === 'page' ? 'text-foreground' : 'text-sidebar-foreground',
      )}
    >
      <span className="grid size-11 place-items-center">
        <PomiMark />
      </span>
      <span
        className={cn(
          'text-xl font-black tracking-[-0.06em]',
          compact && 'sr-only',
        )}
      >
        POMI
      </span>
    </Link>
  )
}
