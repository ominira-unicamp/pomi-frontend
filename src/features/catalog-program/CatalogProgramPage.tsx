import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquareWarning,
} from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'

import {
  compatibleSuggestions,
  suggestionTypeLabel,
} from '@pomi/planner-domain/curriculum'
import { CatalogProgramCourseDialog } from './CatalogProgramCourseDialog'
import type {
  Course,
  CourseRequirement,
  CourseSelector,
  CurriculumBlocks,
  CurriculumPlannerStaticData,
  CurriculumSuggestion,
  SpecializationId,
} from '@pomi/planner-domain/curriculum'
import type { KeyboardEvent } from 'react'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Field, FieldLabel } from '@/components/patterns/Field'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loadCurriculumCatalog } from '@/catalog/data/curriculumCatalogApi'
import { loadCurriculumSuggestions } from '@/features/curriculum-planner/data/curriculumSuggestionApi'
import { useFeedbackReport } from '@/features/feedback/FeedbackReportProvider'
import {
  isApprovedStudentCourseAttempt,
  listStudentCourseAttempts,
} from '@/features/student/data/studentApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import {
  privateQueryKeys,
  publicQueryKeys,
} from '@/integrations/tanstack-query/queryKeys'

export type CatalogProgramTab = 'full' | 'proposal'

export type CatalogProgramSearch = Readonly<{
  catalogId?: number
  programId?: number
  catalogProgramId?: number
  specializationId?: number
  tab: CatalogProgramTab
}>

export type CatalogProgramNavigationOptions = Readonly<{
  resetScroll?: boolean
}>

const currentCatalogYear = new Date().getFullYear()

export function CatalogProgramPage({
  search,
  onSearchChange,
}: {
  search: CatalogProgramSearch
  onSearchChange: (
    search: CatalogProgramSearch,
    options?: CatalogProgramNavigationOptions,
  ) => void
}) {
  const auth = useOptionalAuth()
  const { openFeedback } = useFeedbackReport()
  const { profileQuery, studentId } = useStudentProfile()
  const [markCompleted, setMarkCompleted] = useState(false)
  const attemptsQuery = useQuery({
    queryKey: privateQueryKeys.courseAttempts(
      auth.sessionSubject ?? 'unknown-session',
      studentId,
    ),
    queryFn: () => listStudentCourseAttempts(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
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
  const [selectedCourse, setSelectedCourse] = useState<Course>()

  useEffect(() => {
    const profile = profileQuery.data
    if (
      !staticData ||
      !profile ||
      search.catalogId !== undefined ||
      search.programId !== undefined ||
      search.catalogProgramId !== undefined ||
      search.specializationId !== undefined ||
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

    const specializationId =
      profile.specializationId !== null &&
      selectedCatalogProgram.specializations.some(
        (specialization) =>
          Number(specialization.id) === profile.specializationId,
      )
        ? profile.specializationId
        : undefined

    onSearchChange({
      ...search,
      catalogId: Number(selectedCatalogProgram.catalog.id),
      programId: Number(selectedCatalogProgram.program.id),
      catalogProgramId: Number(selectedCatalogProgram.id),
      specializationId,
    })
  }, [onSearchChange, profileQuery.data, search, staticData])

  const selectedProgram = staticData?.catalogPrograms.find((program) => {
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
  const selectedSpecialization = selectedProgram?.specializations.find(
    (specialization) => Number(specialization.id) === search.specializationId,
  )
  const suggestionsQuery = useQuery({
    queryKey: publicQueryKeys.curriculumSuggestions(
      selectedProgram?.id ?? 'none',
    ),
    queryFn: () => loadCurriculumSuggestions(selectedProgram!.id),
    enabled: Boolean(selectedProgram),
    staleTime: Infinity,
  })

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
  const specializations = selectedProgram
    ? selectedProgram.specializations.map((specialization) => ({
        value: specialization.id,
        label: `${specialization.code} — ${specialization.name}`,
      }))
    : []

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Catálogo acadêmico"
        title="Cursos"
        description="Consulte o currículo pleno e a proposta de cumprimento de currículo de cada curso."
        actions={
          auth.isAuthenticated ? (
            <CompletedCoursesToggle
              checked={markCompleted}
              disabled={!studentId || attemptsQuery.isLoading}
              onClick={() => setMarkCompleted((current) => !current)}
            />
          ) : undefined
        }
      />

      <Card variant="flat" className="mb-8">
        <CardContent className="grid gap-4 p-4 md:grid-cols-3">
          <Field>
            <FieldLabel>Programa</FieldLabel>
            <AutocompleteSelect
              ariaLabel="Programa"
              value={
                selectedProgram?.program.id ?? String(search.programId ?? '')
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
                  .sort((left, right) => right.catalog.year - left.catalog.year)
                  .at(0)
                updateSearch({
                  programId,
                  catalogId: latestCatalogProgram
                    ? Number(latestCatalogProgram.catalog.id)
                    : undefined,
                  catalogProgramId: latestCatalogProgram
                    ? Number(latestCatalogProgram.id)
                    : undefined,
                  specializationId: undefined,
                })
              }}
            />
          </Field>
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
                  specializationId: undefined,
                })
              }}
            />
          </Field>
          {selectedProgram && specializations.length > 0 && (
            <Field>
              <FieldLabel>Habilitação</FieldLabel>
              <AutocompleteSelect
                ariaLabel="Habilitação"
                value={selectedSpecialization?.id ?? ''}
                emptyLabel="Escolha uma habilitação"
                options={specializations}
                placeholder="Escolha uma habilitação"
                onValueChange={(value) =>
                  updateSearch({
                    specializationId: value ? Number(value) : undefined,
                  })
                }
              />
            </Field>
          )}
        </CardContent>
      </Card>

      {!selectedProgram ? (
        <EmptyState
          title="Escolha um curso"
          description="Selecione um catálogo e um programa para consultar suas informações curriculares."
        />
      ) : (
        <>
          <PageHeader
            compact
            title={`${selectedProgram.program.code} — ${selectedProgram.program.name}`}
            description={`Catálogo ${selectedProgram.catalog.year}`}
            actions={
              <Button
                variant="outline"
                onClick={() =>
                  openFeedback({
                    kind: 'DATA_ISSUE',
                    target: {
                      type: 'ACADEMIC_RESOURCE',
                      academicResourceType: 'CATALOG_PROGRAM',
                      academicResourceId: Number(selectedProgram.id),
                    },
                    title: `Informação do catálogo ${selectedProgram.catalog.year} — ${selectedProgram.program.code}`,
                  })
                }
              >
                <MessageSquareWarning /> Reportar dado incorreto do catálogo
              </Button>
            }
          />
          <Tabs
            value={search.tab}
            onValueChange={(value) =>
              updateSearch(
                { tab: value as CatalogProgramTab },
                { resetScroll: false },
              )
            }
          >
            <TabsList aria-label="Informações curriculares do curso">
              <TabsTrigger value="full">Currículo pleno</TabsTrigger>
              <TabsTrigger value="proposal">Proposta de currículo</TabsTrigger>
            </TabsList>
            <TabsContent value="full">
              <FullCurriculum
                program={selectedProgram}
                courses={staticData.courses}
                specialization={selectedSpecialization}
                onOpenCourseDetails={setSelectedCourse}
                completedCourseIds={completedCourseIds}
                markCompleted={markCompleted}
              />
            </TabsContent>
            <TabsContent value="proposal">
              <CurriculumProposal
                suggestions={suggestionsQuery.data ?? []}
                specializationId={selectedSpecialization?.id}
                isLoading={suggestionsQuery.isLoading}
                isError={suggestionsQuery.isError}
                onRetry={() => void suggestionsQuery.refetch()}
                onOpenCourseDetails={setSelectedCourse}
                completedCourseIds={completedCourseIds}
                markCompleted={markCompleted}
              />
            </TabsContent>
          </Tabs>
          <CatalogProgramCourseDialog
            course={selectedCourse}
            catalogYear={currentCatalogYear}
            onOpenChange={(open) => {
              if (!open) setSelectedCourse(undefined)
            }}
          />
        </>
      )}
    </PageContainer>
  )
}

function CompletedCoursesToggle({
  checked,
  disabled,
  onClick,
}: {
  checked: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border-2 border-border bg-background px-3 py-2">
      <span className="text-xs font-black tracking-[0.08em] text-muted-foreground uppercase">
        Visualização
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="Mostrar disciplinas concluídas"
        disabled={disabled}
        onClick={onClick}
        className="pomi-focus inline-flex items-center gap-2 text-sm font-bold text-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <span
          aria-hidden="true"
          className={`relative inline-flex h-5 w-9 items-center rounded-full border-2 border-strong-border transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}
        >
          <span
            className={`size-3 rounded-full bg-background transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
          />
        </span>
        Concluídas
      </button>
    </div>
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

function FullCurriculum({
  program,
  courses,
  specialization,
  onOpenCourseDetails,
  completedCourseIds,
  markCompleted,
}: {
  program: CurriculumPlannerStaticData['catalogPrograms'][number]
  courses: ReadonlyArray<Course>
  specialization?: CurriculumPlannerStaticData['catalogPrograms'][number]['specializations'][number]
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
}) {
  return (
    <div className="space-y-8">
      <CurriculumSection
        sectionKey="base"
        title="Núcleo comum ao curso"
        blocks={program.baseBlocks}
        courses={courses}
        onOpenCourseDetails={onOpenCourseDetails}
        completedCourseIds={completedCourseIds}
        markCompleted={markCompleted}
      />
      {program.languages.length > 0 && (
        <section aria-labelledby="language-options-title" className="space-y-5">
          <SectionHeading
            id="language-options-title"
            title="Opções por língua"
          />
          {program.languages.map((language) => (
            <CurriculumSection
              key={language.id}
              sectionKey={`language-${language.id}`}
              title={language.name}
              blocks={language.blocks}
              courses={courses}
              onOpenCourseDetails={onOpenCourseDetails}
              completedCourseIds={completedCourseIds}
              markCompleted={markCompleted}
              nested
            />
          ))}
        </section>
      )}
      {program.specializations.length > 0 && specialization && (
        <section aria-labelledby="specialization-title" className="space-y-5">
          <div>
            <SectionHeading
              id="specialization-title"
              title={`${specialization.code} — ${specialization.name}`}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Além do núcleo comum, o aluno deverá cumprir:
            </p>
          </div>
          <CurriculumSection
            sectionKey={`specialization-${specialization.id}`}
            title="Disciplinas da habilitação"
            blocks={specialization.blocks}
            courses={courses}
            onOpenCourseDetails={onOpenCourseDetails}
            completedCourseIds={completedCourseIds}
            markCompleted={markCompleted}
          />
        </section>
      )}
      {program.specializations.length > 0 && !specialization && (
        <EmptyState
          title="Escolha uma habilitação"
          description="Selecione uma habilitação acima para consultar as disciplinas específicas do currículo pleno."
        />
      )}
    </div>
  )
}

function CurriculumSection({
  sectionKey,
  title,
  blocks,
  courses,
  onOpenCourseDetails,
  completedCourseIds,
  markCompleted,
  nested = false,
}: {
  sectionKey: string
  title: string
  blocks: CurriculumBlocks
  courses: ReadonlyArray<Course>
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
  nested?: boolean
}) {
  return (
    <section
      className={nested ? 'rounded-lg border-2 border-border p-4' : undefined}
    >
      {!nested && <SectionHeading title={title} />}
      {nested && <h3 className="mb-4 text-lg font-extrabold">{title}</h3>}
      <div className="space-y-6">
        {blocks.mandatory.length > 0 && (
          <RequirementTable
            requirementKeyPrefix={`${sectionKey}-mandatory`}
            title="Disciplinas obrigatórias"
            requirements={blocks.mandatory}
            courses={courses}
            onOpenCourseDetails={onOpenCourseDetails}
            completedCourseIds={completedCourseIds}
            markCompleted={markCompleted}
          />
        )}
        {blocks.electives.map((block, index) => (
          <RequirementTable
            key={`${sectionKey}-elective-${index}`}
            requirementKeyPrefix={`${sectionKey}-elective-${index}`}
            title={`Disciplinas eletivas ${roman(index + 1)}`}
            subtitle={`Obtenha ${block.requiredCredits} créditos dentre as opções abaixo.`}
            requirements={block.eligibleCourses.map((selector) => ({
              type: 'course',
              source: { type: 'base' },
              selector,
            }))}
            courses={courses}
            onOpenCourseDetails={onOpenCourseDetails}
            completedCourseIds={completedCourseIds}
            markCompleted={markCompleted}
          />
        ))}
      </div>
    </section>
  )
}

function RequirementTable({
  requirementKeyPrefix,
  title,
  subtitle,
  requirements,
  courses,
  onOpenCourseDetails,
  completedCourseIds,
  markCompleted,
}: {
  requirementKeyPrefix: string
  title: string
  subtitle?: string
  requirements: ReadonlyArray<CourseRequirement>
  courses: ReadonlyArray<Course>
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
}) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="text-base font-extrabold">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="overflow-x-auto rounded-md border-2 border-border">
        <table className="w-full min-w-[32rem] table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-36" />
            <col className="w-28" />
            <col />
          </colgroup>
          <thead className="bg-muted/60 text-xs font-black tracking-[0.08em] uppercase">
            <tr>
              <th className="border-b-2 border-border px-3 py-2">Código</th>
              <th className="border-b-2 border-border px-3 py-2">Créditos</th>
              <th className="border-b-2 border-border px-3 py-2">Nome</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((requirement, index) => (
              <RequirementRow
                key={`${requirementKeyPrefix}-${index}`}
                requirement={requirement}
                requirementKey={`${requirementKeyPrefix}-${index}`}
                courses={courses}
                onOpenCourseDetails={onOpenCourseDetails}
                completedCourseIds={completedCourseIds}
                markCompleted={markCompleted}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function RequirementRow({
  requirement,
  requirementKey,
  courses,
  onOpenCourseDetails,
  completedCourseIds,
  markCompleted,
}: {
  requirement: CourseRequirement
  requirementKey: string
  courses: ReadonlyArray<Course>
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const row = requirementRow(requirement.selector, courses)
  const course = row.courseId
    ? courses.find((item) => item.id === row.courseId)
    : undefined
  const prefix =
    requirement.selector.type === 'prefix'
      ? requirement.selector.prefix.trim().toUpperCase()
      : undefined
  const expandedRowId = `${requirementKey}-prefix-courses`
  const toggleExpanded = () => setExpanded((current) => !current)
  const openCourse = () => {
    if (course) onOpenCourseDetails(course)
  }
  const isCompleted =
    markCompleted && course ? completedCourseIds.has(Number(course.id)) : false
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (prefix) toggleExpanded()
      else openCourse()
    }
  }
  const isInteractive = Boolean(prefix || course)

  return (
    <Fragment>
      <tr
        className={`border-b border-border last:border-b-0${isInteractive ? ' cursor-pointer hover:bg-muted/40' : ''}${isCompleted ? ' line-through opacity-60' : ''}`}
        {...(isInteractive
          ? {
              role: 'button',
              tabIndex: 0,
              'aria-label': prefix
                ? `${expanded ? 'Recolher' : 'Expandir'} ${row.code}`
                : `Ver informações de ${row.code}`,
              ...(prefix
                ? {
                    'aria-expanded': expanded,
                    'aria-controls': expandedRowId,
                  }
                : {}),
              onClick: prefix ? toggleExpanded : openCourse,
              onKeyDown: handleKeyDown,
            }
          : {})}
      >
        <td className="px-3 py-2 font-mono font-bold">
          {row.courseId ? (
            <Link
              className="text-primary underline-offset-4 hover:underline"
              to="/disciplinas/$courseId"
              params={{ courseId: row.courseId }}
              search={{ catalogYear: currentCatalogYear }}
              onClick={(event) => event.stopPropagation()}
            >
              {row.code}
            </Link>
          ) : (
            row.code
          )}
        </td>
        <td className="px-3 py-2 font-semibold">{row.credits ?? '—'}</td>
        <td className={`relative px-3 py-2${isInteractive ? ' pr-10' : ''}`}>
          {row.name}
          {prefix && (
            <ChevronDown
              aria-hidden="true"
              className={`absolute top-1/2 right-3 size-4 -translate-y-1/2 transition-transform${
                expanded ? ' rotate-180' : ''
              }`}
            />
          )}
          {course && !prefix && (
            <ChevronRight
              aria-hidden="true"
              className="absolute top-1/2 right-3 size-4 -translate-y-1/2"
            />
          )}
        </td>
      </tr>
      {prefix && expanded && (
        <tr id={expandedRowId} className="border-b border-border">
          <td colSpan={3} className="bg-muted/20 p-4">
            <PrefixCourses
              prefix={prefix}
              courses={courses}
              onOpenCourseDetails={onOpenCourseDetails}
              completedCourseIds={completedCourseIds}
              markCompleted={markCompleted}
            />
          </td>
        </tr>
      )}
    </Fragment>
  )
}

const prefixPageSize = 10

function PrefixCourses({
  prefix,
  courses,
  onOpenCourseDetails,
  completedCourseIds,
  markCompleted,
}: {
  prefix: string
  courses: ReadonlyArray<Course>
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
}) {
  const [page, setPage] = useState(1)
  const matchingCourses = courses.filter(
    (course) =>
      (course.prefix ?? course.code.slice(0, prefix.length)).toUpperCase() ===
      prefix,
  )
  const totalPages = Math.max(
    1,
    Math.ceil(matchingCourses.length / prefixPageSize),
  )
  const visibleCourses = matchingCourses.slice(
    (page - 1) * prefixPageSize,
    page * prefixPageSize,
  )

  useEffect(() => setPage(1), [prefix])

  if (matchingCourses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma disciplina encontrada para o prefixo {prefix}.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold">
        Disciplinas que atendem ao requisito {prefix}---
      </p>
      <div className="overflow-x-auto rounded-md border-2 border-border bg-background">
        <table className="w-full min-w-[32rem] table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-36" />
            <col className="w-28" />
            <col />
          </colgroup>
          <thead className="bg-muted/60 text-xs font-black tracking-[0.08em] uppercase">
            <tr>
              <th className="border-b-2 border-border px-3 py-2">Código</th>
              <th className="border-b-2 border-border px-3 py-2">Créditos</th>
              <th className="border-b-2 border-border px-3 py-2">Nome</th>
            </tr>
          </thead>
          <tbody>
            {visibleCourses.map((course) => (
              <tr
                key={course.id}
                className={`cursor-pointer border-b border-border hover:bg-muted/40 last:border-b-0${markCompleted && completedCourseIds.has(Number(course.id)) ? ' line-through opacity-60' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`Ver informações de ${course.code}`}
                onClick={() => onOpenCourseDetails(course)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onOpenCourseDetails(course)
                  }
                }}
              >
                <td className="px-3 py-2 font-mono font-bold">
                  <Link
                    className="text-primary underline-offset-4 hover:underline"
                    to="/disciplinas/$courseId"
                    params={{ courseId: String(course.id) }}
                    search={{ catalogYear: currentCatalogYear }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {course.code}
                  </Link>
                </td>
                <td className="px-3 py-2 font-semibold">{course.credits}</td>
                <td className="relative pr-10 pl-3 py-2">
                  {course.name}
                  <ChevronRight
                    aria-hidden="true"
                    className="absolute top-1/2 right-3 size-4 -translate-y-1/2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <nav
          className="flex flex-wrap items-center justify-center gap-3"
          aria-label={`Paginação das disciplinas do prefixo ${prefix}`}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            <ChevronLeft /> Anterior
          </Button>
          <span className="text-sm font-bold">
            Página {page} de {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Próxima <ChevronRight />
          </Button>
        </nav>
      )}
    </div>
  )
}

function requirementRow(
  selector: CourseSelector,
  courses: ReadonlyArray<Course>,
) {
  if (selector.type === 'specificCourse') {
    const course = courses.find((item) => item.id === selector.courseId)
    return {
      code: course?.code ?? '—',
      credits: course?.credits,
      name: course?.name ?? 'Disciplina não encontrada',
      courseId: course ? String(course.id) : undefined,
    }
  }
  if (selector.type === 'prefix') {
    const code = `${selector.prefix.trim().toUpperCase()}---`
    return {
      code,
      name: `Qualquer disciplina com código ${code}`,
    }
  }
  return {
    code: '-----',
    name: 'Qualquer disciplina oferecida pela Unicamp',
  }
}

function CurriculumProposal({
  suggestions,
  specializationId,
  isLoading,
  isError,
  onRetry,
  onOpenCourseDetails,
  completedCourseIds,
  markCompleted,
}: {
  suggestions: ReadonlyArray<CurriculumSuggestion>
  specializationId?: SpecializationId
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
}) {
  if (isLoading)
    return <LoadingState label="Carregando proposta de currículo" />
  if (isError) {
    return (
      <ErrorState
        title="Não foi possível carregar as propostas"
        description="Tente novamente para consultar as propostas deste curso."
        action={{ label: 'Tentar novamente', onClick: onRetry }}
      />
    )
  }

  const visibleSuggestions = compatibleSuggestions(
    suggestions,
    specializationId,
  )
  if (visibleSuggestions.length === 0) {
    return (
      <EmptyState
        title="Nenhuma proposta encontrada"
        description="Não há proposta de cumprimento de currículo disponível para a seleção atual."
      />
    )
  }

  return (
    <div className="space-y-8">
      {visibleSuggestions.map((suggestion) => (
        <section
          key={suggestion.id}
          aria-labelledby={`suggestion-${suggestion.id}`}
        >
          <div className="mb-4 border-b-2 border-strong-border pb-3">
            <p className="text-xs font-black tracking-[0.14em] text-primary uppercase">
              {suggestionTypeLabel(suggestion.type)}
            </p>
            <h2
              id={`suggestion-${suggestion.id}`}
              className="mt-1 text-xl font-extrabold"
            >
              {suggestion.code} — {suggestion.name}
            </h2>
            {suggestion.specialization && (
              <p className="mt-1 text-sm text-muted-foreground">
                {suggestion.specialization.code} —{' '}
                {suggestion.specialization.name}
              </p>
            )}
          </div>
          <div className="space-y-4">
            {suggestion.semesters.map((semester) => (
              <Card key={semester.semester} variant="flat">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <h3 className="font-extrabold">
                      {semester.semester}º semestre
                    </h3>
                    {semester.electiveCredits > 0 && (
                      <span className="text-sm font-bold text-muted-foreground">
                        {semester.electiveCredits} créditos eletivos
                      </span>
                    )}
                  </div>
                  <div className="overflow-x-auto rounded-md border-2 border-border">
                    <table className="w-full min-w-[28rem] table-fixed border-collapse text-left text-sm">
                      <colgroup>
                        <col className="w-36" />
                        <col className="w-28" />
                        <col />
                      </colgroup>
                      <thead className="bg-muted/60 text-xs font-black tracking-[0.08em] uppercase">
                        <tr>
                          <th className="border-b-2 border-border px-3 py-2">
                            Código
                          </th>
                          <th className="border-b-2 border-border px-3 py-2">
                            Créditos
                          </th>
                          <th className="border-b-2 border-border px-3 py-2">
                            Nome
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.courses.map((course) => (
                          <tr
                            key={course.id}
                            className={`cursor-pointer border-b border-border hover:bg-muted/40 last:border-b-0${markCompleted && completedCourseIds.has(Number(course.id)) ? ' line-through opacity-60' : ''}`}
                            role="button"
                            tabIndex={0}
                            aria-label={`Ver informações de ${course.code}`}
                            onClick={() => onOpenCourseDetails(course)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault()
                                onOpenCourseDetails(course)
                              }
                            }}
                          >
                            <td className="px-3 py-2 font-mono font-bold">
                              <Link
                                className="text-primary underline-offset-4 hover:underline"
                                to="/disciplinas/$courseId"
                                params={{ courseId: String(course.id) }}
                                search={{ catalogYear: currentCatalogYear }}
                                onClick={(event) => event.stopPropagation()}
                              >
                                {course.code}
                              </Link>
                            </td>
                            <td className="px-3 py-2 font-semibold">
                              {course.credits}
                            </td>
                            <td className="relative pr-10 pl-3 py-2">
                              {course.name}
                              <ChevronRight
                                aria-hidden="true"
                                className="absolute top-1/2 right-3 size-4 -translate-y-1/2"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function SectionHeading({ id, title }: { id?: string; title: string }) {
  return (
    <h2 id={id} className="border-b-2 border-primary pb-2 text-xl font-black">
      {title}
    </h2>
  )
}

function roman(value: number) {
  return (
    ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][value - 1] ??
    String(value)
  )
}
