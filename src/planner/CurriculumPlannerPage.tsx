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
import { Download, Plus, RotateCcw, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import type { PlannerDragData } from '@/planner/components/CourseCard'
import type { PlannerError } from '@/planner/domain/curriculumPlanner'
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
import { CurriculumBlocksPanel } from '@/planner/components/CurriculumBlocksPanel'
import { ClearPlanningDialog } from '@/planner/components/ClearPlanningDialog'
import { CurriculumSelectionPanel } from '@/planner/components/CurriculumSelection'
import {
  ChangeSuggestionDialog,
  SuggestionOnboardingPanel,
} from '@/planner/components/CurriculumSuggestion'
import { PlanningStartDialog } from '@/planner/components/PlanningStartDialog'
import {
  CompletedCoursesPanel,
  SemesterRow,
} from '@/planner/components/SemesterBoard'
import { CompactVisual } from '@/planner/components/CourseCard'
import { suggestionOnboardingPreferenceKey } from '@/planner/data/curriculumSuggestionApi'
import { useCurriculumPlanner } from '@/planner/CurriculumPlannerProvider'
import { periodTitle } from '@/planner/domain/planningPeriods'
import {
  downloadPlanning,
  parsePlanning,
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
      completedCourses:
        'O arquivo repete uma disciplina na lista de concluídas.',
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

export function CurriculumPlannerPage() {
  const planner = useCurriculumPlanner()
  const viewModel = useMemo(
    () =>
      planner.staticData && planner.snapshot
        ? buildPlannerViewModel(planner.staticData, planner.snapshot)
        : undefined,
    [planner.snapshot, planner.staticData],
  )
  const [activeDrag, setActiveDrag] = useState<PlannerDragData>()
  const [importError, setImportError] = useState<'parse' | 'dispatch'>()
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
  const { staticData, snapshot } = planner
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
  const importPlanning = async (file?: File) => {
    if (!file) return
    try {
      const data = parsePlanning(JSON.parse(await file.text()))
      if (!data) throw new Error('invalid')
      const succeeded = await planner.dispatch({ type: 'importPlanning', data })
      setImportError(succeeded ? undefined : 'dispatch')
    } catch {
      setImportError('parse')
    }
  }
  return (
    <PageContainer size="wide">
      <PageHeader
        eyebrow="Planejamento acadêmico"
        title="Seu planejamento"
        description="Monte os semestres livremente ou a partir dos blocos do currículo. O rascunho fica salvo neste navegador."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => downloadPlanning(snapshot)}
            >
              <Download /> Exportar currículo
            </Button>
            <Button
              variant="outline"
              onClick={() => importInputRef.current?.click()}
            >
              <Upload /> Importar currículo
            </Button>
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
            />
            <ChangeSuggestionDialog
              staticData={staticData}
              snapshot={snapshot}
              disabled={planner.isDispatching}
              dispatch={planner.dispatch}
              label="Usar sugestão"
            />
          </>
        }
      />
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
            <CompletedCoursesPanel
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
