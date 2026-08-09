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
import { Download, MoreHorizontal, Pencil, Plus, RotateCcw, Save, Trash2, Upload } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import type { PlannerDragData } from '@/planner/components/CourseCard'
import type { PlannerError } from '@/planner/domain/curriculumPlanner'
import type { ResolvedPlanningImport } from '@/planner/domain/planningTransfer'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CurriculumBlocksPanel } from '@/planner/components/CurriculumBlocksPanel'
import { ClearPlanningDialog } from '@/planner/components/ClearPlanningDialog'
import {
  DeleteCurriculumDialog,
  RenameCurriculumDialog,
} from '@/planner/components/CurriculumPlanActions'
import { CurriculumSelectionPanel } from '@/planner/components/CurriculumSelection'
import {
  ChangeSuggestionDialog,
  SuggestionOnboardingPanel,
} from '@/planner/components/CurriculumSuggestion'
import { PlanningStartDialog } from '@/planner/components/PlanningStartDialog'
import { PlanningImportReviewDialog } from '@/planner/components/PlanningImportReviewDialog'
import {
  SemesterRow,
  UnallocatedCoursesPanel,
} from '@/planner/components/SemesterBoard'
import { CompactVisual } from '@/planner/components/CourseCard'
import { suggestionOnboardingPreferenceKey } from '@/planner/data/curriculumSuggestionApi'
import { useCurriculumPlanner } from '@/planner/CurriculumPlannerProvider'
import { periodTitle } from '@/planner/domain/planningPeriods'
import {
  downloadPlanning,
  parsePlanning,
  resolvePlanningImport,
} from '@/planner/domain/planningTransfer'
import { buildPlannerViewModel } from '@/planner/viewModel'
import { commandForCourseDrop } from '@/planner/dnd'

const dragMeasuring = {
  droppable: { strategy: MeasuringStrategy.BeforeDragging },
}

function errorText(error: PlannerError | string) {
  const code = typeof error === 'string' ? error : error.code
  if (typeof error !== 'string' && error.code === 'invalidInput') {
    const importReasons = {
      catalogProgram:
        'O catálogo/programa do arquivo não está disponível nos dados atuais.',
      specialization:
        'A habilitação do arquivo não pertence ao programa atual.',
      language: 'A língua do arquivo não pertence ao programa atual.',
      courses:
        'O arquivo contém uma ou mais disciplinas que não existem no catálogo atual.',
      periods: 'O arquivo coloca a mesma disciplina em mais de um semestre.',
      import: 'O formato interno do arquivo de planejamento não é válido.',
    } as const
    const field = error.details.field as keyof typeof importReasons
    return importReasons[field]
  }
  return (
    {
      conflict: 'O planejamento mudou. O estado mais recente foi carregado.',
      duplicateCourse: 'Essa disciplina já está planejada em outro semestre.',
      invalidInput: 'A informação fornecida não é válida.',
      invalidSelection: 'A opção não pertence ao currículo selecionado.',
      notFound: 'O item não existe mais no planejamento.',
      unavailable: 'Não foi possível acessar os dados do planejador.',
      unexpected: 'Os dados locais ou a resposta da API são incompatíveis.',
    }[code] ?? 'Não foi possível concluir a ação.'
  )
}

function curriculumName(name: string | undefined, id?: number) {
  return name?.trim() || (id ? `Planejamento ${id}` : 'Planejamento sem nome')
}

export function CurriculumPlannerPage({
  curriculumId,
  showSelection = false,
}: {
  curriculumId?: string
  showSelection?: boolean
} = {}) {
  const planner = useCurriculumPlanner()
  const navigate = useNavigate()
  useEffect(() => {
    if (showSelection) {
      if (!planner.isAuthenticationReady) return
      if (!planner.isAuthenticated) {
        planner.openAnonymousDraft()
        void navigate({
          to: '/planejamentos/$planejamentoId',
          params: { planejamentoId: 'rascunho' },
          replace: true,
        })
        return
      }
      planner.backToSelection()
      return
    }
    if (!curriculumId) return
    if (curriculumId === 'rascunho') planner.openAnonymousDraft()
    else {
      const id = Number(curriculumId)
      if (Number.isInteger(id)) planner.selectCurriculum(id)
    }
  }, [
    curriculumId,
    planner.backToSelection,
    planner.isAuthenticated,
    planner.isAuthenticationReady,
    planner.openAnonymousDraft,
    planner.selectCurriculum,
    navigate,
    showSelection,
  ])
  const viewModel = useMemo(
    () =>
      planner.staticData && planner.snapshot
        ? buildPlannerViewModel(planner.staticData, planner.snapshot)
        : undefined,
    [planner.snapshot, planner.staticData],
  )
  const [activeDrag, setActiveDrag] = useState<PlannerDragData>()
  const [importError, setImportError] = useState<'parse' | 'dispatch'>()
  const [selectionError, setSelectionError] = useState(false)
  const [pendingImport, setPendingImport] = useState<ResolvedPlanningImport>()
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
  const importInputRef = useRef<HTMLInputElement>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0 } }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 0 },
    }),
    useSensor(KeyboardSensor),
  )
  const importPlanning = async (file?: File) => {
    if (!file) return
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('invalid')
      const parsed = parsePlanning(JSON.parse(await file.text()))
      if (!parsed || !planner.staticData) throw new Error('invalid')
      setPendingImport(resolvePlanningImport(parsed, planner.staticData))
      setImportError(undefined)
    } catch {
      setImportError('parse')
    }
  }
  const confirmImport = async () => {
    if (!pendingImport) return
    const succeeded = await planner.dispatch({
      type: 'importPlanning',
      data: pendingImport.data,
    })
    if (!succeeded) {
      setImportError('dispatch')
      return
    }
    if (pendingImport.name) {
      planner.setDraftName(pendingImport.name)
      if (planner.activeCurriculumId)
        await planner.renameCurriculum(pendingImport.name)
    }
    setPendingImport(undefined)
    if (planner.entryState === 'selection') {
      planner.openAnonymousDraft()
      if (pendingImport.name) planner.setDraftName(pendingImport.name)
      void navigate({
        to: '/planejamentos/$planejamentoId',
        params: { planejamentoId: 'rascunho' },
      })
    }
  }
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
              ? errorText(planner.error.code)
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
  if (planner.entryState === 'selection') {
    const createPlan = async () => {
      const id = await planner.createCurriculumPlan()
      setSelectionError(!id)
      if (id)
        void navigate({
          to: '/planejamentos/$planejamentoId',
          params: { planejamentoId: String(id) },
        })
    }
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Planejamento acadêmico"
          title="Selecione um planejamento"
          description={
            planner.isAuthenticated
              ? 'Escolha um planejamento existente ou crie um novo para começar.'
              : 'Comece um rascunho nesta sessão ou importe um currículo existente.'
          }
        />
        <Card className="shadow-none">
          <CardContent className="space-y-4 p-5">
            {planner.isAuthenticated ? (
              planner.curricula.length ? (
                <div className="space-y-2">
                  <p className="text-sm font-bold">Seus planejamentos</p>
                  <div className="grid gap-2">
                    {planner.curricula.map((curriculum) => (
                      <Button
                        key={curriculum.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() =>
                          void navigate({
                            to: '/planejamentos/$planejamentoId',
                            params: { planejamentoId: String(curriculum.id) },
                          })
                        }
                      >
                        {curriculum.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Você ainda não possui planejamentos salvos.
                </p>
              )
            ) : (
              <Button
                onClick={() => {
                  planner.openAnonymousDraft()
                  void navigate({
                    to: '/planejamentos/$planejamentoId',
                    params: { planejamentoId: 'rascunho' },
                  })
                }}
              >
                <Plus /> Novo rascunho
              </Button>
            )}
            {planner.isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={() => void createPlan()}
                >
                <Plus /> Novo planejamento
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setSelectionError(false)
                importInputRef.current?.click()
              }}
            >
              <Upload /> Importar currículo
            </Button>
            <input
              ref={importInputRef}
              className="hidden"
              type="file"
              accept="application/json"
              onChange={(event) => {
                void importPlanning(event.target.files?.[0])
                event.target.value = ''
              }}
            />
            <PlanningImportReviewDialog
              disabled={planner.isDispatching}
              importResult={pendingImport}
              onConfirm={() => void confirmImport()}
              onOpenChange={(open) => {
                if (!open) setPendingImport(undefined)
              }}
            />
            {importError && (
              <Alert variant="destructive">
                <AlertTitle>Não foi possível importar</AlertTitle>
                <AlertDescription>
                  O arquivo não é um currículo válido ou é incompatível com os dados atuais.
                </AlertDescription>
              </Alert>
            )}
            {selectionError && (
              <Alert variant="destructive">
                <AlertTitle>Não foi possível criar o planejamento</AlertTitle>
                <AlertDescription>
                  {planner.actionError ?? 'Verifique sua sessão e tente novamente.'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    )
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
    !suggestionOnboardingDismissed && !snapshot.plan.periods.length
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
    <PageContainer size="wide">
      <PageHeader
        compact
        eyebrow="Planejamento acadêmico"
        title={planningName}
        description={
          planner.isAuthenticated
            ? planner.saveStatus === 'error'
              ? 'Não foi possível salvar'
              : planner.saveStatus === 'saving' || planner.saveStatus === 'pending'
                ? 'Salvando…'
                : planner.activeCurriculumId
                  ? 'Salvo automaticamente'
                  : 'Rascunho não salvo'
            : 'Rascunho desta sessão'
        }
        actions={
          <>
            <Button
              variant="outline"
                  onClick={() => {
                    planner.backToSelection()
                    void navigate({ to: '/' })
                  }}
            >
              Planejamentos
            </Button>
            {planner.isAuthenticated && !planner.activeCurriculumId && (
              <Button
                variant="outline"
                disabled={planner.isDispatching}
                onClick={() =>
                  void planner.saveDraft().then((id) => {
                    if (!id) return
                    void navigate({
                      to: '/planejamentos/$planejamentoId',
                      params: { planejamentoId: String(id) },
                    })
                  })
                }
              >
                <Save /> Salvar rascunho
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" aria-label="Ações do planejamento">
                  <MoreHorizontal /> Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <ChangeSuggestionDialog
                  staticData={staticData}
                  snapshot={snapshot}
                  disabled={planner.isDispatching}
                  dispatch={planner.dispatch}
                  label="Usar sugestão"
                  trigger={
                    <DropdownMenuItem
                      disabled={planner.isDispatching}
                      onSelect={(event) => event.preventDefault()}
                    >
                      Usar sugestão
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem
                  onSelect={() => importInputRef.current?.click()}
                >
                  <Upload /> Importar currículo
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    downloadPlanning(
                      snapshot,
                      staticData,
                      activeCurriculum?.name ?? planner.draftName,
                    )
                  }
                >
                  <Download /> Exportar currículo
                </DropdownMenuItem>
                {planner.isAuthenticated && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={planner.isDispatching}
                      onSelect={() => setCurriculumAction('rename')}
                    >
                      <Pencil /> Editar nome
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      disabled={planner.isDispatching}
                      onSelect={() => setCurriculumAction('delete')}
                    >
                      <Trash2 /> Apagar planejamento
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <ClearPlanningDialog
                  disabled={planner.isDispatching}
                  dispatch={planner.dispatch}
                  onCleared={() => {
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
      <PlanningImportReviewDialog
        disabled={planner.isDispatching}
        importResult={pendingImport}
        onConfirm={() => void confirmImport()}
        onOpenChange={(open) => {
          if (!open) setPendingImport(undefined)
        }}
      />
      {planner.isAuthenticated && (
        <>
          <RenameCurriculumDialog
            disabled={planner.isDispatching}
            initialName={curriculumName(
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
                void navigate({ to: '/' })
              }
              return succeeded
            }}
          />
        </>
      )}
      <input
        ref={importInputRef}
        className="hidden"
        type="file"
        accept="application/json"
        onChange={(event) => {
          void importPlanning(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      {importError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Não foi possível importar</AlertTitle>
          <AlertDescription>
            {importError === 'parse'
              ? 'O arquivo não é um planejamento JSON válido ou está em uma versão incompatível.'
              : errorText(planner.error ?? 'invalidInput')}
          </AlertDescription>
        </Alert>
      )}
      {planner.error && !importError && (
        <Alert variant="destructive" className="mb-6" aria-live="polite">
          <RotateCcw />
          <AlertTitle>Não foi possível concluir a ação</AlertTitle>
          <AlertDescription>{errorText(planner.error)}</AlertDescription>
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
                disabled={planner.isDispatching}
                dispatch={planner.dispatch}
              />
              <Button
                variant="outline"
                onClick={addSemester}
                disabled={planner.isDispatching}
              >
                <Plus /> Adicionar semestre
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <UnallocatedCoursesPanel
              courses={plannerView.completedCourses}
              credits={plannerView.completedCredits}
              courseOptions={plannerView.courseOptions}
              periods={periods}
              planningStart={snapshot.plan.planningStart}
              disabled={planner.isDispatching}
              dispatch={planner.dispatch}
            />
            {periods.length ? (
              plannerView.semesters.map((semester, index) => (
                <SemesterRow
                  key={semester.period.id}
                  semester={semester}
                  title={periodTitle(index, snapshot.plan.planningStart)}
                  periods={periods}
                  courseOptions={plannerView.courseOptions}
                  planningStart={snapshot.plan.planningStart}
                  disabled={planner.isDispatching}
                  dispatch={planner.dispatch}
                />
              ))
            ) : (
              <EmptyState
                title="Nenhum semestre criado"
                description="Adicione o primeiro semestre para começar a distribuir as disciplinas."
                action={{
                  label: 'Adicionar primeiro semestre',
                  onClick: addSemester,
                }}
              />
            )}
          </div>
        </section>
        {!showSuggestionOnboarding && (
          <CurriculumSelectionPanel
            staticData={staticData}
            snapshot={snapshot}
            disabled={planner.isDispatching}
            dispatch={planner.dispatch}
          />
        )}
        {snapshot.selection.catalogProgramId ? (
          <CurriculumBlocksPanel
            staticData={staticData}
            snapshot={snapshot}
            disabled={planner.isDispatching}
            dispatch={planner.dispatch}
          />
        ) : (
          <Card className="mb-7 border-dashed shadow-none">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Você pode começar sem currículo: crie um semestre e adicione
              qualquer disciplina. Escolha catálogo e programa depois para
              exibir os blocos da grade.
            </CardContent>
          </Card>
        )}
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
      </DndContext>
    </PageContainer>
  )
}
