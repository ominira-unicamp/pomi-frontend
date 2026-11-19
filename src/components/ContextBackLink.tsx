import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { useNavigationContext } from '@/components/NavigationContext'
import {
  parseNavigationSearch,
  readReturnTo,
  returnLabel,
} from '@/lib/navigation'
import { cn } from '@/lib/utils'

type ContextBackLinkProps = Readonly<{
  to:
    | '/'
    | '/disciplinas'
    | '/pessoas'
    | '/editais-de-intercambio'
    | '/taxonomia'
    | '/eventos'
  label: string
  search?: {
    q?: string
    categoryId?: number
    interests?: boolean
    order?: 'asc' | 'desc'
  }
  returnTo?: string
  className?: string
}>

export function ContextBackLink({
  to,
  label,
  className,
  search,
  returnTo,
}: ContextBackLinkProps) {
  const location = useNavigationContext()
  const origin = readReturnTo(
    returnTo ?? location.search.returnTo,
    location.pathname,
  )
  const target = origin ? new URL(origin, 'https://pomi.invalid') : undefined
  return (
    <Link
      to={target?.pathname ?? to}
      search={
        target
          ? parseNavigationSearch(target.searchParams)
          : to === '/disciplinas'
            ? { ...search, page: 1 }
            : to === '/taxonomia'
              ? search
              : undefined
      }
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'mb-4 -ml-3 w-fit',
        className,
      )}
    >
      <ArrowLeft /> {origin ? returnLabel(origin) : label}
    </Link>
  )
}
