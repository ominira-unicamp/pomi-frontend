import { useDroppable } from '@dnd-kit/core'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { memo, useState } from 'react'

import { CompactCourseCard } from './CourseCard'
import type {
  Course,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
} from '@/planner/domain/curriculumPlanner'
import type { PlannerDispatch } from '@/planner/types'
import type { CourseOption, SemesterViewModel } from '@/planner/viewModel'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import { ActionTooltip } from '@/planner/components/ActionTooltip'
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
import { insertCourseInPeriod } from '@/planner/domain/planningPeriods'

type Dispatch = PlannerDispatch

function AddCourseToSemesterDialog({
  courseOptions,
  period,
  periods,
  title,
  disabled,
  dispatch,
}: {
  courseOptions: ReadonlyArray<CourseOption>
  period: PlanningPeriod
  periods: ReadonlyArray<PlanningPeriod>
  title: string
  disabled: boolean
  dispatch: Dispatch
}) {
  const [open, setOpen] = useState(false)
  const [courseId, setCourseId] = useState('')
  const submit = async () => {
    if (!courseId) return
    const succeeded = await dispatch(
      insertCourseInPeriod(courseId as Course['id'], period.id, periods),
    )
    if (succeeded) {
      setCourseId('')
      setOpen(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar disciplina</DialogTitle>
          <DialogDescription>
            Escolha a disciplina que será adicionada a {title}.
          </DialogDescription>
        </DialogHeader>
        <AutocompleteSelect
          ariaLabel={`Disciplina para ${title}`}
          value={courseId}
          onValueChange={setCourseId}
          options={courseOptions}
          placeholder="Clique ou digite o código ou nome"
        />
        <DialogFooter>
          <ActionTooltip content="Feche sem adicionar uma disciplina.">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
          </ActionTooltip>
          <ActionTooltip content="Adicione a disciplina selecionada a este semestre.">
            <Button
              disabled={disabled || !courseId}
              onClick={() => void submit()}
            >
              Adicionar
            </Button>
          </ActionTooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type SemesterRowProps = {
  semester: SemesterViewModel
  title: string
  periods: ReadonlyArray<PlanningPeriod>
  courseOptions: ReadonlyArray<CourseOption>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dispatch: Dispatch
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
  courseOptions,
  planningStart,
  disabled,
  dispatch,
  isOver,
  setNodeRef,
}: SemesterRowProps & {
  isOver: boolean
  setNodeRef: (node: HTMLElement | null) => void
}) {
  const [removeOpen, setRemoveOpen] = useState(false)
  const { period, courses, credits, current } = semester
  return (
    <article
      className={cn(
        'grid overflow-hidden rounded-md border-2 border-strong-border bg-card shadow-[4px_4px_0_color-mix(in_srgb,var(--primary)_25%,transparent)] lg:grid-cols-[11rem_1fr_7rem]',
        current && 'border-primary',
        isOver && 'ring-4 ring-primary/40',
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b-2 border-border bg-primary/10 p-2 lg:border-r-2 lg:border-b-0">
        <div>
          <h3 className="whitespace-nowrap text-sm font-black">{title}</h3>
          {current && (
            <span className="mt-1 inline-flex rounded-sm bg-primary px-2 py-0.5 text-xs font-black text-primary-foreground">
              Atual
            </span>
          )}
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
        className={cn(
          'min-h-0 border-b-2 border-border p-2 lg:border-r-2 lg:border-b-0',
          isOver && 'bg-primary/10',
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <AddCourseToSemesterDialog
            courseOptions={courseOptions}
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
                  dispatch={dispatch}
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
      <aside className="flex items-center justify-between bg-muted/45 p-2 text-sm lg:block lg:text-center">
        <div>
          <strong className="block text-lg">{credits}</strong>
          <span className="text-muted-foreground">créditos</span>
        </div>
      </aside>
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
  courseOptions,
  disabled,
  dispatch,
}: {
  courseOptions: ReadonlyArray<CourseOption>
  disabled: boolean
  dispatch: Dispatch
}) {
  const [open, setOpen] = useState(false)
  const [courseId, setCourseId] = useState('')
  const submit = async () => {
    if (!courseId) return
    const succeeded = await dispatch({
      type: 'addCourseToUnallocated',
      courseId: courseId as Course['id'],
    })
    if (succeeded) {
      setCourseId('')
      setOpen(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar disciplina não alocada</DialogTitle>
          <DialogDescription>
            Escolha uma disciplina que ainda não foi alocada a um semestre.
          </DialogDescription>
        </DialogHeader>
        <AutocompleteSelect
          ariaLabel="Disciplina não alocada"
          value={courseId}
          onValueChange={setCourseId}
          options={courseOptions}
          placeholder="Clique ou digite o código ou nome"
        />
        <DialogFooter>
          <ActionTooltip content="Feche sem adicionar uma disciplina.">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
          </ActionTooltip>
          <ActionTooltip content="Guarde a disciplina para alocá-la depois.">
            <Button
              disabled={disabled || !courseId}
              onClick={() => void submit()}
            >
              Adicionar
            </Button>
          </ActionTooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

type UnallocatedCoursesPanelProps = {
  courses: ReadonlyArray<Course>
  credits: number
  courseOptions: ReadonlyArray<CourseOption>
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dispatch: Dispatch
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
    courseOptions,
    periods,
    planningStart,
    disabled,
    dispatch,
    isOver,
    setNodeRef,
  }: UnallocatedCoursesPanelProps & {
    isOver: boolean
    setNodeRef: (node: HTMLElement | null) => void
  }) {
    return (
      <article className="grid overflow-hidden rounded-md border-2 border-strong-border bg-card shadow-[4px_4px_0_color-mix(in_srgb,var(--primary)_25%,transparent)] lg:grid-cols-[11rem_1fr_7rem]">
        <header className="flex items-center border-b-2 border-border bg-primary/10 p-2 lg:border-r-2 lg:border-b-0">
          <div>
            <h3 className="whitespace-nowrap text-sm font-black">
              Não alocadas
            </h3>
          </div>
        </header>
        <div
          ref={setNodeRef}
          className={cn(
            'min-h-0 border-b-2 border-border p-2 lg:border-r-2 lg:border-b-0',
            isOver && 'bg-primary/10',
          )}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <AddUnallocatedCourseDialog
              courseOptions={courseOptions}
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
                dispatch={dispatch}
              />
            ))}
            {!courses.length && (
              <p className="min-h-8 content-center text-sm font-semibold text-muted-foreground">
                Adicione as disciplinas que ainda não foram alocadas.
              </p>
            )}
          </div>
        </div>
        <aside className="flex items-center justify-between bg-muted/45 p-2 text-sm lg:block lg:text-center">
          <div>
            <strong className="block text-lg">{credits}</strong>
            <span className="text-muted-foreground">créditos</span>
          </div>
        </aside>
      </article>
    )
  },
)
