import { createFileRoute, useNavigate } from '@tanstack/react-router'

import type {
  CatalogProgramNavigationOptions,
  CatalogProgramSearch,
} from '@/features/catalog-program'
import { CatalogProgramPage } from '@/features/catalog-program'

export const Route = createFileRoute('/cursos/')({
  validateSearch: (search: Record<string, unknown>): CatalogProgramSearch => ({
    catalogId: readPositiveInteger(search.catalogId),
    programId: readPositiveInteger(search.programId),
    catalogProgramId: readPositiveInteger(search.catalogProgramId),
    specializationId: readPositiveInteger(search.specializationId),
    dependencyCourseId: readPositiveInteger(search.dependencyCourseId),
    tab:
      search.tab === 'proposal' || search.tab === 'dependencies'
        ? search.tab
        : 'full',
  }),
  component: CursosIndexRoute,
})

function CursosIndexRoute() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  return (
    <CatalogProgramPage
      search={search}
      onSearchChange={(nextSearch, options?: CatalogProgramNavigationOptions) =>
        void navigate({ to: '/cursos', search: nextSearch, ...options })
      }
    />
  )
}

function readPositiveInteger(value: unknown) {
  const number = typeof value === 'string' ? Number(value) : value
  return typeof number === 'number' && Number.isInteger(number) && number > 0
    ? number
    : undefined
}
