import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  History,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Star,
  Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  evaluatePrerequisites,
  periodTitle,
} from '@pomi/planner-domain/curriculum'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import type {
  CoursePrerequisiteResolver,
  PlannerDragData,
} from '@/features/curriculum-planner/components/CourseCard'
import type {
  CourseId,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import {
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CurriculumBlocksPanel } from '@/features/curriculum-planner/components/CurriculumBlocksPanel'
import { CourseDetailsDialog } from '@/features/curriculum-planner/components/CourseDetailsDialog'
import { ClearPlanningDialog } from '@/features/curriculum-planner/components/ClearPlanningDialog'
import { ActionTooltip } from '@/features/curriculum-planner/components/ActionTooltip'
import { SaveDraftDialog } from '@/features/planning-shared/components/SaveDraftDialog'
import {
  DeleteCurriculumDialog,
  RenameCurriculumDialog,
} from '@/features/curriculum-planner/components/CurriculumPlanActions'
import { CurriculumSelectionFields } from '@/features/curriculum-planner/components/CurriculumSelection'
import {
  ChangeSuggestionDialog,
  SuggestionOnboardingPanel,
  StudentHistoryImportDialog,
} from '@/features/curriculum-planner/components/CurriculumSuggestion'
import { PlanningStartDialog } from '@/features/curriculum-planner/components/PlanningStartDialog'
import { CurriculumPlanningSelection } from '@/features/curriculum-planner/components/CurriculumPlanningSelection'
import {
  SemesterRow,
  UnallocatedCoursesPanel,
} from '@/features/curriculum-planner/components/SemesterBoard'
import { CompactVisual } from '@/features/curriculum-planner/components/CourseCard'
import { PrerequisiteGraph } from '@/features/curriculum-planner/components/PrerequisiteGraph'
import { suggestionOnboardingPreferenceKey } from '@/features/curriculum-planner/data/curriculumSuggestionApi'
import { useCurriculumPlanner } from '@/features/curriculum-planner/CurriculumPlannerProvider'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { saveDraftHandoff } from '@/features/planning-shared/data/planningDraftHandoff'
import { buildPlannerViewModel } from '@/features/curriculum-planner/viewModel'
import { commandForCourseDrop } from '@/features/curriculum-planner/dnd'
import {
  CurrentCatalogUnavailableError,
  currentCatalogYear,
  loadCurrentYearPrerequisites,
} from '@/features/curriculum-planner/data/curriculumPrerequisiteApi'
import {
  curriculumPlannerErrorText,
  curriculumPlanningName,
} from '@/features/curriculum-planner/model/presentation'

const dragMeasuring = {
  droppable: { strategy: MeasuringStrategy.BeforeDragging },
}

export function CurriculumPlannerPage({
  curriculumId,
}: {
  curriculumId?: string
} = {}) {
  const planner = useCurriculumPlanner()
  const auth = useOptionalAuth()
  const navigate = useNavigate()
  const viewModel = useMemo(
    () =>
      planner.staticData && planner.snapshot
        ? buildPlannerViewModel(planner.staticData, planner.snapshot)
        : undefined,
    [planner.snapshot, planner.staticData],
  )
  const excludedCourseIds = useMemo(
    () =>
      new Set<CourseId>([
        ...(planner.snapshot?.academicRecord.completedCourses.map(
          (course) => course.courseId,
        ) ?? []),
        ...(planner.snapshot?.plan.unallocatedCourseIds ?? []),
        ...(planner.snapshot?.plan.periods.flatMap((period) =>
          period.items.map((item) => item.courseId),
        ) ?? []),
      ]),
    [planner.snapshot],
  )
  const [activeDrag, setActiveDrag] = useState<PlannerDragData>()
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>()
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<CourseId>>(
    () => new Set(),
  )
  const [selectionMode, setSelectionMode] = useState(false)
  const prerequisiteBoardRef = useRef<HTMLDivElement>(null)
  const [
    preferredPrerequisiteAlternatives,
    setPreferredPrerequisiteAlternatives,
  ] = useState<ReadonlyMap<CourseId, string>>(() => new Map())
  const prerequisiteYear = currentCatalogYear()
  const prerequisitesQuery = useQuery({
    queryKey: publicQueryKeys.curriculumPrerequisites(prerequisiteYear),
    queryFn: () => loadCurrentYearPrerequisites(),
    enabled: Boolean(planner.snapshot && planner.staticData),
    staleTime: Infinity,
  })
  const prerequisiteEvaluation = useMemo(
    () =>
      planner.snapshot && planner.staticData && prerequisitesQuery.data
        ? evaluatePrerequisites({
            snapshot: planner.snapshot,
            courses: planner.staticData.courses,
            rules: prerequisitesQuery.data.rules,
            preferredAlternatives: preferredPrerequisiteAlternatives,
            courseIds: new Set([
              ...planner.snapshot.academicRecord.completedCourses.map(
                (course) => course.courseId,
              ),
              ...(planner.snapshot.plan.unallocatedCourseIds ?? []),
              ...planner.snapshot.plan.periods.flatMap((period) =>
                period.items.map((item) => item.courseId),
              ),
              ...(selectedCourseId ? [selectedCourseId] : []),
            ]),
          })
        : undefined,
    [
      planner.snapshot,
      selectedCourseId,
      planner.staticData,
      preferredPrerequisiteAlternatives,
      prerequisitesQuery.data,
    ],
  )
  const currentCatalogCourseIds = useMemo(
    () => new Set(prerequisitesQuery.data?.courseIds ?? []),
    [prerequisitesQuery.data?.courseIds],
  )
  const changePrerequisiteAlternative = useCallback(
    (courseId: CourseId, key?: string) => {
      setPreferredPrerequisiteAlternatives((current) => {
        const next = new Map(current)
        if (key) next.set(courseId, key)
        else next.delete(courseId)
        return next
      })
    },
    [],
  )
  const prerequisiteResolver = useCallback<CoursePrerequisiteResolver>(
    (courseId) => ({
      year: prerequisiteYear,
      status: prerequisitesQuery.isPending
        ? 'loading'
        : prerequisitesQuery.isError
          ? 'error'
          : currentCatalogCourseIds.has(courseId)
            ? 'ready'
            : 'notInCatalog',
      evaluation: prerequisiteEvaluation?.courses.get(courseId),
      preferredAlternativeKey: preferredPrerequisiteAlternatives.get(courseId),
      onAlternativeChange: changePrerequisiteAlternative,
    }),
    [
      changePrerequisiteAlternative,
      currentCatalogCourseIds,
      preferredPrerequisiteAlternatives,
      prerequisiteEvaluation,
      prerequisiteYear,
      prerequisitesQuery.isError,
      prerequisitesQuery.isPending,
    ],
  )
  const selectedCourse = planner.staticData?.courses.find(
    (course) => course.id === selectedCourseId,
  )
  const selectedCoursePeriodId = planner.snapshot?.plan.periods.find((period) =>
    period.items.some((item) => item.courseId === selectedCourseId),
  )?.id
  const selectedCourseUnallocated = Boolean(
    selectedCourseId &&
    planner.snapshot?.plan.unallocatedCourseIds?.includes(selectedCourseId),
  )
  const selectedCourseCompleted = Boolean(
    selectedCourseId &&
    planner.snapshot?.academicRecord.completedCourses.some(
      (course) => course.courseId === selectedCourseId,
    ),
  )
  const toggleCourseSelection = useCallback((courseId: CourseId) => {
    setSelectionMode(true)
    setSelectedCourseIds((current) => {
      const next = new Set(current)
      if (next.has(courseId)) next.delete(courseId)
      else next.add(courseId)
      return next
    })
  }, [])
  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((current) => {
      if (current) setSelectedCourseIds(new Set())
      return !current
    })
  }, [])
  useEffect(() => {
    if (!selectionMode && selectedCourseIds.size === 0) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setSelectedCourseIds(new Set())
      setSelectionMode(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCourseIds.size, selectionMode])
  const placeSelectedCourses = useCallback(
    async (periodId: PlanningPeriodId) => {
      const courseIds = [...selectedCourseIds]
      if (!courseIds.length) return
      const succeeded = await planner.dispatch({
        type: 'placeCoursesInPeriod',
        courseIds,
        periodId,
      })
      if (succeeded) setSelectedCourseIds(new Set())
    },
    [planner.dispatch, selectedCourseIds],
  )
  const placeSelectedCoursesInUnallocated = useCallback(async () => {
    const courseIds = [...selectedCourseIds]
    if (!courseIds.length) return
    const succeeded = await planner.dispatch({
      type: 'placeCoursesInUnallocated',
      courseIds,
    })
    if (succeeded) setSelectedCourseIds(new Set())
  }, [planner.dispatch, selectedCourseIds])
  const plannedCourseIds = useMemo(
    () =>
      new Set<CourseId>([
        ...(planner.snapshot?.plan.unallocatedCourseIds ?? []),
        ...(planner.snapshot?.plan.periods.flatMap((period) =>
          period.items.map((item) => item.courseId),
        ) ?? []),
      ]),
    [planner.snapshot],
  )
  const removableSelectedCourseIds = useMemo(
    () =>
      [...selectedCourseIds].filter((courseId) =>
        plannedCourseIds.has(courseId),
      ),
    [plannedCourseIds, selectedCourseIds],
  )
  const removeSelectedCourses = useCallback(async () => {
    if (!removableSelectedCourseIds.length) return
    const succeeded = await planner.dispatch({
      type: 'removeCoursesFromPlan',
      courseIds: removableSelectedCourseIds,
    })
    if (succeeded) setSelectedCourseIds(new Set())
  }, [planner.dispatch, removableSelectedCourseIds])
  const studentDefaultsApplied = useRef<string | undefined>(undefined)
  const [saveDraftDialogOpen, setSaveDraftDialogOpen] = useState(false)
  const [curriculumAction, setCurriculumAction] = useState<
    'rename' | 'delete'
  >()
  const [suggestionOnboardingDismissed, setSuggestionOnboardingDismissed] =
    useState(() => {
      try {
        return (
          window.localStorage.getItem(suggestionOnboardingPreferenceKey) ===
          'true'
        )
      } catch {
        return false
      }
    })
  useEffect(() => {
    setPreferredPrerequisiteAlternatives(new Map())
    setSelectedCourseIds(new Set())
    setSelectionMode(false)
  }, [planner.activeCurriculumId])
  useEffect(() => {
    setSelectedCourseIds(new Set())
    setSelectionMode(false)
  }, [planner.snapshot?.selection.catalogProgramId])
  useEffect(() => {
    if (!planner.snapshot || !planner.staticData || !planner.studentProfile)
      return
    if (planner.snapshot.selection.catalogProgramId) return
    const planKey = String(planner.activeCurriculumId ?? 'rascunho')
    if (studentDefaultsApplied.current === planKey) return
    const catalogProgram = planner.staticData.catalogPrograms.find(
      (item) =>
        Number(item.catalog.id) === planner.studentProfile!.catalogId &&
        Number(item.program.id) === planner.studentProfile!.programId,
    )
    if (!catalogProgram) return
    studentDefaultsApplied.current = planKey
    void (async () => {
      await planner.dispatch({
        type: 'selectCatalogProgram',
        catalogProgramId: catalogProgram.id,
      })
      if (planner.studentProfile?.specializationId) {
        const specialization = catalogProgram.specializations.find(
          (item) =>
            Number(item.id) === planner.studentProfile?.specializationId,
        )
        if (specialization)
          await planner.dispatch({
            type: 'selectSpecialization',
            specializationId: specialization.id,
          })
      }
      if (planner.studentProfile?.languageId) {
        const language = catalogProgram.languages.find(
          (item) => Number(item.id) === planner.studentProfile?.languageId,
        )
        if (language)
          await planner.dispatch({
            type: 'selectLanguage',
            languageId: language.id,
          })
      }
    })()
  }, [
    planner.activeCurriculumId,
    planner.dispatch,
    planner.snapshot,
    planner.staticData,
    planner.studentProfile,
  ])
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  )
  if (planner.isLoading) {
    return (
      <PageContainer size="wide">
        <LoadingState label="Carregando currículo e planejamento" />
      </PageContainer>
    )
  }
  if (!planner.staticData || !planner.snapshot) {
    return (
      <PageContainer size="wide">
        <ErrorState
          title="Não foi possível abrir o planejador"
          description={
            planner.error
              ? curriculumPlannerErrorText(planner.error.code)
              : 'Os dados necessários não estão disponíveis.'
          }
          action={{
            label: 'Tentar novamente',
            onClick: () => void planner.retry(),
          }}
        />
      </PageContainer>
    )
  }
  if (['selection'].includes(planner.entryState)) {
    return <CurriculumPlanningSelection planner={planner} />
  }
  const { staticData, snapshot } = planner
  const activeCurriculum = planner.curricula.find(
    (curriculum) => curriculum.id === planner.activeCurriculumId,
  )
  const planningName =
    activeCurriculum?.name.trim() ||
    planner.draftName?.trim() ||
    (planner.activeCurriculumId
      ? `Planejamento ${planner.activeCurriculumId}`
      : 'Rascunho')
  const plannerView = viewModel!
  const periods = plannerView.periods
  const showSuggestionOnboarding =
    !suggestionOnboardingDismissed &&
    !snapshot.plan.periods.length &&
    !snapshot.academicRecord.completedCourses.length
  const dismissSuggestionOnboarding = () => {
    setSuggestionOnboardingDismissed(true)
    try {
      window.localStorage.setItem(suggestionOnboardingPreferenceKey, 'true')
    } catch {}
  }
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDrag(event.active.data.current as PlannerDragData | undefined)
  }
  const handleDragEnd = (event: DragEndEvent) => {
    const data = event.active.data.current as PlannerDragData | undefined
    const overId = String(event.over?.id ?? '')
    setActiveDrag(undefined)
    if (!data) return
    const command = commandForCourseDrop(data, overId)
    if (command) void planner.dispatch(command)
  }
  const addSemester = () => {
    dismissSuggestionOnboarding()
    void planner.dispatch({
      type: 'addPlanningPeriod',
      position: { type: 'end' },
    })
  }
  return (
    <PageContainer>
      <PageHeader
        compact
        eyebrow="Planejamento acadêmico"
        title={planningName}
        description={
          planner.isAuthenticated
            ? planner.saveStatus === 'error'
              ? 'Não foi possível salvar'
              : planner.saveStatus === 'saving' ||
                  planner.saveStatus === 'pending'
                ? 'Salvando…'
                : planner.activeCurriculumId
                  ? 'Salvo automaticamente'
                  : 'Rascunho não salvo'
            : 'Rascunho desta sessão'
        }
        actions={
          <>
            {!planner.activeCurriculumId && curriculumId === 'rascunho' && (
              <ActionTooltip content="Entre para salvar este rascunho na sua conta.">
                <Button
                  variant="outline"
                  disabled={planner.isDispatching}
                  onClick={() => setSaveDraftDialogOpen(true)}
                >
                  <Save /> Salvar
                </Button>
              </ActionTooltip>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  aria-label="Ações do planejamento"
                  title="Abra ações de edição do currículo."
                >
                  <MoreHorizontal /> Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {planner.isAuthenticated && (
                  <>
                    <ActionTooltip
                      content={
                        activeCurriculum?.isFavorite
                          ? 'Remova este planejamento da Home.'
                          : 'Mostre este planejamento como principal na Home.'
                      }
                    >
                      <DropdownMenuItem
                        disabled={planner.isDispatching || !activeCurriculum}
                        onSelect={() => {
                          if (!activeCurriculum) return
                          void planner.setCurriculumFavorite(
                            activeCurriculum.id,
                            !activeCurriculum.isFavorite,
                          )
                        }}
                      >
                        <Star
                          className={
                            activeCurriculum?.isFavorite
                              ? 'fill-current'
                              : undefined
                          }
                        />
                        {activeCurriculum?.isFavorite
                          ? 'Remover dos favoritos'
                          : 'Favoritar planejamento'}
                      </DropdownMenuItem>
                    </ActionTooltip>
                    <ActionTooltip content="Altere o nome deste currículo salvo.">
                      <DropdownMenuItem
                        disabled={planner.isDispatching}
                        onSelect={() => setCurriculumAction('rename')}
                      >
                        <Pencil /> Editar nome
                      </DropdownMenuItem>
                    </ActionTooltip>
                    <StudentHistoryImportDialog
                      attempts={planner.studentCourseAttempts}
                      attemptsLoading={planner.studentCourseAttemptsLoading}
                      disabled={planner.isDispatching}
                      dispatch={planner.dispatch}
                      trigger={
                        <DropdownMenuItem
                          disabled={planner.isDispatching}
                          onSelect={(event) => event.preventDefault()}
                        >
                          <History /> Usar histórico
                        </DropdownMenuItem>
                      }
                    />
                  </>
                )}
                {planner.isAuthenticated && <DropdownMenuSeparator />}
                {planner.isAuthenticated && (
                  <ActionTooltip content="Exclua permanentemente este currículo salvo.">
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      disabled={planner.isDispatching}
                      onSelect={() => setCurriculumAction('delete')}
                    >
                      <Trash2 /> Apagar planejamento
                    </DropdownMenuItem>
                  </ActionTooltip>
                )}
                <ChangeSuggestionDialog
                  staticData={staticData}
                  snapshot={snapshot}
                  disabled={planner.isDispatching}
                  dispatch={planner.dispatch}
                  label="Usar sugestão"
                  trigger={
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      disabled={planner.isDispatching}
                      onSelect={(event) => event.preventDefault()}
                    >
                      Usar sugestão
                    </DropdownMenuItem>
                  }
                />
                <ClearPlanningDialog
                  disabled={planner.isDispatching}
                  dispatch={planner.dispatch}
                  onCleared={() => {
                    setSelectedCourseIds(new Set())
                    setSelectionMode(false)
                    setSuggestionOnboardingDismissed(false)
                    try {
                      window.localStorage.removeItem(
                        suggestionOnboardingPreferenceKey,
                      )
                    } catch {}
                  }}
                  trigger={
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      disabled={planner.isDispatching}
                      onSelect={(event) => event.preventDefault()}
                    >
                      Limpar planejamento
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
      {planner.isAuthenticated && (
        <>
          <RenameCurriculumDialog
            disabled={planner.isDispatching}
            initialName={curriculumPlanningName(
              activeCurriculum?.name,
              planner.activeCurriculumId,
            )}
            open={curriculumAction === 'rename'}
            onOpenChange={(open) => {
              if (!open) setCurriculumAction(undefined)
            }}
            onRename={planner.renameCurriculum}
          />
          <DeleteCurriculumDialog
            disabled={planner.isDispatching}
            open={curriculumAction === 'delete'}
            onOpenChange={(open) => {
              if (!open) setCurriculumAction(undefined)
            }}
            onDelete={async () => {
              const succeeded = await planner.deleteCurriculumPlan()
              if (succeeded) {
                planner.backToSelection()
                void navigate({ to: '/planejamentos-de-curriculo' })
              }
              return succeeded
            }}
          />
        </>
      )}
      {planner.error && (
        <Alert variant="destructive" className="mb-6" aria-live="polite">
          <RotateCcw />
          <AlertTitle>Não foi possível concluir a ação</AlertTitle>
          <AlertDescription>
            {curriculumPlannerErrorText(planner.error)}
          </AlertDescription>
        </Alert>
      )}
      {prerequisitesQuery.isError && (
        <Alert className="mb-6">
          <AlertTitle>
            Pré-requisitos indisponíveis para {prerequisiteYear}
          </AlertTitle>
          <AlertDescription>
            {prerequisitesQuery.error instanceof CurrentCatalogUnavailableError
              ? `O catálogo de ${prerequisiteYear} ainda não está disponível.`
              : 'Não foi possível carregar as relações agora. O planejamento continua disponível.'}
          </AlertDescription>
        </Alert>
      )}
      <DndContext
        sensors={sensors}
        measuring={dragMeasuring}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragCancel={() => setActiveDrag(undefined)}
        onDragEnd={handleDragEnd}
        accessibility={{
          screenReaderInstructions: {
            draggable:
              'Pressione espaço ou Enter para pegar a disciplina, use as setas para escolher um semestre e pressione espaço ou Enter novamente para soltar.',
          },
        }}
      >
        {showSuggestionOnboarding && (
          <SuggestionOnboardingPanel
            staticData={staticData}
            snapshot={snapshot}
            disabled={planner.isDispatching}
            dispatch={planner.dispatch}
            onDismiss={dismissSuggestionOnboarding}
          />
        )}
        {(selectionMode || selectedCourseIds.size > 0) && (
          <div
            role="status"
            className="sticky top-[4.5rem] z-40 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border-2 border-primary bg-background px-3 py-2"
          >
            <p className="text-xs font-bold">
              {selectedCourseIds.size > 0
                ? `${selectedCourseIds.size} ${selectedCourseIds.size === 1 ? 'disciplina selecionada.' : 'disciplinas selecionadas.'} Clique em um semestre para posicionar.`
                : 'Modo de seleção ativo. Clique nas disciplinas para selecionar.'}
            </p>
            {selectedCourseIds.size > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void removeSelectedCourses()}
                  disabled={!removableSelectedCourseIds.length}
                >
                  <Trash2 /> Remover do planejamento
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCourseIds(new Set())}
                >
                  Limpar seleção
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={toggleSelectionMode}>
                Sair do modo de seleção
              </Button>
            )}
          </div>
        )}
        <section className="mb-7" aria-labelledby="semesters-title">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="semesters-title" className="text-xl font-extrabold">
              Semestres
            </h2>
            <div className="flex flex-wrap justify-end gap-2">
              <PlanningStartDialog
                year={snapshot.plan.planningStart?.year}
                semester={snapshot.plan.planningStart?.semester}
                semesterNumber={snapshot.plan.planningStart?.semesterNumber}
                defaultYear={planner.studentProfile?.entryYear}
                disabled={planner.isDispatching}
                dispatch={planner.dispatch}
              />
              <Button
                variant={selectionMode ? 'default' : 'outline'}
                aria-pressed={selectionMode}
                onClick={toggleSelectionMode}
                disabled={planner.isDispatching}
                title="Ative para selecionar disciplinas sem segurar Shift."
              >
                {selectionMode
                  ? 'Sair do modo de seleção'
                  : 'Selecionar disciplinas'}
              </Button>
            </div>
          </div>
          <div ref={prerequisiteBoardRef} className="relative">
            <PrerequisiteGraph
              rootRef={prerequisiteBoardRef}
              links={prerequisiteEvaluation?.links ?? []}
              visible
            />
            <div
              role="region"
              aria-label="Planejamento por semestre"
              className="divide-y-2 divide-strong-border overflow-hidden rounded-md border-2 border-strong-border bg-card shadow-[4px_4px_0_color-mix(in_srgb,var(--primary)_25%,transparent)]"
            >
              <UnallocatedCoursesPanel
                courses={plannerView.unallocatedCourses}
                credits={plannerView.unallocatedCredits}
                availableCourses={staticData.courses}
                excludedCourseIds={excludedCourseIds}
                periods={periods}
                planningStart={snapshot.plan.planningStart}
                disabled={planner.isDispatching}
                dispatch={planner.dispatch}
                onOpenCourseDetails={setSelectedCourseId}
                selectedCourseIds={selectedCourseIds}
                selectionMode={selectionMode}
                onToggleCourseSelection={toggleCourseSelection}
                onPlaceSelectedCourses={placeSelectedCoursesInUnallocated}
                prerequisiteResolver={prerequisiteResolver}
              />
              {periods.length ? (
                plannerView.semesters
                  .map((semester, index) => (
                    <SemesterRow
                      key={semester.period.id}
                      semester={semester}
                      title={periodTitle(index, snapshot.plan.planningStart)}
                      periods={periods}
                      availableCourses={staticData.courses}
                      excludedCourseIds={excludedCourseIds}
                      planningStart={snapshot.plan.planningStart}
                      disabled={planner.isDispatching}
                      dispatch={planner.dispatch}
                      onOpenCourseDetails={setSelectedCourseId}
                      selectedCourseIds={selectedCourseIds}
                      selectionMode={selectionMode}
                      onToggleCourseSelection={toggleCourseSelection}
                      onPlaceSelectedCourses={placeSelectedCourses}
                      prerequisiteResolver={prerequisiteResolver}
                    />
                  ))
                  .concat(
                    <button
                      key="add-semester"
                      type="button"
                      className="flex min-h-14 w-full items-center justify-center gap-2 bg-background px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                      onClick={addSemester}
                      disabled={planner.isDispatching}
                    >
                      <Plus className="size-4" /> Adicionar semestre
                    </button>,
                  )
              ) : (
                <section className="grid min-h-32 place-items-center px-6 py-8 text-center">
                  <div>
                    <h3 className="text-base font-extrabold">
                      Nenhum semestre criado
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Adicione o primeiro semestre para começar a distribuir as
                      disciplinas.
                    </p>
                    <Button className="mt-4" onClick={addSemester}>
                      <Plus /> Adicionar primeiro semestre
                    </Button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </section>
        <div className="mb-7 overflow-hidden rounded-md border-2 border-border bg-card">
          {!showSuggestionOnboarding && (
            <CurriculumSelectionFields
              staticData={staticData}
              snapshot={snapshot}
              disabled={planner.isDispatching}
              dispatch={planner.dispatch}
              className="border-b-2 border-border p-4"
            />
          )}
          {snapshot.selection.catalogProgramId ? (
            <CurriculumBlocksPanel
              staticData={staticData}
              snapshot={snapshot}
              disabled={planner.isDispatching}
              dispatch={planner.dispatch}
              onOpenCourseDetails={setSelectedCourseId}
              selectedCourseIds={selectedCourseIds}
              selectionMode={selectionMode}
              onToggleCourseSelection={toggleCourseSelection}
            />
          ) : (
            <div className="border-dashed p-4 text-sm text-muted-foreground">
              Você pode começar sem currículo: crie um semestre e adicione
              qualquer disciplina. Escolha catálogo e programa depois para
              exibir os blocos da grade.
            </div>
          )}
        </div>
        <DragOverlay>
          {activeDrag?.type === 'course' ? (
            <CompactVisual
              code={activeDrag.course.code}
              credits={activeDrag.course.credits}
              planned={Boolean(activeDrag.currentPeriodId)}
              className="rotate-2 shadow-lg"
            />
          ) : null}
        </DragOverlay>
        <CourseDetailsDialog
          open={Boolean(selectedCourse)}
          onOpenChange={(open) => {
            if (!open) setSelectedCourseId(undefined)
          }}
          course={selectedCourse}
          plannedPeriodId={selectedCoursePeriodId}
          unallocated={selectedCourseUnallocated}
          completed={selectedCourseCompleted}
          attempts={planner.studentCourseAttempts}
          periods={periods}
          planningStart={snapshot.plan.planningStart}
          disabled={planner.isDispatching}
          dispatch={planner.dispatch}
          prerequisites={
            selectedCourseId
              ? prerequisiteResolver(selectedCourseId)
              : undefined
          }
          catalogYear={prerequisiteYear}
          onRemoved={() => setSelectedCourseId(undefined)}
        />
        <SaveDraftDialog
          open={saveDraftDialogOpen}
          onOpenChange={setSaveDraftDialogOpen}
          onLogin={() => {
            saveDraftHandoff({
              version: 1,
              kind: 'curriculum',
              name: planningName,
              state: {
                revision: snapshot.revision,
                selection: snapshot.selection,
                plan: snapshot.plan,
                academicRecord: snapshot.academicRecord,
              },
            })
            void auth.login(window.location.href)
          }}
        />
      </DndContext>
    </PageContainer>
  )
}
