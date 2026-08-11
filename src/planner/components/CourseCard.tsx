import { useDraggable } from '@dnd-kit/core'
import { useQuery } from '@tanstack/react-query'
import { CircleCheck, Trash2 } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import type {
  Course,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
  PlanningPeriodId,
} from '@/planner/domain/curriculumPlanner'
import type { CurriculumCourseState } from '@/planner/domain/curriculumBlocks'
import type { PlannerDispatch } from '@/planner/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { periodReference } from '@/planner/domain/planningPeriods'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { listStudyPeriods } from '@/student/data/studentApi'
import { mostRecentStudyPeriodsFirst } from '@/student/data/studyPeriodOrdering'

export type CourseDragData = Readonly<{
  type: 'course'
  course: Course
  completed: boolean
  currentPeriodId?: PlanningPeriodId
}>

export type PlannerDragData = CourseDragData

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
        'inline-grid h-8 w-[5.75rem] shrink-0 grid-cols-[5ch_1fr] items-center gap-2 rounded-sm border-2 border-strong-border bg-background px-2 font-mono text-xs font-black text-foreground shadow-[2px_2px_0_var(--strong-border)]',
        planned && 'border-primary bg-primary/12',
        className,
      )}
    >
      <span className="text-center">{code}</span>
      <span className="text-right">({String(credits).padStart(2, '0')})</span>
    </span>
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
    label: period.code,
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
}: {
  dragId: string
  state: CurriculumCourseState
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dispatch: PlannerDispatch
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
  const label = `${state.course.code}, ${state.course.name}, ${state.course.credits} créditos${state.completed ? (period ? `, concluída e planejada em ${periodReference(period, periods, planningStart)}` : ', concluída') : period ? `, planejada em ${periodReference(period, periods, planningStart)}` : ', não planejada'}`
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
    >
      <button
        ref={setNodeRef}
        type="button"
        className={cn(
          'pomi-focus touch-none rounded-sm select-none',
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
      </button>
    </CourseDestinationMenu>
  )
})
