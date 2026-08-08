import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="POMI — ir para Planejamento"
      className="pomi-focus inline-flex items-center gap-3 rounded-sm text-sidebar-foreground"
    >
      <span className="grid size-11 place-items-center bg-primary">
        <img
          src="/pomi-logo.svg"
          alt=""
          className="h-9 w-8"
          aria-hidden="true"
        />
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
