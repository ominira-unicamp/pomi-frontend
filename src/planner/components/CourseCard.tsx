import { useDraggable } from '@dnd-kit/core'
import { ArrowDownUp, CircleAlert } from 'lucide-react'
import { memo, useEffect, useRef } from 'react'
import { periodReference } from '@pomi/planner-domain/curriculum'

import type {
  Course,
  CourseId,
  CoursePrerequisiteEvaluation,
  CurriculumCourseState,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import { cn } from '@/lib/utils'

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

export const CompactCourseCard = memo(function CompactCourseCard({
  dragId,
  state,
  periods,
  planningStart,
  disabled,
  onOpenDetails,
  prerequisiteResolver,
}: {
  dragId: string
  state: CurriculumCourseState
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  onOpenDetails: (courseId: CourseId) => void
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
  const dragged = useRef(false)
  useEffect(() => {
    if (isDragging) dragged.current = true
  }, [isDragging])
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
      onClick={() => {
        if (dragged.current) {
          dragged.current = false
          return
        }
        onOpenDetails(state.course.id)
      }}
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
  )
})
