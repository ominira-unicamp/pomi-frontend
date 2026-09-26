import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ContextBackLinkProps = Readonly<{
  to: '/' | '/disciplinas' | '/pessoas' | '/editais-de-intercambio'
  label: string
  className?: string
}>

export function ContextBackLink({
  to,
  label,
  className,
}: ContextBackLinkProps) {
  return (
    <Link
      to={to}
      search={to === '/disciplinas' ? { page: 1 } : undefined}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'mb-4 -ml-3 w-fit',
        className,
      )}
    >
      <ArrowLeft /> {label}
    </Link>
  )
}
