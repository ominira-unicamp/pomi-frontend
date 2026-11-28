import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronLeft, ChevronRight, MessageSquareWarning, Network } from 'lucide-react'
import { Fragment, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { suggestionLabel } from '@pomi/planner-domain/curriculum'
import type { CatalogProgramNavigationOptions, CatalogProgramSearch, CatalogProgramTab } from './CatalogProgramPage'
import type { CatalogProgramOption, CatalogProgramVariantId, CatalogProgramVariantOption, Course, CourseId, CourseRequirement, CourseSelector, CurriculumBlocks, CurriculumPlannerStaticData, CurriculumSuggestion } from '@pomi/planner-domain/curriculum'
import type { KeyboardEvent, ReactNode } from 'react'
import { scrollElementIntoView } from '@/lib/dom'
import { CatalogProgramAbout } from '@/features/catalog-program/CatalogProgramAbout'
import { CatalogProgramDependencyTree, catalogProgramTreeCourseIds } from '@/features/catalog-program/CatalogProgramDependencyTree'
import { ContextLink as Link } from '@/app/navigation/NavigationContext'
import { CatalogProgramCourseDialog } from '@/catalog/components/CatalogProgramCourseDialog'
import { EmptyState, ErrorState, LoadingState } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loadCatalogPrerequisites } from '@/catalog/data/curriculumPrerequisiteApi'
import { loadCurriculumSuggestions } from '@/catalog/data/curriculumSuggestionApi'
import { useFeedbackReport } from '@/integrations/feedback/FeedbackReportContext'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const CatalogProgramYearContext = createContext(new Date().getFullYear())

export type CatalogProgramDetailsSearch = Pick<
  CatalogProgramSearch,
  'tab' | 'dependencyCourseId'
>

export function CatalogProgramDetails({
  program: selectedProgram,
  variant: selectedVariant,
  courses,
  completedCourseIds,
  markCompleted = false,
  hideCompleted = false,
  search,
  onSearchChange,
  actions,
  embedded = false,
  personalContext,
}: {
  program: CatalogProgramOption
  variant?: CatalogProgramVariantOption
  courses: ReadonlyArray<Course>
  completedCourseIds: ReadonlySet<number>
  markCompleted?: boolean
  hideCompleted?: boolean
  search: CatalogProgramDetailsSearch
  onSearchChange: (
    search: CatalogProgramDetailsSearch,
    options?: CatalogProgramNavigationOptions,
  ) => void
  actions?: ReactNode
  embedded?: boolean
  personalContext?: (course: Course, closeDetails: () => void) => ReactNode
}) {
  const { openFeedback } = useFeedbackReport()
  const tabsContainer = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const revealActiveTab = () => {
      const container = tabsContainer.current
      const active = container?.querySelector<HTMLElement>(
        '[role="tab"][data-state="active"]',
      )
      if (container && active)
        container.scrollLeft = Math.max(
          0,
          active.offsetLeft - (container.clientWidth - active.offsetWidth) / 2,
        )
    }
    revealActiveTab()
    window.addEventListener('resize', revealActiveTab)
    return () => window.removeEventListener('resize', revealActiveTab)
  }, [search.tab])
  const [selectedCourse, setSelectedCourse] = useState<Course>()
  const suggestionsQuery = useQuery({
    queryKey: publicQueryKeys.curriculumSuggestions(selectedProgram.id),
    queryFn: () => loadCurriculumSuggestions(selectedProgram.id),
    staleTime: Infinity,
  })
  const prerequisitesQuery = useQuery({
    queryKey: publicQueryKeys.curriculumPrerequisites(
      selectedProgram.catalog.year,
    ),
    queryFn: () => loadCatalogPrerequisites(selectedProgram.catalog.year),
    staleTime: Infinity,
  })
  const connectedCourseIds = useMemo(() => {
    const courseIds = new Set<string>()
    const eligibleCourseIds = catalogProgramTreeCourseIds(
      selectedProgram,
      selectedVariant,
      true,
    )
    for (const rule of prerequisitesQuery.data?.rules ?? []) {
      if (!eligibleCourseIds.has(rule.courseId)) continue
      for (const alternative of rule.alternatives) {
        for (const item of alternative.allOf) {
          if (
            item.target.type !== 'course' ||
            !eligibleCourseIds.has(item.target.courseId)
          )
            continue
          courseIds.add(String(rule.courseId))
          courseIds.add(String(item.target.courseId))
        }
      }
    }
    return courseIds
  }, [prerequisitesQuery.data, selectedProgram, selectedVariant])

  const updateSearch = (
    change: Partial<CatalogProgramDetailsSearch>,
    options?: CatalogProgramNavigationOptions,
  ) => onSearchChange({ ...search, ...change }, options)
  return (
    <CatalogProgramYearContext.Provider value={selectedProgram.catalog.year}>
      {!embedded && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          {actions}
          <Button
            variant="outline"
            className="max-w-full whitespace-normal text-left"
            onClick={() =>
              openFeedback({
                kind: 'DATA_ISSUE',
                target: {
                  type: 'ACADEMIC_RESOURCE',
                  academicResource: {
                    type: 'CATALOG_PROGRAM',
                    id: Number(selectedProgram.id),
                  },
                },
                title: `Informação do catálogo ${selectedProgram.catalog.year} — ${selectedProgram.program.code}`,
              })
            }
          >
            <MessageSquareWarning /> Reportar dado incorreto do catálogo
          </Button>
        </div>
      )}
      <Tabs
        value={search.tab}
        onValueChange={(value) =>
          updateSearch(
            { tab: value as CatalogProgramTab },
            { resetScroll: false },
          )
        }
      >
        <div ref={tabsContainer} className="relative overflow-x-auto">
          <TabsList
            aria-label="Informações curriculares do curso"
            className="w-max min-w-full grid-cols-4 sm:w-full [&>button]:whitespace-nowrap [&>button]:px-4"
            onFocusCapture={(event) => {
              if (event.target instanceof HTMLElement)
                scrollElementIntoView(event.target, {
                  block: 'nearest',
                  inline: 'nearest',
                })
            }}
          >
            <TabsTrigger value="full">Currículo pleno</TabsTrigger>
            <TabsTrigger value="proposal">Proposta de currículo</TabsTrigger>
            <TabsTrigger value="dependencies">
              Árvore de dependências
            </TabsTrigger>
            <TabsTrigger value="about">Sobre o curso</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="about">
          <CatalogProgramAbout
            program={selectedProgram}
            variant={selectedVariant}
          />
        </TabsContent>
        <TabsContent value="full">
          <FullCurriculum
            program={selectedProgram}
            courses={courses}
            variant={selectedVariant}
            onOpenCourseDetails={setSelectedCourse}
            completedCourseIds={completedCourseIds}
            markCompleted={markCompleted}
            hideCompleted={hideCompleted}
            connectedCourseIds={connectedCourseIds}
            onOpenDependencyTree={(courseId) =>
              updateSearch(
                {
                  tab: 'dependencies',
                  dependencyCourseId: Number(courseId),
                },
                { resetScroll: false },
              )
            }
          />
        </TabsContent>
        <TabsContent value="proposal">
          <CurriculumProposal
            suggestions={suggestionsQuery.data ?? []}
            catalogProgramVariantId={selectedVariant?.id}
            isLoading={suggestionsQuery.isLoading}
            isError={suggestionsQuery.isError}
            onRetry={() => void suggestionsQuery.refetch()}
            onOpenCourseDetails={setSelectedCourse}
            completedCourseIds={completedCourseIds}
            markCompleted={markCompleted}
            hideCompleted={hideCompleted}
            connectedCourseIds={connectedCourseIds}
            onOpenDependencyTree={(courseId) =>
              updateSearch(
                {
                  tab: 'dependencies',
                  dependencyCourseId: Number(courseId),
                },
                { resetScroll: false },
              )
            }
          />
        </TabsContent>
        <TabsContent value="dependencies">
          {prerequisitesQuery.isLoading && (
            <LoadingState label="Carregando árvore de dependências" />
          )}
          {prerequisitesQuery.isError && (
            <ErrorState
              title="Não foi possível carregar a árvore"
              description="Tente novamente para consultar as relações entre as disciplinas."
              action={{
                label: 'Tentar novamente',
                onClick: () => void prerequisitesQuery.refetch(),
              }}
            />
          )}
          {prerequisitesQuery.data && (
            <CatalogProgramDependencyTree
              key={search.dependencyCourseId ?? 'all'}
              program={selectedProgram}
              variant={selectedVariant}
              courses={courses}
              rules={prerequisitesQuery.data.rules}
              completedCourseIds={completedCourseIds}
              hideCompleted={embedded ? hideCompleted : undefined}
              showCompletedToggle={!embedded}
              focusedCourseId={
                search.dependencyCourseId
                  ? (String(search.dependencyCourseId) as CourseId)
                  : undefined
              }
              onOpenCourseDetails={setSelectedCourse}
            />
          )}
        </TabsContent>
      </Tabs>
      <CatalogProgramCourseDialog
        course={selectedCourse}
        catalogYear={selectedProgram.catalog.year}
        personalContext={
          selectedCourse
            ? personalContext?.(selectedCourse, () =>
                setSelectedCourse(undefined),
              )
            : undefined
        }
        onOpenChange={(open) => {
          if (!open) setSelectedCourse(undefined)
        }}
      />
    </CatalogProgramYearContext.Provider>
  )
}

export function CompletedCoursesToggle({
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

function FullCurriculum({
  program,
  courses,
  variant,
  onOpenCourseDetails,
  completedCourseIds,
  markCompleted,
  hideCompleted,
  connectedCourseIds,
  onOpenDependencyTree,
}: {
  program: CurriculumPlannerStaticData['catalogPrograms'][number]
  courses: ReadonlyArray<Course>
  variant?: CurriculumPlannerStaticData['catalogPrograms'][number]['variants'][number]
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
  hideCompleted: boolean
  connectedCourseIds: ReadonlySet<string>
  onOpenDependencyTree: (courseId: CourseId) => void
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
        hideCompleted={hideCompleted}
        connectedCourseIds={connectedCourseIds}
        onOpenDependencyTree={onOpenDependencyTree}
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
              hideCompleted={hideCompleted}
              connectedCourseIds={connectedCourseIds}
              onOpenDependencyTree={onOpenDependencyTree}
              nested
            />
          ))}
        </section>
      )}
      {variant && (
        <section aria-labelledby="variant-title" className="space-y-5">
          <div>
            <SectionHeading
              id="variant-title"
              title={`${variant.code} — ${variant.name}`}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Além do núcleo comum, o aluno deverá cumprir:
            </p>
          </div>
          <CurriculumSection
            sectionKey={`variant-${variant.id}`}
            title={'Disciplinas da modalidade'}
            blocks={variant.blocks}
            courses={courses}
            onOpenCourseDetails={onOpenCourseDetails}
            completedCourseIds={completedCourseIds}
            markCompleted={markCompleted}
            hideCompleted={hideCompleted}
            connectedCourseIds={connectedCourseIds}
            onOpenDependencyTree={onOpenDependencyTree}
          />
        </section>
      )}
      {program.variants.length > 0 && !variant && (
        <EmptyState
          title="Escolha uma modalidade"
          description="Selecione uma modalidade acima para consultar as disciplinas específicas do currículo pleno."
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
  hideCompleted,
  connectedCourseIds,
  onOpenDependencyTree,
  nested = false,
}: {
  sectionKey: string
  title: string
  blocks: CurriculumBlocks
  courses: ReadonlyArray<Course>
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
  hideCompleted: boolean
  connectedCourseIds: ReadonlySet<string>
  onOpenDependencyTree: (courseId: CourseId) => void
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
            hideCompleted={hideCompleted}
            connectedCourseIds={connectedCourseIds}
            onOpenDependencyTree={onOpenDependencyTree}
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
            hideCompleted={hideCompleted}
            connectedCourseIds={connectedCourseIds}
            onOpenDependencyTree={onOpenDependencyTree}
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
  hideCompleted,
  connectedCourseIds,
  onOpenDependencyTree,
}: {
  requirementKeyPrefix: string
  title: string
  subtitle?: string
  requirements: ReadonlyArray<CourseRequirement>
  courses: ReadonlyArray<Course>
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
  hideCompleted: boolean
  connectedCourseIds: ReadonlySet<string>
  onOpenDependencyTree: (courseId: CourseId) => void
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
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-20 sm:w-36" />
            <col className="w-20 sm:w-28" />
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
                hideCompleted={hideCompleted}
                connectedCourseIds={connectedCourseIds}
                onOpenDependencyTree={onOpenDependencyTree}
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
  hideCompleted,
  connectedCourseIds,
  onOpenDependencyTree,
}: {
  requirement: CourseRequirement
  requirementKey: string
  courses: ReadonlyArray<Course>
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
  hideCompleted: boolean
  connectedCourseIds: ReadonlySet<string>
  onOpenDependencyTree: (courseId: CourseId) => void
}) {
  const catalogYear = useContext(CatalogProgramYearContext)
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
  if (hideCompleted && isCompleted) return null
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
              search={{ catalogYear }}
              onClick={(event) => event.stopPropagation()}
            >
              {row.code}
            </Link>
          ) : (
            row.code
          )}
        </td>
        <td className="px-3 py-2 font-semibold">{row.credits ?? '—'}</td>
        <td className="relative h-12 px-3 py-2 pr-12">
          {row.name}
          {prefix && (
            <ChevronDown
              aria-hidden="true"
              className={`absolute top-1/2 right-3 size-4 -translate-y-1/2 transition-transform${
                expanded ? ' rotate-180' : ''
              }`}
            />
          )}
          {course && connectedCourseIds.has(String(course.id)) && (
            <span className="absolute top-1/2 right-2 -translate-y-1/2">
              <DependencyTreeButton
                course={course}
                onOpenDependencyTree={onOpenDependencyTree}
              />
            </span>
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
              hideCompleted={hideCompleted}
              connectedCourseIds={connectedCourseIds}
              onOpenDependencyTree={onOpenDependencyTree}
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
  hideCompleted,
  connectedCourseIds,
  onOpenDependencyTree,
}: {
  prefix: string
  courses: ReadonlyArray<Course>
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
  hideCompleted: boolean
  connectedCourseIds: ReadonlySet<string>
  onOpenDependencyTree: (courseId: CourseId) => void
}) {
  const catalogYear = useContext(CatalogProgramYearContext)
  const [page, setPage] = useState(1)
  const matchingCourses = courses.filter(
    (course) =>
      course.code.toUpperCase().startsWith(prefix) &&
      (!hideCompleted || !completedCourseIds.has(Number(course.id))),
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
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-20 sm:w-36" />
            <col className="w-20 sm:w-28" />
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
                    search={{ catalogYear }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {course.code}
                  </Link>
                </td>
                <td className="px-3 py-2 font-semibold">{course.credits}</td>
                <td className="relative h-12 px-3 py-2 pr-12">
                  {course.name}
                  {connectedCourseIds.has(String(course.id)) && (
                    <span className="absolute top-1/2 right-2 -translate-y-1/2">
                      <DependencyTreeButton
                        course={course}
                        onOpenDependencyTree={onOpenDependencyTree}
                      />
                    </span>
                  )}
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
  catalogProgramVariantId,
  isLoading,
  isError,
  onRetry,
  onOpenCourseDetails,
  completedCourseIds,
  markCompleted,
  hideCompleted,
  connectedCourseIds,
  onOpenDependencyTree,
}: {
  suggestions: ReadonlyArray<CurriculumSuggestion>
  catalogProgramVariantId?: CatalogProgramVariantId
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onOpenCourseDetails: (course: Course) => void
  completedCourseIds: ReadonlySet<number>
  markCompleted: boolean
  hideCompleted: boolean
  connectedCourseIds: ReadonlySet<string>
  onOpenDependencyTree: (courseId: CourseId) => void
}) {
  const catalogYear = useContext(CatalogProgramYearContext)
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

  const visibleSuggestions = catalogProgramVariantId
    ? suggestions.filter(
        (suggestion) =>
          suggestion.catalogProgramVariantId === catalogProgramVariantId,
      )
    : []
  if (visibleSuggestions.length === 0) {
    return (
      <EmptyState
        title="Nenhuma proposta encontrada"
        description="Não há proposta de cumprimento de currículo disponível para a seleção atual."
      />
    )
  }
  const filteredSuggestions = visibleSuggestions.map((suggestion) => ({
    ...suggestion,
    semesters: suggestion.semesters
      .map((semester) => ({
        ...semester,
        courses: semester.courses.filter(
          (course) =>
            !hideCompleted || !completedCourseIds.has(Number(course.id)),
        ),
      }))
      .filter((semester) => semester.courses.length > 0),
  }))

  if (
    hideCompleted &&
    filteredSuggestions.every((item) => !item.semesters.length)
  )
    return (
      <EmptyState
        title="Todas as disciplinas da proposta foram concluídas"
        description="Mostre as disciplinas concluídas para consultar a proposta completa."
      />
    )

  return (
    <div className="space-y-8">
      {filteredSuggestions.map((suggestion) => (
        <section
          key={suggestion.id}
          aria-labelledby={`suggestion-${suggestion.id}`}
        >
          <div className="mb-4 border-b-2 border-strong-border pb-3">
            <h2
              id={`suggestion-${suggestion.id}`}
              className="text-xl font-extrabold"
            >
              {suggestionLabel(suggestion)}
            </h2>
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
                    <table className="w-full table-fixed border-collapse text-left text-sm">
                      <colgroup>
                        <col className="w-20 sm:w-36" />
                        <col className="w-20 sm:w-28" />
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
                                search={{ catalogYear }}
                                onClick={(event) => event.stopPropagation()}
                              >
                                {course.code}
                              </Link>
                            </td>
                            <td className="px-3 py-2 font-semibold">
                              {course.credits}
                            </td>
                            <td className="relative h-12 px-3 py-2 pr-12">
                              {course.name}
                              {connectedCourseIds.has(String(course.id)) && (
                                <span className="absolute top-1/2 right-2 -translate-y-1/2">
                                  <DependencyTreeButton
                                    course={course}
                                    onOpenDependencyTree={onOpenDependencyTree}
                                  />
                                </span>
                              )}
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

function DependencyTreeButton({
  course,
  onOpenDependencyTree,
}: {
  course: Course
  onOpenDependencyTree: (courseId: CourseId) => void
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8"
      aria-label={`Ver ${course.code} na árvore de dependências`}
      title="Ver na árvore de dependências"
      onClick={(event) => {
        event.stopPropagation()
        onOpenDependencyTree(course.id)
      }}
    >
      <Network aria-hidden="true" />
    </Button>
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
