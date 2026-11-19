import { createFileRoute, useNavigate } from '@tanstack/react-router'

import type {
  CatalogProgramNavigationOptions,
  CatalogProgramSearch,
} from '@/features/catalog-program'
import { CatalogProgramPage } from '@/features/catalog-program'

export const Route = createFileRoute('/cursos/$programId')({
  validateSearch: (search: Record<string, unknown>): CatalogProgramSearch => ({
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
  component: CursosDetailsRoute,
})

function CursosDetailsRoute() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const params = Route.useParams()
  return (
    <CatalogProgramPage
      fixedProgram
      search={{ ...search, programId: Number(params.programId) }}
      onSearchChange={(nextSearch, options?: CatalogProgramNavigationOptions) =>
        void navigate({
          to: '/cursos/$programId',
          params,
          search: nextSearch,
          ...options,
        })
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
