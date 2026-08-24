import { useDraggable } from '@dnd-kit/core'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownUp, CircleAlert, CircleCheck, Trash2 } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { periodReference } from '@pomi/planner-domain/curriculum'
import type { ReactNode } from 'react'

import type {
  Course,
  CourseId,
  CoursePrerequisiteEvaluation,
  CurriculumCourseState,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import type { PlannerDispatch } from '@/planner/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { listStudyPeriods } from '@/student/data/studentApi'
import { mostRecentStudyPeriodsFirst } from '@/student/data/studyPeriodOrdering'
import { studyPeriodLabel } from '@/student/data/studyPeriod'

export type CourseDragData = Readonly<{
  type: 'course'
  course: Course
  completed: boolean
  currentPeriodId?: PlanningPeriodId
}>

export type PlannerDragData = CourseDragData

export type CoursePrerequisiteMenuState = Readonly<{
  year: number
  status: 'loading' | 'error' | 'notInCatalog' | 'ready'
  evaluation?: CoursePrerequisiteEvaluation
  preferredAlternativeKey?: string
  onAlternativeChange: (courseId: CourseId, key?: string) => void
}>

export type CoursePrerequisiteResolver = (
  courseId: CourseId,
) => CoursePrerequisiteMenuState

export function CompactVisual({
  code,
  credits,
  planned,
  className,
}: {
  code: string
  credits: number
  planned?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-grid h-8 w-[5.75rem] shrink-0 grid-cols-[5ch_1fr] items-center gap-2 rounded-sm border-2 border-strong-border bg-background px-2 font-mono text-xs font-black text-foreground shadow-[2px_2px_0_var(--strong-border)] transition-colors',
        planned && 'border-primary bg-primary/12',
        className,
      )}
    >
      <span className="text-center">{code}</span>
      <span className="text-right">({String(credits).padStart(2, '0')})</span>
    </span>
  )
}

function prerequisiteItemLabel(
  item: CoursePrerequisiteEvaluation['alternatives'][number]['items'][number],
) {
  const target = item.item.target
  const code =
    item.matchedCourseCode ??
    (target.type === 'course'
      ? target.code
      : target.type === 'prefix'
        ? `${target.prefix}---`
        : target.code)
  return `${item.item.kind === 'PARTIAL' ? '*' : ''}${code}`
}

function prerequisiteStatusLabel(
  status: CoursePrerequisiteEvaluation['alternatives'][number]['items'][number]['status'],
) {
  return {
    completed: 'Concluída',
    plannedBefore: 'Planejada antes',
    samePeriod: 'No mesmo semestre',
    plannedAfter: 'Planejada depois',
    unallocated: 'Não alocada',
    missing: 'Fora do planejamento',
    unknown: 'Condição especial',
  }[status]
}

function alternativeLabel(
  alternative: CoursePrerequisiteEvaluation['alternatives'][number],
) {
  return alternative.items.map(prerequisiteItemLabel).join(' + ')
}

function PrerequisiteIssueMarkers({
  prerequisites,
}: {
  prerequisites?: CoursePrerequisiteMenuState
}) {
  const issues = prerequisites?.evaluation?.issues ?? []
  if (!issues.length) return null
  return (
    <span className="pointer-events-none absolute -top-2 -right-2 z-40 flex gap-0.5">
      {issues.includes('missing') && (
        <span
          className="grid size-4 place-items-center rounded-full border border-amber-800 bg-amber-300 text-amber-950"
          title="Pré-requisito ausente do planejamento"
          aria-label="Pré-requisito ausente do planejamento"
        >
          <CircleAlert className="size-3" />
        </span>
      )}
      {issues.includes('inverted') && (
        <span
          className="grid size-4 place-items-center rounded-full border border-destructive bg-destructive text-destructive-foreground"
          title="Ordem de pré-requisito invertida"
          aria-label="Ordem de pré-requisito invertida"
        >
          <ArrowDownUp className="size-3" />
        </span>
      )}
    </span>
  )
}

function PrerequisiteMenuSection({
  course,
  prerequisites,
}: {
  course: Course
  prerequisites: CoursePrerequisiteMenuState
}) {
  const evaluation = prerequisites.evaluation
  const selected = evaluation?.alternatives.find(
    (alternative) => alternative.key === evaluation.selectedAlternativeKey,
  )
  return (
    <div className="w-[min(22rem,calc(100vw-2rem))] px-2 py-1">
      <p className="text-xs font-extrabold">
        Pré-requisitos - catálogo {prerequisites.year}
      </p>
      {prerequisites.status === 'loading' && (
        <p className="mt-1 text-xs text-muted-foreground">Carregando...</p>
      )}
      {prerequisites.status === 'error' && (
        <p className="mt-1 text-xs text-destructive">
          Pré-requisitos indisponíveis para {prerequisites.year}.
        </p>
      )}
      {prerequisites.status === 'notInCatalog' && (
        <p className="mt-1 text-xs text-muted-foreground">
          {course.code} não está disponível no catálogo de {prerequisites.year}.
        </p>
      )}
      {prerequisites.status === 'ready' && !evaluation && (
        <p className="mt-1 text-xs text-muted-foreground">
          Sem pré-requisitos no catálogo de {prerequisites.year}.
        </p>
      )}
      {selected && (
        <ul className="mt-2 space-y-1">
          {selected.items.map((item) => (
            <li
              key={`${selected.key}:${prerequisiteItemLabel(item)}`}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <span className="font-mono font-black">
                {prerequisiteItemLabel(item)}
              </span>
              <span
                className={cn(
                  'text-right font-semibold text-muted-foreground',
                  ['samePeriod', 'plannedAfter', 'missing'].includes(
                    item.status,
                  ) && 'text-destructive',
                )}
              >
                {prerequisiteStatusLabel(item.status)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {evaluation && evaluation.alternatives.length > 1 && (
        <div className="mt-3 border-t border-border pt-2">
          <p className="mb-1 text-xs font-extrabold">Escolha da alternativa</p>
          <DropdownMenuRadioGroup
            value={prerequisites.preferredAlternativeKey ?? '__automatic__'}
            onValueChange={(value) =>
              prerequisites.onAlternativeChange(
                course.id,
                value === '__automatic__' ? undefined : value,
              )
            }
          >
            <DropdownMenuRadioItem
              value="__automatic__"
              onSelect={(event) => event.preventDefault()}
            >
              Automática
            </DropdownMenuRadioItem>
            {evaluation.alternatives.map((alternative) => (
              <DropdownMenuRadioItem
                key={alternative.key}
                value={alternative.key}
                onSelect={(event) => event.preventDefault()}
              >
                {alternativeLabel(alternative)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </div>
      )}
    </div>
  )
}

function CourseDestinationMenu({
  children,
  course,
  plannedPeriodId,
  completed,
  periods,
  planningStart,
  disabled,
  dragging,
  dispatch,
  prerequisites,
}: {
  children: ReactNode
  course: Course
  plannedPeriodId?: PlanningPeriodId
  completed: boolean
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dragging?: boolean
  dispatch: PlannerDispatch
  prerequisites?: CoursePrerequisiteMenuState
}) {
  const [open, setOpen] = useState(false)
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false)
  const [completedStudyPeriodId, setCompletedStudyPeriodId] = useState('')
  const [completedGrade, setCompletedGrade] = useState('')
  const studyPeriodsQuery = useQuery({
    queryKey: ['curriculum-planner', 'study-periods'],
    queryFn: listStudyPeriods,
    staleTime: Infinity,
    enabled: completionDialogOpen,
  })
  useEffect(() => {
    if (dragging) setOpen(false)
  }, [dragging])
  const complete = async () => {
    const grade = completedGrade.trim() === '' ? null : Number(completedGrade)
    if (grade !== null && !Number.isFinite(grade)) return
    const succeeded = await dispatch({
      type: 'markCourseCompleted',
      courseId: course.id,
      studyPeriodId: completedStudyPeriodId
        ? Number(completedStudyPeriodId)
        : undefined,
      grade,
    })
    if (succeeded) setCompletionDialogOpen(false)
  }
  const studyPeriodOptions = mostRecentStudyPeriodsFirst(
    studyPeriodsQuery.data ?? [],
  ).map((period) => ({
    value: String(period.id),
    label: studyPeriodLabel(period),
  }))
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel className="max-w-64">
            {course.code} — {course.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {prerequisites && (
            <PrerequisiteMenuSection
              course={course}
              prerequisites={prerequisites}
            />
          )}
          {prerequisites && <DropdownMenuSeparator />}
          {completed ? (
            <>
              {periods.length ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Mover para</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {periods.map((period) => (
                      <DropdownMenuItem
                        key={period.id}
                        disabled={disabled || period.id === plannedPeriodId}
                        onSelect={() =>
                          void dispatch({
                            type: plannedPeriodId
                              ? 'moveCourseToPeriod'
                              : 'addCourseToPeriod',
                            courseId: course.id,
                            periodId: period.id,
                          })
                        }
                      >
                        {periodReference(period, periods, planningStart)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem disabled>
                  Adicione um semestre primeiro
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {plannedPeriodId && (
                <>
                  <DropdownMenuItem
                    className="text-destructive"
                    disabled={disabled}
                    onSelect={() =>
                      void dispatch({
                        type: 'removeCourseFromPlan',
                        courseId: course.id,
                      })
                    }
                  >
                    <Trash2 /> Remover do planejamento
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                className="text-destructive"
                disabled={disabled}
                onSelect={() =>
                  void dispatch({
                    type: 'unmarkCourseCompleted',
                    courseId: course.id,
                  })
                }
              >
                <Trash2 /> Desmarcar como concluída
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {plannedPeriodId && periods.length ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Mover para</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {periods.map((period) => (
                      <DropdownMenuItem
                        key={period.id}
                        disabled={disabled || period.id === plannedPeriodId}
                        onSelect={() =>
                          void dispatch({
                            type: 'moveCourseToPeriod',
                            courseId: course.id,
                            periodId: period.id,
                          })
                        }
                      >
                        {periodReference(period, periods, planningStart)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ) : periods.length ? (
                periods.map((period) => (
                  <DropdownMenuItem
                    key={period.id}
                    disabled={disabled}
                    onSelect={() =>
                      void dispatch({
                        type: 'addCourseToPeriod',
                        courseId: course.id,
                        periodId: period.id,
                      })
                    }
                  >
                    Adicionar ao{' '}
                    {periodReference(period, periods, planningStart)}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  Adicione um semestre primeiro
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={disabled}
                onSelect={() => {
                  setOpen(false)
                  setCompletionDialogOpen(true)
                }}
              >
                <CircleCheck /> Marcar como concluída
              </DropdownMenuItem>
              {plannedPeriodId && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    disabled={disabled}
                    onSelect={() =>
                      void dispatch({
                        type: 'removeCourseFromPlan',
                        courseId: course.id,
                      })
                    }
                  >
                    <Trash2 /> Remover do planejamento
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={completionDialogOpen}
        onOpenChange={setCompletionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como concluída</DialogTitle>
            <DialogDescription>
              Informe quando você concluiu {course.code}. A nota é opcional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block space-y-2 text-sm font-bold">
              <span>Período</span>
              <AutocompleteSelect
                ariaLabel="Período em que a disciplina foi concluída"
                value={completedStudyPeriodId}
                onValueChange={setCompletedStudyPeriodId}
                options={studyPeriodOptions}
                placeholder="Selecione o período"
                emptyLabel={
                  studyPeriodsQuery.isLoading
                    ? 'Carregando períodos…'
                    : 'Nenhum período disponível'
                }
              />
            </label>
            <label className="block space-y-2 text-sm font-bold">
              <span>Nota (quando houver)</span>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={completedGrade}
                onChange={(event) => setCompletedGrade(event.target.value)}
              />
            </label>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCompletionDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button disabled={disabled} onClick={() => void complete()}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const CompactCourseCard = memo(function CompactCourseCard({
  dragId,
  state,
  periods,
  planningStart,
  disabled,
  dispatch,
  prerequisiteResolver,
}: {
  dragId: string
  state: CurriculumCourseState
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dispatch: PlannerDispatch
  prerequisiteResolver?: CoursePrerequisiteResolver
}) {
  const data: CourseDragData = {
    type: 'course',
    course: state.course,
    completed: state.completed,
    currentPeriodId: state.plannedPeriodId,
  }
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data,
    disabled,
  })
  const period = periods.find((item) => item.id === state.plannedPeriodId)
  const prerequisites = prerequisiteResolver?.(state.course.id)
  const issueLabel = (prerequisites?.evaluation?.issues ?? [])
    .map((issue) =>
      issue === 'missing'
        ? 'pré-requisito ausente do planejamento'
        : 'ordem de pré-requisito invertida',
    )
    .join(', ')
  const label = `${state.course.code}, ${state.course.name}, ${state.course.credits} créditos${state.completed ? (period ? `, concluída e planejada em ${periodReference(period, periods, planningStart)}` : ', concluída') : period ? `, planejada em ${periodReference(period, periods, planningStart)}` : ', não planejada'}${issueLabel ? `, ${issueLabel}` : ''}`
  return (
    <CourseDestinationMenu
      course={state.course}
      plannedPeriodId={state.plannedPeriodId}
      completed={state.completed}
      periods={periods}
      planningStart={planningStart}
      disabled={disabled}
      dragging={isDragging}
      dispatch={dispatch}
      prerequisites={prerequisites}
    >
      <button
        ref={setNodeRef}
        type="button"
        data-course-id={state.course.id}
        className={cn(
          'pomi-focus relative z-30 touch-none rounded-sm select-none [&[data-prerequisite-tree=true]>span]:bg-primary/30 [&[data-prerequisite-active=true]>span]:bg-primary/50',
          isDragging && 'opacity-30',
        )}
        aria-label={label}
        title={label}
        {...attributes}
        {...listeners}
      >
        <CompactVisual
          code={state.course.code}
          credits={state.course.credits}
          planned={Boolean(state.plannedPeriodId) && !state.completed}
        />
        <PrerequisiteIssueMarkers prerequisites={prerequisites} />
      </button>
    </CourseDestinationMenu>
  )
})
