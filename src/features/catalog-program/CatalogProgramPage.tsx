import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { catalogProgramVariantForSelection } from '@pomi/planner-domain/curriculum'
import type { CurriculumPlannerStaticData } from '@pomi/planner-domain/curriculum'
import { ContextLink as Link } from '@/app/navigation/NavigationContext'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { EmptyState, ErrorState, LoadingState, PageContainer, PageHeader } from '@/components/PageLayout'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Field, FieldLabel } from '@/components/patterns/Field'
import { Card, CardContent } from '@/components/ui/card'
import { loadCurriculumCatalog } from '@/catalog/data/curriculumCatalogApi'
import { isApprovedStudentCourseAttempt, listStudentCourseAttempts } from '@/academic-record/data/studentApi'
import { useStudentAcademicProfile } from '@/features/student/hooks/useStudentAcademicProfile'
import { privateQueryKeys, publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'

import { CatalogProgramDetails, CompletedCoursesToggle } from '@/features/catalog-program/CatalogProgramDetails'

export type CatalogProgramTab = 'full' | 'proposal' | 'dependencies' | 'about'

export type CatalogProgramSearch = Readonly<{
  catalogId?: number
  programId?: number
  catalogProgramId?: number
  catalogProgramVariantId?: number
  dependencyCourseId?: number
  tab: CatalogProgramTab
}>

export type CatalogProgramNavigationOptions = Readonly<{
  resetScroll?: boolean
}>

export function CatalogProgramPage({
  search,
  onSearchChange,
  fixedProgram = false,
}: {
  fixedProgram?: boolean
  search: CatalogProgramSearch
  onSearchChange: (
    search: CatalogProgramSearch,
    options?: CatalogProgramNavigationOptions,
  ) => void
}) {
  const auth = useOptionalAuth()
  const { profileQuery, userId } = useStudentAcademicProfile()
  const [markCompleted, setMarkCompleted] = useState(false)
  const attemptsQuery = useQuery({
    queryKey: privateQueryKeys.courseAttempts(
      auth.sessionSubject ?? 'unknown-session',
      userId,
    ),
    queryFn: () => listStudentCourseAttempts(userId!, auth.getAccessToken),
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
  })
  const completedCourseIds = useMemo(
    () =>
      new Set(
        (attemptsQuery.data ?? [])
          .filter(isApprovedStudentCourseAttempt)
          .map((attempt) => attempt.courseId),
      ),
    [attemptsQuery.data],
  )
  const catalogQuery = useQuery({
    queryKey: publicQueryKeys.curriculumCatalog(),
    queryFn: async () => {
      const result = await loadCurriculumCatalog()
      if (!result.ok) throw new Error(result.error.code)
      return result.value
    },
    staleTime: Infinity,
  })
  const staticData = catalogQuery.data

  useEffect(() => {
    const profile = profileQuery.data
    if (
      !staticData ||
      !profile ||
      search.catalogId !== undefined ||
      search.programId !== undefined ||
      search.catalogProgramId !== undefined ||
      search.catalogProgramVariantId !== undefined ||
      profile.programId === null
    )
      return

    const programCatalogs = staticData.catalogPrograms.filter(
      (program) => Number(program.program.id) === profile.programId,
    )
    if (programCatalogs.length === 0) return

    const latestCatalogProgram = [...programCatalogs].sort(
      (left, right) => right.catalog.year - left.catalog.year,
    )[0]
    const selectedCatalogProgram =
      profile.catalogId === null
        ? latestCatalogProgram
        : (programCatalogs.find(
            (program) => Number(program.catalog.id) === profile.catalogId,
          ) ?? latestCatalogProgram)

    const catalogProgramVariantId = Number(
      catalogProgramVariantForSelection(
        selectedCatalogProgram,
        profile.specializationId,
      )?.id,
    )

    onSearchChange({
      ...search,
      catalogId: Number(selectedCatalogProgram.catalog.id),
      programId: Number(selectedCatalogProgram.program.id),
      catalogProgramId: Number(selectedCatalogProgram.id),
      catalogProgramVariantId: Number.isInteger(catalogProgramVariantId)
        ? catalogProgramVariantId
        : undefined,
    })
  }, [onSearchChange, profileQuery.data, search, staticData])

  const selectedProgram = [...(staticData?.catalogPrograms ?? [])]
    .sort((left, right) => right.catalog.year - left.catalog.year)
    .find((program) => {
      const matchesProgram =
        search.programId !== undefined
          ? Number(program.program.id) === search.programId
          : Number(program.id) === search.catalogProgramId
      return (
        matchesProgram &&
        (search.catalogId === undefined ||
          Number(program.catalog.id) === search.catalogId)
      )
    })
  const selectedVariant = selectedProgram
    ? (selectedProgram.variants.find(
        (variant) => Number(variant.id) === search.catalogProgramVariantId,
      ) ?? catalogProgramVariantForSelection(selectedProgram))
    : undefined

  const updateSearch = (
    change: Partial<CatalogProgramSearch>,
    options?: CatalogProgramNavigationOptions,
  ) => {
    const nextSearch = { ...search, ...change }
    if (options) onSearchChange(nextSearch, options)
    else onSearchChange(nextSearch)
  }

  if (catalogQuery.isLoading) {
    return <LoadingState label="Carregando cursos e currículos" />
  }
  if (catalogQuery.isError || !staticData) {
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível carregar os cursos"
          description="Tente novamente para consultar os catálogos e currículos disponíveis."
          action={{
            label: 'Tentar novamente',
            onClick: () => void catalogQuery.refetch(),
          }}
        />
      </PageContainer>
    )
  }

  const selectedProgramId =
    search.programId ??
    (selectedProgram ? Number(selectedProgram.program.id) : undefined)
  const catalogs = catalogOptions(staticData, selectedProgramId)
  const programs = programOptions(staticData)
  const variants = selectedProgram
    ? selectedProgram.variants.map((variant) => ({
        value: variant.id,
        label:
          variant.specializationId === null
            ? variant.name
            : `${variant.code} — ${variant.name}`,
      }))
    : []
  const catalogField = (
    <Field>
      <FieldLabel>Catálogo</FieldLabel>
      <AutocompleteSelect
        ariaLabel="Catálogo"
        value={selectedProgram?.catalog.id ?? ''}
        options={catalogs}
        disabled={!selectedProgramId || catalogs.length === 0}
        placeholder={
          selectedProgramId
            ? 'Escolha o catálogo'
            : 'Escolha um programa primeiro'
        }
        onValueChange={(value) => {
          const catalogProgram = staticData.catalogPrograms.find(
            (program) =>
              Number(program.program.id) === selectedProgramId &&
              Number(program.catalog.id) === Number(value),
          )
          updateSearch({
            catalogId: value ? Number(value) : undefined,
            programId: selectedProgramId || undefined,
            catalogProgramId: catalogProgram
              ? Number(catalogProgram.id)
              : undefined,
            catalogProgramVariantId: catalogProgram
              ? Number(catalogProgramVariantForSelection(catalogProgram)?.id) ||
                undefined
              : undefined,
          })
        }}
      />
    </Field>
  )
  const variantField = selectedProgram && variants.length > 1 && (
    <Field>
      <FieldLabel>Modalidade</FieldLabel>
      <AutocompleteSelect
        ariaLabel="Modalidade"
        value={selectedVariant?.id ?? ''}
        emptyLabel="Escolha uma modalidade"
        options={variants}
        placeholder="Escolha uma modalidade"
        onValueChange={(value) =>
          updateSearch({
            catalogProgramVariantId: value ? Number(value) : undefined,
          })
        }
      />
    </Field>
  )

  return (
    <PageContainer>
      {fixedProgram && (
        <Link
          to="/cursos"
          search={{ tab: 'full' }}
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <ChevronLeft aria-hidden="true" className="size-4" /> Todos os cursos
        </Link>
      )}
      <PageHeader
        eyebrow="Catálogo acadêmico"
        title={
          fixedProgram
            ? selectedProgram
              ? `${selectedProgram.program.code} — ${selectedProgram.program.name}`
              : 'Curso'
            : 'Cursos'
        }
        description={
          selectedProgram
            ? `Catálogo ${selectedProgram.catalog.year}`
            : 'Consulte os currículos e as informações de cada curso por catálogo e modalidade.'
        }
        actions={
          auth.isAuthenticated ? (
            <CompletedCoursesToggle
              checked={markCompleted}
              disabled={!userId || attemptsQuery.isLoading}
              onClick={() => setMarkCompleted((current) => !current)}
            />
          ) : undefined
        }
      />

      {(!fixedProgram || !selectedProgram) && (
        <Card variant="flat" className="mb-8">
          <CardContent className="grid gap-4 p-4 md:grid-cols-3">
            {!fixedProgram && (
              <Field>
                <FieldLabel>Programa</FieldLabel>
                <AutocompleteSelect
                  ariaLabel="Programa"
                  value={
                    selectedProgram?.program.id ??
                    String(search.programId ?? '')
                  }
                  options={programs}
                  placeholder="Escolha o programa"
                  onValueChange={(value) => {
                    const programId = value ? Number(value) : undefined
                    const latestCatalogProgram = staticData.catalogPrograms
                      .filter(
                        (program) =>
                          programId !== undefined &&
                          Number(program.program.id) === programId,
                      )
                      .sort(
                        (left, right) => right.catalog.year - left.catalog.year,
                      )
                      .at(0)
                    updateSearch({
                      programId,
                      catalogId: latestCatalogProgram
                        ? Number(latestCatalogProgram.catalog.id)
                        : undefined,
                      catalogProgramId: latestCatalogProgram
                        ? Number(latestCatalogProgram.id)
                        : undefined,
                      catalogProgramVariantId: latestCatalogProgram
                        ? Number(
                            catalogProgramVariantForSelection(
                              latestCatalogProgram,
                            )?.id,
                          ) || undefined
                        : undefined,
                    })
                  }}
                />
              </Field>
            )}
            {catalogField}
            {variantField}
          </CardContent>
        </Card>
      )}

      {!selectedProgram ? (
        <EmptyState
          title={fixedProgram ? 'Curso não encontrado' : 'Escolha um curso'}
          description={
            fixedProgram
              ? 'O curso ou catálogo solicitado não está disponível. Volte à listagem para escolher outro curso.'
              : 'Selecione um catálogo e um programa para consultar suas informações curriculares.'
          }
        />
      ) : (
        <CatalogProgramDetails
          program={selectedProgram}
          variant={selectedVariant}
          courses={staticData.courses}
          completedCourseIds={completedCourseIds}
          markCompleted={markCompleted}
          search={search}
          onSearchChange={(next, options) => updateSearch(next, options)}
          actions={
            fixedProgram ? (
              <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                <div className="w-full sm:w-72">{catalogField}</div>
                {variantField && (
                  <div className="w-full sm:w-72">{variantField}</div>
                )}
              </div>
            ) : undefined
          }
        />
      )}
    </PageContainer>
  )
}

function catalogOptions(
  staticData: CurriculumPlannerStaticData,
  programId?: number,
) {
  return [
    ...new Map(
      staticData.catalogPrograms
        .filter(
          (program) =>
            programId !== undefined && Number(program.program.id) === programId,
        )
        .map((program) => [
          program.catalog.id,
          {
            value: program.catalog.id,
            label: `Catálogo ${program.catalog.year}`,
          },
        ]),
    ).values(),
  ].sort((left, right) => right.label.localeCompare(left.label, 'pt-BR'))
}

function programOptions(staticData: CurriculumPlannerStaticData) {
  const options = [
    ...new Map(
      staticData.catalogPrograms.map((program) => [
        program.program.id,
        {
          value: program.program.id,
          code: Number(program.program.code),
          label: `${program.program.code} — ${program.program.name}`,
        },
      ]),
    ).values(),
  ].sort(
    (left, right) =>
      left.code - right.code || left.label.localeCompare(right.label, 'pt-BR'),
  )
  return options.map(({ value, label }) => ({ value, label }))
}
export {
  CatalogProgramDetails,
  CompletedCoursesToggle,
} from './CatalogProgramDetails'
export type { CatalogProgramDetailsSearch } from './CatalogProgramDetails'
