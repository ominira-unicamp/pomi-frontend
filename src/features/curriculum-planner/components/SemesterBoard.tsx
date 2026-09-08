import { useDroppable } from '@dnd-kit/core'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { memo, useState } from 'react'

import { insertCourseInPeriod } from '@pomi/planner-domain/curriculum'
import { CompactCourseCard } from './CourseCard'
import { CourseSearchDialog } from './CourseSearchDialog'
import type { CoursePrerequisiteResolver } from './CourseCard'
import type {
  Course,
  CourseId,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
} from '@pomi/planner-domain/curriculum'
import type { PlannerDispatch } from '@/features/curriculum-planner/types'
import type { SemesterViewModel } from '@/features/curriculum-planner/viewModel'
import { Button } from '@/components/ui/button'
import { ActionTooltip } from '@/features/curriculum-planner/components/ActionTooltip'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type Dispatch = PlannerDispatch

function AddCourseToSemesterDialog({
  availableCourses,
  excludedCourseIds,
  period,
  periods,
  title,
  disabled,
  dispatch,
}: {
  availableCourses: ReadonlyArray<Course>
  excludedCourseIds: ReadonlySet<CourseId>
  period: PlanningPeriod
  periods: ReadonlyArray<PlanningPeriod>
  title: string
  disabled: boolean
  dispatch: Dispatch
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ActionTooltip content={`Adicione uma disciplina a ${title}.`}>
        <Button
          size="icon"
          variant="outline"
          disabled={disabled}
          onClick={() => setOpen(true)}
          aria-label={`Adicionar disciplina a ${title}`}
          className="h-8 w-8 shrink-0 rounded-sm border-2 border-strong-border bg-background p-0 shadow-[2px_2px_0_var(--strong-border)] hover:bg-accent"
        >
          <Plus />
        </Button>
      </ActionTooltip>
      <CourseSearchDialog
        open={open}
        onOpenChange={setOpen}
        courses={availableCourses}
        excludedCourseIds={excludedCourseIds}
        description={`Busque a disciplina que será adicionada a ${title}.`}
        searchLabel={`Disciplina para ${title}`}
        disabled={disabled}
        onAdd={(courseId) =>
          dispatch(insertCourseInPeriod(courseId, period.id, periods))
        }
      />
    </>
  )
}

type SemesterRowProps = {
  semester: SemesterViewModel
  title: string
  periods: ReadonlyArray<PlanningPeriod>
  availableCourses: ReadonlyArray<Course>
  excludedCourseIds: ReadonlySet<CourseId>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dispatch: Dispatch
  onOpenCourseDetails: (courseId: CourseId) => void
  selectedCourseIds: ReadonlySet<CourseId>
  selectionMode: boolean
  onToggleCourseSelection: (courseId: CourseId) => void
  onPlaceSelectedCourses: (periodId: PlanningPeriod['id']) => Promise<void>
  prerequisiteResolver?: CoursePrerequisiteResolver
}

export function SemesterRow(props: SemesterRowProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `period:${props.semester.period.id}`,
  })
  return (
    <SemesterRowContent {...props} isOver={isOver} setNodeRef={setNodeRef} />
  )
}

const SemesterRowContent = memo(function SemesterRowContent({
  semester,
  title,
  periods,
  availableCourses,
  excludedCourseIds,
  planningStart,
  disabled,
  dispatch,
  onOpenCourseDetails,
  selectedCourseIds,
  selectionMode,
  onToggleCourseSelection,
  onPlaceSelectedCourses,
  prerequisiteResolver,
  isOver,
  setNodeRef,
}: SemesterRowProps & {
  isOver: boolean
  setNodeRef: (node: HTMLElement | null) => void
}) {
  const [removeOpen, setRemoveOpen] = useState(false)
  const { period, courses, credits, current } = semester
  const selectionActive = selectedCourseIds.size > 0
  return (
    <article
      className={cn(
        'relative grid bg-card lg:grid-cols-[11rem_1fr]',
        current && 'bg-primary/5',
        isOver && 'z-10 ring-4 ring-inset ring-primary/40',
        selectionActive &&
          !disabled &&
          'cursor-pointer hover:bg-primary/5 hover:ring-2 hover:ring-inset hover:ring-primary/40',
      )}
      onClick={(event) => {
        if (
          !selectionActive ||
          disabled ||
          (event.target instanceof Element &&
            event.target.closest('button, a, input, select, textarea'))
        )
          return
        void onPlaceSelectedCourses(period.id)
      }}
    >
      <header className="flex items-center justify-between gap-2 border-b-2 border-border bg-primary/10 p-2 lg:border-r-2 lg:border-b-0">
        <div>
          <h3 className="whitespace-nowrap text-sm font-black">{title}</h3>
          {current && (
            <span className="mt-1 inline-flex rounded-sm bg-primary px-2 py-0.5 text-xs font-black text-primary-foreground">
              Atual
            </span>
          )}
          <span className="mt-1 block text-sm text-muted-foreground">
            <strong>{credits}</strong> créditos
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Ações de ${title}`}
                title={`Abra as ações de ${title}.`}
              >
                <GripVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <ActionTooltip content="Indique que este é o semestre que você está cursando agora.">
                <DropdownMenuItem
                  disabled={disabled || current}
                  onSelect={() =>
                    void dispatch({
                      type: 'setCurrentPlanningPeriod',
                      periodId: period.id,
                    })
                  }
                >
                  Marcar como atual
                </DropdownMenuItem>
              </ActionTooltip>
              {current && (
                <ActionTooltip content="Remova a indicação de semestre atual.">
                  <DropdownMenuItem
                    disabled={disabled}
                    onSelect={() =>
                      void dispatch({
                        type: 'setCurrentPlanningPeriod',
                        periodId: null,
                      })
                    }
                  >
                    Desmarcar como atual
                  </DropdownMenuItem>
                </ActionTooltip>
              )}
              <DropdownMenuSeparator />
              <ActionTooltip content="Remova este semestre e suas alocações do currículo.">
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={() => setRemoveOpen(true)}
                >
                  <Trash2 /> Remover semestre
                </DropdownMenuItem>
              </ActionTooltip>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div
        ref={setNodeRef}
        data-prerequisite-course-area
        className={cn(
          'min-h-0 px-2 py-6 lg:border-r-2',
          isOver && 'bg-primary/10',
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <AddCourseToSemesterDialog
            availableCourses={availableCourses}
            excludedCourseIds={excludedCourseIds}
            period={period}
            periods={periods}
            title={title}
            disabled={disabled}
            dispatch={dispatch}
          />
          {courses.length ? (
            <>
              {courses.map((state) => (
                <CompactCourseCard
                  key={`planned:${state.course.id}`}
                  dragId={`period:${period.id}:course:${state.course.id}`}
                  state={{
                    course: state.course,
                    plannedPeriodId: period.id,
                    completed: state.completed,
                  }}
                  periods={periods}
                  planningStart={planningStart}
                  disabled={disabled}
                  onOpenDetails={onOpenCourseDetails}
                  selected={selectedCourseIds.has(state.course.id)}
                  selectionMode={selectionMode}
                  onToggleSelection={onToggleCourseSelection}
                  prerequisiteResolver={prerequisiteResolver}
                />
              ))}
            </>
          ) : (
            <p className="min-h-8 content-center text-sm font-semibold text-muted-foreground">
              Arraste ou adicione disciplinas neste semestre.
            </p>
          )}
        </div>
      </div>
      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover semestre?</DialogTitle>
            <DialogDescription>
              As disciplinas e reservas planejadas nele serão removidas.
              Disciplinas concluídas serão preservadas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={disabled}
              onClick={() =>
                void dispatch({
                  type: 'removePlanningPeriod',
                  periodId: period.id,
                }).then((succeeded) => succeeded && setRemoveOpen(false))
              }
            >
              Remover semestre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  )
})

const AddUnallocatedCourseDialog = memo(function AddUnallocatedCourseDialog({
  availableCourses,
  excludedCourseIds,
  disabled,
  dispatch,
}: {
  availableCourses: ReadonlyArray<Course>
  excludedCourseIds: ReadonlySet<CourseId>
  disabled: boolean
  dispatch: Dispatch
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ActionTooltip content="Adicione uma disciplina sem vinculá-la a um semestre.">
        <Button
          size="icon"
          variant="outline"
          disabled={disabled}
          onClick={() => setOpen(true)}
          aria-label="Adicionar disciplina não alocada"
          className="h-8 w-8 shrink-0 rounded-sm border-2 border-strong-border bg-background p-0 shadow-[2px_2px_0_var(--strong-border)] hover:bg-accent"
        >
          <Plus />
        </Button>
      </ActionTooltip>
      <CourseSearchDialog
        open={open}
        onOpenChange={setOpen}
        courses={availableCourses}
        excludedCourseIds={excludedCourseIds}
        title="Adicionar disciplina não alocada"
        description="Busque uma disciplina para adicionar sem vinculá-la a um semestre."
        searchLabel="Disciplina não alocada"
        disabled={disabled}
        onAdd={(courseId) =>
          dispatch({ type: 'addCourseToUnallocated', courseId })
        }
      />
    </>
  )
})

type UnallocatedCoursesPanelProps = {
  courses: ReadonlyArray<Course>
  credits: number
  availableCourses: ReadonlyArray<Course>
  excludedCourseIds: ReadonlySet<CourseId>
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dispatch: Dispatch
  onOpenCourseDetails: (courseId: CourseId) => void
  selectedCourseIds: ReadonlySet<CourseId>
  selectionMode: boolean
  onToggleCourseSelection: (courseId: CourseId) => void
  onPlaceSelectedCourses: () => Promise<void>
  prerequisiteResolver?: CoursePrerequisiteResolver
}

export function UnallocatedCoursesPanel(props: UnallocatedCoursesPanelProps) {
  const { isOver, setNodeRef } = useDroppable({ id: 'unallocated' })
  return (
    <UnallocatedCoursesPanelContent
      {...props}
      isOver={isOver}
      setNodeRef={setNodeRef}
    />
  )
}

const UnallocatedCoursesPanelContent = memo(
  function UnallocatedCoursesPanelContent({
    courses,
    credits,
    availableCourses,
    excludedCourseIds,
    periods,
    planningStart,
    disabled,
    dispatch,
    onOpenCourseDetails,
    selectedCourseIds,
    selectionMode,
    onToggleCourseSelection,
    onPlaceSelectedCourses,
    prerequisiteResolver,
    isOver,
    setNodeRef,
  }: UnallocatedCoursesPanelProps & {
    isOver: boolean
    setNodeRef: (node: HTMLElement | null) => void
  }) {
    return (
      <article
        className={cn(
          'relative grid bg-card lg:grid-cols-[11rem_1fr]',
          isOver && 'z-10 ring-4 ring-inset ring-primary/40',
          selectedCourseIds.size > 0 &&
            !disabled &&
            'cursor-pointer hover:bg-primary/5 hover:ring-2 hover:ring-inset hover:ring-primary/40',
        )}
        onClick={(event) => {
          if (
            !selectedCourseIds.size ||
            disabled ||
            (event.target instanceof Element &&
              event.target.closest('button, a, input, select, textarea'))
          )
            return
          void onPlaceSelectedCourses()
        }}
      >
        <header className="flex items-center border-b-2 border-border bg-primary/10 p-2 lg:border-r-2 lg:border-b-0">
          <div>
            <h3 className="whitespace-nowrap text-sm font-black">
              Não alocadas
            </h3>
            <span className="mt-1 block text-sm text-muted-foreground">
              <strong>{credits}</strong> créditos
            </span>
          </div>
        </header>
        <div
          ref={setNodeRef}
          data-prerequisite-course-area
          className={cn(
            'min-h-0 px-2 py-6 lg:border-r-2',
            isOver && 'bg-primary/10',
          )}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <AddUnallocatedCourseDialog
              availableCourses={availableCourses}
              excludedCourseIds={excludedCourseIds}
              disabled={disabled}
              dispatch={dispatch}
            />
            {courses.map((course) => (
              <CompactCourseCard
                key={course.id}
                dragId={`unallocated:course:${course.id}`}
                state={{
                  course,
                  completed: false,
                }}
                periods={periods}
                planningStart={planningStart}
                disabled={disabled}
                onOpenDetails={onOpenCourseDetails}
                selected={selectedCourseIds.has(course.id)}
                selectionMode={selectionMode}
                onToggleSelection={onToggleCourseSelection}
                prerequisiteResolver={prerequisiteResolver}
              />
            ))}
            {!courses.length && (
              <p className="min-h-8 content-center text-sm font-semibold text-muted-foreground">
                Adicione as disciplinas que ainda não foram alocadas.
              </p>
            )}
          </div>
        </div>
      </article>
    )
  },
)
