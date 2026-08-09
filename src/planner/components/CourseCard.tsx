import { useDraggable } from '@dnd-kit/core'
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
import { cn } from '@/lib/utils'
import { periodReference } from '@/planner/domain/planningPeriods'

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
        'inline-flex h-8 min-w-24 items-center justify-between gap-2 rounded-sm border-2 border-strong-border bg-background px-2 font-mono text-xs font-black text-foreground shadow-[2px_2px_0_var(--strong-border)]',
        planned && 'border-primary bg-primary/12',
        className,
      )}
    >
      <span>{code}</span>
      <span>({String(credits).padStart(2, '0')})</span>
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
  useEffect(() => {
    if (dragging) setOpen(false)
  }, [dragging])
  return (
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
                  Adicionar ao {periodReference(period, periods, planningStart)}
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
              onSelect={() =>
                void dispatch({
                  type: 'markCourseCompleted',
                  courseId: course.id,
                })
              }
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
