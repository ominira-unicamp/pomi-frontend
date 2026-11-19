import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronRight, Search } from 'lucide-react'
import { useEffect } from 'react'
import type { CatalogProgramSearch } from './CatalogProgramPage'
import { loadCurriculumCatalog } from '@/catalog/data/curriculumCatalogApi'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function CatalogProgramSearchPage({
  search,
  onSearchChange,
}: {
  search: CatalogProgramSearch & { q?: string }
  onSearchChange: (search: CatalogProgramSearch & { q?: string }) => void
}) {
  const navigate = useNavigate()
  const catalogQuery = useQuery({
    queryKey: publicQueryKeys.curriculumCatalog(),
    queryFn: async () => {
      const result = await loadCurriculumCatalog()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    staleTime: Infinity,
  })
  const legacyProgramId =
    search.programId ??
    Number(
      catalogQuery.data?.catalogPrograms.find(
        (item) => Number(item.id) === search.catalogProgramId,
      )?.program.id,
    )
  useEffect(() => {
    if (!Number.isInteger(legacyProgramId) || legacyProgramId <= 0) return
    void navigate({
      to: '/cursos/$programId',
      params: { programId: String(legacyProgramId) },
      search,
      replace: true,
    })
  }, [legacyProgramId, navigate, search])

  const programs = [
    ...new Map(
      [...(catalogQuery.data?.catalogPrograms ?? [])]
        .sort((a, b) => a.catalog.year - b.catalog.year)
        .map((item) => [item.program.id, item]),
    ).values(),
  ].sort((a, b) =>
    a.program.name.localeCompare(b.program.name, 'pt-BR', { numeric: true }),
  )
  const query = normalize(search.q ?? '')
  const visiblePrograms = programs.filter(({ program }) =>
    normalize(`${program.code} ${program.name}`).includes(query),
  )

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Catálogo acadêmico"
        title="Cursos"
        description="Encontre um curso para consultar currículos oficiais, propostas curriculares e pré-requisitos por catálogo e modalidade."
      />
      <label className="relative mb-6 block max-w-xl">
        <span className="sr-only">Buscar cursos por código ou nome</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Código ou nome do curso"
          value={search.q ?? ''}
          onChange={(event) =>
            onSearchChange({ ...search, q: event.target.value || undefined })
          }
          className="h-11 pl-10"
        />
      </label>
      {catalogQuery.isLoading ? (
        <LoadingState label="Carregando cursos" />
      ) : catalogQuery.isError ? (
        <ErrorState
          title="Não foi possível carregar os cursos"
          description="Tente novamente para consultar os cursos disponíveis."
          action={{
            label: 'Tentar novamente',
            onClick: () => void catalogQuery.refetch(),
          }}
        />
      ) : visiblePrograms.length === 0 ? (
        <EmptyState
          title="Nenhum curso encontrado"
          description="Tente buscar por outro código ou nome."
        />
      ) : (
        <>
          <p className="mb-4 text-sm font-bold">
            {visiblePrograms.length}{' '}
            {visiblePrograms.length === 1
              ? 'curso encontrado'
              : 'cursos encontrados'}
          </p>
          <ul className="space-y-4">
            {visiblePrograms.map(({ program, catalog }) => (
              <li key={program.id}>
                <Link
                  to="/cursos/$programId"
                  params={{ programId: String(program.id) }}
                  search={{ tab: 'full' }}
                  className="pomi-focus block rounded-lg"
                >
                  <Card
                    variant="interactive"
                    className="flex items-center gap-4 p-4 sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <h2 className="font-extrabold">
                        <span className="font-mono text-primary">
                          {program.code}
                        </span>{' '}
                        — {program.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Catálogo mais recente: {catalog.year}
                      </p>
                    </div>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-5 shrink-0"
                    />
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </PageContainer>
  )
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
}
