import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Download,
  GripVertical,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import type {
  Course,
  CurriculumPlannerImport,
  CurriculumPlannerCommand,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlanningPeriod,
  PlanningPeriodId,
} from '@/lib/curriculumPlanner'
import type {
  CurriculumBlockView,
  CurriculumCourseState,
} from '@/planner/curriculumBlocks'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useCurriculumPlanner } from '@/planner/CurriculumPlannerProvider'
import { buildCurriculumGroups } from '@/planner/curriculumBlocks'

type Dispatch = (command: CurriculumPlannerCommand) => Promise<boolean>

type AutocompleteOption = Readonly<{
  value: string
  label: string
}>

const autocompleteOptionHeight = 40
const autocompleteViewportHeight = 224
const autocompleteOverscan = 4

function AutocompleteSelect({
  ariaLabel,
  disabled,
  emptyLabel,
  onValueChange,
  options,
  placeholder,
  value,
}: {
  ariaLabel: string
  disabled?: boolean
  emptyLabel?: string
  onValueChange: (value: string) => void
  options: ReadonlyArray<AutocompleteOption>
  placeholder?: string
  value: string
}) {
  const listId = useId()
  const selected = options.find((option) => option.value === value)
  const [query, setQuery] = useState(selected?.label ?? '')
  const [open, setOpen] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(selected?.label ?? '')
  }, [selected?.label])

  const select = (option?: AutocompleteOption) => {
    if (!option) {
      setQuery('')
      onValueChange('')
      setOpen(false)
      return
    }
    setQuery(option.label)
    onValueChange(option.value)
    setOpen(false)
  }
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
  const visibleOptions = options.filter(
    (option) =>
      !normalizedQuery ||
      option.label.toLocaleLowerCase('pt-BR').includes(normalizedQuery),
  )
  const optionListOffset = emptyLabel ? autocompleteOptionHeight : 0
  const optionScrollTop = Math.max(0, scrollTop - optionListOffset)
  const visibleCount = Math.ceil(
    autocompleteViewportHeight / autocompleteOptionHeight,
  )
  const firstOptionIndex = Math.max(
    0,
    Math.floor(optionScrollTop / autocompleteOptionHeight) -
      autocompleteOverscan,
  )
  const lastOptionIndex = Math.min(
    visibleOptions.length,
    firstOptionIndex + visibleCount + autocompleteOverscan * 2,
  )
  const renderedOptions = visibleOptions.slice(
    firstOptionIndex,
    lastOptionIndex,
  )

  useEffect(() => {
    setScrollTop(0)
    if (listRef.current) listRef.current.scrollTop = 0
  }, [normalizedQuery])

  return (
    <div className="relative">
      <Input
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open}
        value={query}
        disabled={disabled}
        placeholder={placeholder ?? emptyLabel}
        aria-label={ariaLabel}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
          if (!event.target.value) onValueChange('')
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
          if (event.key === 'Enter' && visibleOptions.length === 1) {
            event.preventDefault()
            select(visibleOptions[0])
          }
        }}
        onBlur={() => setOpen(false)}
      />
      {open && !disabled && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={`Opções de ${ariaLabel}`}
          className="absolute z-50 mt-1 w-max min-w-full overflow-y-auto rounded-md border-2 border-strong-border bg-popover p-1 text-popover-foreground shadow-lg"
          style={{
            height: Math.min(
              autocompleteViewportHeight,
              optionListOffset +
                visibleOptions.length * autocompleteOptionHeight,
            ),
          }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          {emptyLabel && (
            <button
              type="button"
              role="option"
              aria-selected={!value}
              className="pomi-focus block h-10 w-full whitespace-nowrap rounded-sm px-3 py-2 text-left text-sm font-semibold hover:bg-accent"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select()}
            >
              {emptyLabel}
            </button>
          )}
          <div
            style={{
              height: visibleOptions.length * autocompleteOptionHeight,
              position: 'relative',
            }}
          >
            {renderedOptions.map((option, index) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                className="pomi-focus absolute h-10 w-full whitespace-nowrap rounded-sm px-3 py-2 text-left text-sm font-semibold hover:bg-accent"
                style={{
                  top: (firstOptionIndex + index) * autocompleteOptionHeight,
                }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {!visibleOptions.length && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Nenhuma opção encontrada.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

type CourseDragData = Readonly<{
  type: 'course'
  course: Course
  completed: boolean
  currentPeriodId?: PlanningPeriodId
}>

type PlannerDragData = CourseDragData

function errorText(code: string) {
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

function orderedPeriods(plan: CurriculumPlannerSnapshot['plan']) {
  return plan.periods
}

function periodTitle(
  index: number,
  start: CurriculumPlannerSnapshot['plan']['planningStart'],
) {
  if (!start) return `${index + 1}º sem`
  const offset = start.semester - 1 + index
  return `${(start.semesterNumber ?? 1) + index}º sem - ${(offset % 2) + 1}s${start.year + Math.floor(offset / 2)}`
}

function periodReference(
  period: PlanningPeriod,
  periods: ReadonlyArray<PlanningPeriod>,
  start: CurriculumPlannerSnapshot['plan']['planningStart'],
) {
  const index = periods.findIndex((candidate) => candidate.id === period.id)
  return periodTitle(index === -1 ? 0 : index, start)
}

function insertCourseInPeriod(
  courseId: Course['id'],
  periodId: PlanningPeriodId,
  periods: ReadonlyArray<PlanningPeriod>,
): CurriculumPlannerCommand {
  const sourcePeriod = periods.find((period) =>
    period.items.some((item) => item.courseId === courseId),
  )
  return sourcePeriod
    ? { type: 'moveCourseToPeriod', courseId, periodId }
    : { type: 'addCourseToPeriod', courseId, periodId }
}

function exportCatalog(snapshot: CurriculumPlannerSnapshot) {
  const periods = orderedPeriods(snapshot.plan)
  const payload = {
    format: 'pomi-curriculum-planner',
    version: 2,
    exportedAt: new Date().toISOString(),
    data: {
      selection: snapshot.selection,
      planningStart: snapshot.plan.planningStart,
      periods: periods.map((period) => ({
        courses: period.items.map((item) => item.courseId),
      })),
      completedCourses: snapshot.academicRecord.completedCourses.map(
        (completed) => completed.courseId,
      ),
    } satisfies CurriculumPlannerImport,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'catalogo-planejamento.json'
  link.click()
  URL.revokeObjectURL(url)
}

function isStringArray(value: unknown): value is ReadonlyArray<string> {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function importedPlanning(value: unknown): CurriculumPlannerImport | undefined {
  if (
    !value ||
    typeof value !== 'object' ||
    !('format' in value) ||
    !('version' in value) ||
    !('data' in value) ||
    value.format !== 'pomi-curriculum-planner' ||
    value.version !== 2 ||
    !value.data ||
    typeof value.data !== 'object'
  )
    return undefined
  const data = value.data as Record<string, unknown>
  if (
    !data.selection ||
    typeof data.selection !== 'object' ||
    !Array.isArray(data.periods) ||
    !isStringArray(data.completedCourses) ||
    !data.periods.every((period) => {
      if (!period || typeof period !== 'object') return false
      const data = period as Record<string, unknown>
      return (
        isStringArray(data.courses) &&
        (data.completedCourses === undefined ||
          isStringArray(data.completedCourses))
      )
    })
  )
    return undefined
  return data as CurriculumPlannerImport
}

function CompactVisual({
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
  children: React.ReactNode
  course: Course
  plannedPeriodId?: PlanningPeriodId
  completed: boolean
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dragging?: boolean
  dispatch: Dispatch
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
                      disabled={disabled}
                      onSelect={() =>
                        void dispatch({
                          type: 'addCourseToPeriod',
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
            {!plannedPeriodId && (
              <>
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
              </>
            )}
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

function CompactCourseCard({
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
  dispatch: Dispatch
}) {
  const data: CourseDragData = {
    type: 'course',
    course: state.course,
    completed: state.completed,
    currentPeriodId: state.completed ? undefined : state.plannedPeriodId,
  }
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dragId,
    data,
    disabled,
  })
  const period = periods.find((item) => item.id === state.plannedPeriodId)
  const label = `${state.course.code}, ${state.course.name}, ${state.course.credits} créditos${state.completed ? (period ? `, concluída em ${periodReference(period, periods, planningStart)}` : ', concluída') : period ? `, planejada em ${periodReference(period, periods, planningStart)}` : ', não planejada'}`
  return (
    <CourseDestinationMenu
      course={state.course}
      plannedPeriodId={state.completed ? undefined : state.plannedPeriodId}
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
          'pomi-focus rounded-sm touch-manipulation',
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
}

function CurriculumBlock({
  block,
  groupId,
  periods,
  planningStart,
  disabled,
  dispatch,
}: {
  block: CurriculumBlockView
  groupId: string
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dispatch: Dispatch
}) {
  const visibleCourses = block.courses
  return (
    <section className="rounded-md border-2 border-border bg-background/60 p-3">
      <div className="mb-3">
        <div>
          <h4 className="text-sm font-extrabold">{block.title}</h4>
          {block.requiredCredits !== undefined && (
            <p className="text-xs text-muted-foreground">
              Exigência: {block.requiredCredits} créditos
            </p>
          )}
        </div>
      </div>
      {block.selectorLabels.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">
            Elegíveis:
          </span>
          {block.selectorLabels.map((label) => (
            <span
              key={label}
              className="rounded-sm border-2 border-strong-border bg-muted px-2 py-1 font-mono text-xs font-black"
            >
              {label}
            </span>
          ))}
        </div>
      )}
      {visibleCourses.length ? (
        <div className="flex flex-wrap gap-2">
          {visibleCourses.map((state) => (
            <CompactCourseCard
              key={`${block.id}:${state.course.id}`}
              dragId={`block:${groupId}:${block.id}:course:${state.course.id}`}
              state={state}
              periods={periods}
              planningStart={planningStart}
              disabled={disabled}
              dispatch={dispatch}
            />
          ))}
        </div>
      ) : !block.selectorLabels.length ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma disciplina não concluída neste bloco.
        </p>
      ) : null}
    </section>
  )
}

function CurriculumBlocksPanel({
  staticData,
  snapshot,
  disabled,
  dispatch,
}: {
  staticData: CurriculumPlannerStaticData
  snapshot: CurriculumPlannerSnapshot
  disabled: boolean
  dispatch: Dispatch
}) {
  const [collapsed, setCollapsed] = useState(false)
  const groups = useMemo(
    () => buildCurriculumGroups(staticData, snapshot),
    [snapshot, staticData],
  )
  const periods = useMemo(() => orderedPeriods(snapshot.plan), [snapshot.plan])
  const count = groups.reduce(
    (total, group) =>
      total +
      (group.mandatory?.courses.length ?? 0) +
      group.electives.reduce((sum, block) => sum + block.courses.length, 0),
    0,
  )
  return (
    <Card className="mb-7 overflow-hidden shadow-none">
      <CardHeader className="flex-row items-center justify-between gap-4 p-4">
        <div>
          <CardTitle className="text-lg">Blocos da grade</CardTitle>
          <p className="text-sm text-muted-foreground">
            {count} disciplinas não concluídas
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? <ChevronDown /> : <ChevronUp />}
          {collapsed ? 'Expandir' : 'Recolher'}
        </Button>
      </CardHeader>
      {!collapsed && (
        <CardContent className="border-t-2 border-border p-4">
          <div className="max-h-[30rem] space-y-5 overflow-y-auto pr-1">
            {groups.map((group) => (
              <section key={group.id} aria-labelledby={`group-${group.id}`}>
                <h3
                  id={`group-${group.id}`}
                  className="mb-3 border-b-2 border-primary pb-2 text-sm font-black tracking-[0.08em] uppercase"
                >
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.mandatory && (
                    <CurriculumBlock
                      block={group.mandatory}
                      groupId={group.id}
                      periods={periods}
                      planningStart={snapshot.plan.planningStart}
                      disabled={disabled}
                      dispatch={dispatch}
                    />
                  )}
                  {group.electives.map((block) => (
                    <CurriculumBlock
                      key={block.id}
                      block={block}
                      groupId={group.id}
                      periods={periods}
                      planningStart={snapshot.plan.planningStart}
                      disabled={disabled}
                      dispatch={dispatch}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function PlanningStartDialog({
  year: savedYear,
  semester: savedSemester,
  semesterNumber: savedSemesterNumber,
  disabled,
  dispatch,
}: {
  year?: number
  semester?: 1 | 2
  semesterNumber?: number
  disabled: boolean
  dispatch: Dispatch
}) {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(savedYear ?? new Date().getFullYear())
  const [semester, setSemester] = useState(String(savedSemester ?? 1))
  const [semesterNumber, setSemesterNumber] = useState(savedSemesterNumber ?? 1)
  const submit = async () => {
    const succeeded = await dispatch({
      type: 'setPlanningStart',
      year,
      semester: Number(semester) as 1 | 2,
      semesterNumber,
    })
    if (succeeded) setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {savedYear && savedSemester
          ? `Início: ${savedSemesterNumber ?? 1}º sem - ${savedSemester}s${savedYear}`
          : 'Definir início'}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Início do planejamento</DialogTitle>
          <DialogDescription>
            Defina o semestre curricular, o período e o ano do primeiro semestre
            que você vai planejar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <label className="col-span-2 space-y-2 text-sm font-bold lg:col-span-1">
            <span>Número do semestre</span>
            <Input
              type="number"
              min={1}
              value={semesterNumber}
              onChange={(event) =>
                setSemesterNumber(Number(event.target.value))
              }
            />
          </label>
          <label className="space-y-2 text-sm font-bold">
            <span>Ano</span>
            <Input
              type="number"
              min={1900}
              max={9999}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
            />
          </label>
          <label className="space-y-2 text-sm font-bold">
            <span>Semestre</span>
            <AutocompleteSelect
              ariaLabel="Semestre inicial"
              value={semester}
              onValueChange={setSemester}
              options={[
                { value: '1', label: '1º semestre' },
                { value: '2', label: '2º semestre' },
              ]}
              placeholder="Clique ou digite"
            />
          </label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            disabled={
              disabled ||
              !Number.isInteger(year) ||
              year < 1900 ||
              year > 9999 ||
              !Number.isInteger(semesterNumber) ||
              semesterNumber < 1 ||
              (semester !== '1' && semester !== '2')
            }
            onClick={() => void submit()}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddCourseToSemesterDialog({
  courses,
  period,
  periods,
  title,
  disabled,
  dispatch,
}: {
  courses: ReadonlyArray<Course>
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
      <Button
        size="icon"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-label={`Adicionar disciplina a ${title}`}
        title={`Adicionar disciplina a ${title}`}
        className="h-8 w-8 shrink-0 rounded-sm border-2 border-strong-border bg-background p-0 shadow-[2px_2px_0_var(--strong-border)] hover:bg-accent"
      >
        <Plus />
      </Button>
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
          options={courses.map((course) => ({
            value: course.id,
            label: `${course.code} — ${course.name} (${String(course.credits).padStart(2, '0')} créditos)`,
          }))}
          placeholder="Clique ou digite o código ou nome"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            disabled={disabled || !courseId}
            onClick={() => void submit()}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SemesterRow({
  period,
  title,
  periods,
  staticData,
  snapshot,
  disabled,
  dispatch,
}: {
  period: PlanningPeriod
  title: string
  periods: ReadonlyArray<PlanningPeriod>
  staticData: CurriculumPlannerStaticData
  snapshot: CurriculumPlannerSnapshot
  disabled: boolean
  dispatch: Dispatch
}) {
  const [removeOpen, setRemoveOpen] = useState(false)
  const { isOver, setNodeRef } = useDroppable({ id: `period:${period.id}` })
  const plannedCourses = period.items.flatMap((item) => {
    const course = staticData.courses.find(
      (candidate) => candidate.id === item.courseId,
    )
    return course ? [course] : []
  })
  const courseStates = plannedCourses.map((course) => ({
    course,
    completed: false,
  }))
  const courseCredits = courseStates.reduce(
    (total, state) => total + state.course.credits,
    0,
  )
  const current = snapshot.plan.currentPeriodId === period.id
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
              >
                <GripVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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
              {current && (
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
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => setRemoveOpen(true)}
              >
                <Trash2 /> Remover semestre
              </DropdownMenuItem>
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
            courses={staticData.courses}
            period={period}
            periods={periods}
            title={title}
            disabled={disabled}
            dispatch={dispatch}
          />
          {courseStates.length ? (
            <>
              {courseStates.map((state) => (
                <CompactCourseCard
                  key={`planned:${state.course.id}`}
                  dragId={`period:${period.id}:course:${state.course.id}`}
                  state={{
                    course: state.course,
                    plannedPeriodId: period.id,
                    completed: false,
                  }}
                  periods={periods}
                  planningStart={snapshot.plan.planningStart}
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
          <strong className="block text-lg">{courseCredits}</strong>
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
}

function CurriculumSelectionPanel({
  staticData,
  snapshot,
  disabled,
  dispatch,
}: {
  staticData: CurriculumPlannerStaticData
  snapshot: CurriculumPlannerSnapshot
  disabled: boolean
  dispatch: Dispatch
}) {
  const selected = staticData.catalogPrograms.find(
    (program) => program.id === snapshot.selection.catalogProgramId,
  )
  const [catalogId, setCatalogId] = useState(selected?.catalog.id ?? '')
  useEffect(() => {
    setCatalogId(selected?.catalog.id ?? '')
  }, [selected?.catalog.id])
  const catalogs = [
    ...new Map(
      staticData.catalogPrograms.map((program) => [
        program.catalog.id,
        {
          value: program.catalog.id,
          label: `Catálogo ${program.catalog.year}`,
        },
      ]),
    ).values(),
  ].sort((left, right) => left.label.localeCompare(right.label))
  const programs = staticData.catalogPrograms
    .filter((program) => program.catalog.id === catalogId)
    .sort((left, right) => left.program.name.localeCompare(right.program.name))
  return (
    <Card className="mb-7 shadow-none">
      <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 text-sm font-bold">
          <span>Catálogo</span>
          <AutocompleteSelect
            ariaLabel="Catálogo"
            value={catalogId}
            disabled={disabled}
            emptyLabel="Sem catálogo"
            options={catalogs}
            placeholder="Digite o ano do catálogo"
            onValueChange={(value) => {
              setCatalogId(value)
              if (!value || selected?.catalog.id !== value) {
                void dispatch({
                  type: 'selectCatalogProgram',
                  catalogProgramId: null,
                })
              }
            }}
          />
        </label>
        <label className="space-y-2 text-sm font-bold">
          <span>Programa</span>
          <AutocompleteSelect
            ariaLabel="Programa"
            value={snapshot.selection.catalogProgramId ?? ''}
            disabled={disabled || !catalogId}
            emptyLabel="Sem programa"
            options={programs.map((program) => ({
              value: program.id,
              label: `${program.program.code} — ${program.program.name}`,
            }))}
            placeholder={
              catalogId ? 'Digite o programa' : 'Escolha um catálogo primeiro'
            }
            onValueChange={(value) =>
              void dispatch({
                type: 'selectCatalogProgram',
                catalogProgramId: value ? (value as never) : null,
              })
            }
          />
        </label>
        <label className="space-y-2 text-sm font-bold">
          <span>Habilitação</span>
          <AutocompleteSelect
            ariaLabel="Habilitação"
            value={snapshot.selection.specializationId ?? ''}
            disabled={disabled || !selected}
            emptyLabel="Sem habilitação"
            options={
              selected?.specializations.map((option) => ({
                value: option.id,
                label: option.name,
              })) ?? []
            }
            placeholder="Digite a habilitação"
            onValueChange={(value) =>
              void dispatch({
                type: 'selectSpecialization',
                specializationId: value ? (value as never) : null,
              })
            }
          />
        </label>
        <label className="space-y-2 text-sm font-bold">
          <span>Língua</span>
          <AutocompleteSelect
            ariaLabel="Língua"
            value={snapshot.selection.languageId ?? ''}
            disabled={disabled || !selected}
            emptyLabel="Sem língua adicional"
            options={
              selected?.languages.map((option) => ({
                value: option.id,
                label: option.name,
              })) ?? []
            }
            placeholder="Digite a língua"
            onValueChange={(value) =>
              void dispatch({
                type: 'selectLanguage',
                languageId: value ? (value as never) : null,
              })
            }
          />
        </label>
      </CardContent>
    </Card>
  )
}

function AddCompletedCourseDialog({
  courses,
  disabled,
  dispatch,
}: {
  courses: ReadonlyArray<Course>
  disabled: boolean
  dispatch: Dispatch
}) {
  const [open, setOpen] = useState(false)
  const [courseId, setCourseId] = useState('')
  const submit = async () => {
    if (!courseId) return
    const succeeded = await dispatch({
      type: 'markCourseCompleted',
      courseId: courseId as Course['id'],
    })
    if (succeeded) {
      setCourseId('')
      setOpen(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        size="icon"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-label="Adicionar disciplina concluída"
        title="Adicionar disciplina concluída"
        className="h-8 w-8 shrink-0 rounded-sm border-2 border-strong-border bg-background p-0 shadow-[2px_2px_0_var(--strong-border)] hover:bg-accent"
      >
        <Plus />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar disciplina concluída</DialogTitle>
          <DialogDescription>
            Escolha uma disciplina já cumprida.
          </DialogDescription>
        </DialogHeader>
        <AutocompleteSelect
          ariaLabel="Disciplina concluída"
          value={courseId}
          onValueChange={setCourseId}
          options={courses.map((course) => ({
            value: course.id,
            label: `${course.code} — ${course.name} (${String(course.credits).padStart(2, '0')} créditos)`,
          }))}
          placeholder="Clique ou digite o código ou nome"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            disabled={disabled || !courseId}
            onClick={() => void submit()}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CompletedCoursesPanel({
  staticData,
  snapshot,
  disabled,
  dispatch,
}: {
  staticData: CurriculumPlannerStaticData
  snapshot: CurriculumPlannerSnapshot
  disabled: boolean
  dispatch: Dispatch
}) {
  const { isOver, setNodeRef } = useDroppable({ id: 'completed' })
  const completed = new Set(
    snapshot.academicRecord.completedCourses.map((course) => course.courseId),
  )
  const courses = staticData.courses.filter((course) =>
    completed.has(course.id),
  )
  const periods = orderedPeriods(snapshot.plan)
  const credits = courses.reduce((total, course) => total + course.credits, 0)
  return (
    <article className="grid overflow-hidden rounded-md border-2 border-strong-border bg-card shadow-[4px_4px_0_color-mix(in_srgb,var(--primary)_25%,transparent)] lg:grid-cols-[11rem_1fr_7rem]">
      <header className="flex items-center border-b-2 border-border bg-primary/10 p-2 lg:border-r-2 lg:border-b-0">
        <div>
          <h3 className="whitespace-nowrap text-sm font-black">Concluídas</h3>
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
          <AddCompletedCourseDialog
            courses={staticData.courses}
            disabled={disabled}
            dispatch={dispatch}
          />
          {courses.map((course) => (
            <CompactCourseCard
              key={course.id}
              dragId={`completed:course:${course.id}`}
              state={{ course, completed: true }}
              periods={periods}
              planningStart={snapshot.plan.planningStart}
              disabled={disabled}
              dispatch={dispatch}
            />
          ))}
          {!courses.length && (
            <p className="min-h-8 content-center text-sm font-semibold text-muted-foreground">
              Adicione as disciplinas que você já concluiu.
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
}

export function CurriculumPlannerPage() {
  const planner = useCurriculumPlanner()
  const [activeDrag, setActiveDrag] = useState<PlannerDragData>()
  const [importError, setImportError] = useState<string>()
  const importInputRef = useRef<HTMLInputElement>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 8 },
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
  const periods = orderedPeriods(snapshot.plan)
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDrag(event.active.data.current as PlannerDragData | undefined)
  }
  const handleDragEnd = (event: DragEndEvent) => {
    const data = event.active.data.current as PlannerDragData | undefined
    const overId = String(event.over?.id ?? '')
    setActiveDrag(undefined)
    if (!data) return
    if (overId === 'completed') {
      if (data.completed) return
      void planner.dispatch({
        type: 'markCourseCompleted',
        courseId: data.course.id,
      })
      return
    }
    if (!overId.startsWith('period:')) return
    const periodId = overId.slice('period:'.length) as PlanningPeriodId
    if (data.completed) {
      void planner.dispatch({
        type: 'addCourseToPeriod',
        courseId: data.course.id,
        periodId,
      })
      return
    }
    if (data.currentPeriodId === periodId) return
    void planner.dispatch(
      data.currentPeriodId
        ? { type: 'moveCourseToPeriod', courseId: data.course.id, periodId }
        : { type: 'addCourseToPeriod', courseId: data.course.id, periodId },
    )
  }
  const addSemester = () =>
    void planner.dispatch({
      type: 'addPlanningPeriod',
      position: { type: 'end' },
    })
  const importPlanning = async (file?: File) => {
    if (!file) return
    try {
      const data = importedPlanning(JSON.parse(await file.text()))
      if (!data) throw new Error('invalid')
      const succeeded = await planner.dispatch({ type: 'importPlanning', data })
      setImportError(
        succeeded ? undefined : 'O arquivo não é compatível com este catálogo.',
      )
    } catch {
      setImportError('Não foi possível ler o arquivo de planejamento.')
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
            <Button variant="outline" onClick={() => exportCatalog(snapshot)}>
              <Download /> Exportar catálogo
            </Button>
            <Button
              variant="outline"
              onClick={() => importInputRef.current?.click()}
            >
              <Upload /> Importar catálogo
            </Button>
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
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}
      {planner.error && (
        <Alert variant="destructive" className="mb-6" aria-live="polite">
          <RotateCcw />
          <AlertTitle>Não foi possível concluir a ação</AlertTitle>
          <AlertDescription>{errorText(planner.error.code)}</AlertDescription>
        </Alert>
      )}
      <DndContext
        sensors={sensors}
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
              <Button onClick={addSemester} disabled={planner.isDispatching}>
                <Plus /> Adicionar semestre
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <CompletedCoursesPanel
              staticData={staticData}
              snapshot={snapshot}
              disabled={planner.isDispatching}
              dispatch={planner.dispatch}
            />
            {periods.length ? (
              periods.map((period, index) => (
                <SemesterRow
                  key={period.id}
                  period={period}
                  title={periodTitle(index, snapshot.plan.planningStart)}
                  periods={periods}
                  staticData={staticData}
                  snapshot={snapshot}
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
        <CurriculumSelectionPanel
          staticData={staticData}
          snapshot={snapshot}
          disabled={planner.isDispatching}
          dispatch={planner.dispatch}
        />
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
