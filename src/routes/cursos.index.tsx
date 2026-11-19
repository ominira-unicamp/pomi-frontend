import { createFileRoute, useNavigate } from '@tanstack/react-router'

import type { CatalogProgramSearch } from '@/features/catalog-program'
import { CatalogProgramSearchPage } from '@/features/catalog-program'

export const Route = createFileRoute('/cursos/')({
  validateSearch: (
    search: Record<string, unknown>,
  ): CatalogProgramSearch & { q?: string } => ({
    q: typeof search.q === 'string' ? search.q : undefined,
    catalogId: readPositiveInteger(search.catalogId),
    programId: readPositiveInteger(search.programId),
    catalogProgramId: readPositiveInteger(search.catalogProgramId),
    catalogProgramVariantId: readPositiveInteger(
      search.catalogProgramVariantId,
    ),
    dependencyCourseId: readPositiveInteger(search.dependencyCourseId),
    tab:
      search.tab === 'proposal' ||
      search.tab === 'dependencies' ||
      search.tab === 'about'
        ? search.tab
        : 'full',
  }),
  component: CursosIndexRoute,
})

function CursosIndexRoute() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  return (
    <CatalogProgramSearchPage
      search={search}
      onSearchChange={(nextSearch) =>
        void navigate({ to: '/cursos', search: nextSearch })
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
