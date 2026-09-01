import { useQuery } from '@tanstack/react-query'
import {
  CircleCheck,
  ExternalLink,
  MessageSquareWarning,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { periodReference } from '@pomi/planner-domain/curriculum'

import type {
  Course,
  CourseId,
  CoursePrerequisiteEvaluation,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import type { PlannerDispatch } from '@/planner/types'
import type { CoursePrerequisiteMenuState } from './CourseCard'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { getCatalogCourseDetails } from '@/planner/data/courseDetailsApi'
import { useFeedbackReport } from '@/feedback/FeedbackReportProvider'
import { listStudyPeriods } from '@/student/data/studentApi'
import { studyPeriodLabel } from '@/student/data/studyPeriod'
import { mostRecentStudyPeriodsFirst } from '@/student/data/studyPeriodOrdering'

const outsideValue = '__outside__'
const unallocatedValue = '__unallocated__'

function useDesktopLayout() {
  const [desktop, setDesktop] = useState(
    () => window.matchMedia('(min-width: 640px)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)')
    const update = () => setDesktop(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return desktop
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

function plannedStudyPeriodReference(
  plannedPeriodId: PlanningPeriodId | undefined,
  periods: ReadonlyArray<PlanningPeriod>,
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart'],
) {
  if (!plannedPeriodId || !planningStart) return undefined
  const periodIndex = periods.findIndex(
    (period) => period.id === plannedPeriodId,
  )
  if (periodIndex < 0) return undefined
  const semesterOffset = planningStart.semester - 1 + periodIndex
  return {
    year: planningStart.year + Math.floor(semesterOffset / 2),
    yearPeriod: semesterOffset % 2 === 0 ? 'FIRST_SEMESTER' : 'SECOND_SEMESTER',
  } as const
}

function PrerequisiteSection({
  course,
  prerequisites,
}: {
  course: Course
  prerequisites?: CoursePrerequisiteMenuState
}) {
  if (!prerequisites) return null
  const evaluation = prerequisites.evaluation
  const selected = evaluation?.alternatives.find(
    (alternative) => alternative.key === evaluation.selectedAlternativeKey,
  )
  return (
    <section className="space-y-3 border-t-2 border-border pt-4">
      <h3 className="font-extrabold">
        Pré-requisitos - catálogo {prerequisites.year}
      </h3>
      {prerequisites.status === 'loading' && (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      )}
      {prerequisites.status === 'error' && (
        <p className="text-sm text-destructive">
          Pré-requisitos indisponíveis para {prerequisites.year}.
        </p>
      )}
      {prerequisites.status === 'notInCatalog' && (
        <p className="text-sm text-muted-foreground">
          {course.code} não está disponível no catálogo de {prerequisites.year}.
        </p>
      )}
      {prerequisites.status === 'ready' && !evaluation && (
        <p className="text-sm text-muted-foreground">
          Sem pré-requisitos no catálogo de {prerequisites.year}.
        </p>
      )}
      {selected && (
        <ul className="space-y-2">
          {selected.items.map((item) => (
            <li
              key={`${selected.key}:${prerequisiteItemLabel(item)}`}
              className="flex items-center justify-between gap-4 rounded-sm bg-muted/60 px-3 py-2 text-sm"
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
        <label className="block space-y-2 text-sm font-bold">
          <span>Alternativa considerada</span>
          <AutocompleteSelect
            ariaLabel={`Alternativa de pré-requisito de ${course.code}`}
            value={prerequisites.preferredAlternativeKey ?? '__automatic__'}
            onValueChange={(value) =>
              prerequisites.onAlternativeChange(
                course.id,
                value === '__automatic__' ? undefined : value,
              )
            }
            options={[
              { value: '__automatic__', label: 'Automática' },
              ...evaluation.alternatives.map((alternative) => ({
                value: alternative.key,
                label: alternativeLabel(alternative),
              })),
            ]}
          />
        </label>
      )}
    </section>
  )
}

function DetailsSection({
  courseId,
  catalogYear,
}: {
  courseId: CourseId
  catalogYear: number
}) {
  const { openFeedback } = useFeedbackReport()
  const query = useQuery({
    queryKey: ['curriculum-planner', 'course-details', courseId, catalogYear],
    queryFn: () => getCatalogCourseDetails(Number(courseId), catalogYear),
    staleTime: Infinity,
  })

  if (query.isLoading)
    return (
      <p className="text-sm text-muted-foreground">Carregando informações...</p>
    )
  if (query.isError)
    return (
      <p className="text-sm text-destructive">
        Não foi possível carregar as informações desta disciplina.
      </p>
    )
  const details = query.data
  if (!details)
    return (
      <p className="text-sm text-muted-foreground">
        Esta disciplina não está disponível no catálogo de {catalogYear}.
      </p>
    )

  const offeringLabels = {
    ALL_PERIODS: 'Todos os períodos',
    ODD_PERIODS: 'Semestres ímpares',
    EVEN_PERIODS: 'Semestres pares',
    UNIT_DISCRETION: 'A critério da unidade',
  } as const
  const workload = [
    ['Teóricas', details.workload.theoreticalHours],
    ['Práticas', details.workload.practicalHours],
    ['Laboratório', details.workload.laboratoryHours],
    ['A distância', details.workload.distanceHours],
    ['Sala de aula', details.workload.classroomHours],
  ].filter((item): item is [string, number] => item[1] !== null)

  return (
    <section className="space-y-4 border-t-2 border-border pt-4">
      <h3 className="font-extrabold">Informações do catálogo</h3>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        {details.offeringPeriod && (
          <div>
            <dt className="font-bold">Oferecimento</dt>
            <dd className="text-muted-foreground">
              {offeringLabels[details.offeringPeriod]}
            </dd>
          </div>
        )}
        {details.evaluation && (
          <div>
            <dt className="font-bold">Avaliação</dt>
            <dd className="text-muted-foreground">{details.evaluation}</dd>
          </div>
        )}
        {details.minimumAttendancePercent !== null && (
          <div>
            <dt className="font-bold">Frequência mínima</dt>
            <dd className="text-muted-foreground">
              {details.minimumAttendancePercent}%
            </dd>
          </div>
        )}
        {details.coordinator && (
          <div>
            <dt className="font-bold">Coordenador</dt>
            <dd className="text-muted-foreground">
              {details.coordinator.name}
            </dd>
          </div>
        )}
      </dl>
      {workload.length > 0 && (
        <div>
          <h4 className="text-sm font-bold">Carga horária</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {workload
              .map(([label, hours]) => `${label}: ${hours}h`)
              .join(' · ')}
          </p>
        </div>
      )}
      {details.syllabus && (
        <details className="rounded-sm border-2 border-border p-3">
          <summary className="cursor-pointer font-bold">Ementa</summary>
          <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
            {details.syllabus}
          </p>
        </details>
      )}
      {details.bibliography && (
        <details className="rounded-sm border-2 border-border p-3">
          <summary className="cursor-pointer font-bold">Bibliografia</summary>
          <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
            {details.bibliography}
          </p>
        </details>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
        {details.sourceUrl && (
          <a
            className="inline-flex items-center gap-1 text-sm font-bold text-primary underline"
            href={details.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ver no catálogo <ExternalLink className="size-4" />
          </a>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-0 py-1 text-muted-foreground hover:bg-transparent hover:text-foreground"
          onClick={() =>
            openFeedback({
              kind: 'DATA_ISSUE',
              target: {
                type: 'ACADEMIC_RESOURCE',
                academicResourceType: 'CATALOG_COURSE',
                academicResourceId: details.id,
              },
              title: `Informação de ${details.code}`,
            })
          }
        >
          <MessageSquareWarning className="size-4" /> Corrigir informação
        </Button>
      </div>
    </section>
  )
}

function CourseDetailsBody({
  course,
  plannedPeriodId,
  unallocated,
  completed,
  periods,
  planningStart,
  disabled,
  dispatch,
  prerequisites,
  catalogYear,
  onRemoved,
}: CourseDetailsDialogProps & { course: Course }) {
  const [completionOpen, setCompletionOpen] = useState(false)
  const [completedStudyPeriodId, setCompletedStudyPeriodId] = useState('')
  const [completedGrade, setCompletedGrade] = useState('')
  const [gradeError, setGradeError] = useState('')
  const studyPeriodsQuery = useQuery({
    queryKey: ['curriculum-planner', 'study-periods'],
    queryFn: listStudyPeriods,
    staleTime: Infinity,
    enabled: completionOpen,
  })
  useEffect(() => {
    setCompletionOpen(false)
    setCompletedStudyPeriodId('')
    setCompletedGrade('')
    setGradeError('')
  }, [course.id])
  const plannedStudyPeriod = plannedStudyPeriodReference(
    plannedPeriodId,
    periods,
    planningStart,
  )
  useEffect(() => {
    if (!completionOpen || completedStudyPeriodId || !plannedStudyPeriod) return
    const matchingPeriod = studyPeriodsQuery.data?.find(
      (period) =>
        period.year === plannedStudyPeriod.year &&
        period.yearPeriod === plannedStudyPeriod.yearPeriod,
    )
    if (matchingPeriod) setCompletedStudyPeriodId(String(matchingPeriod.id))
  }, [
    completedStudyPeriodId,
    completionOpen,
    plannedStudyPeriod,
    studyPeriodsQuery.data,
  ])
  const planned = Boolean(plannedPeriodId || unallocated)
  const locationValue = plannedPeriodId
    ? String(plannedPeriodId)
    : unallocated
      ? unallocatedValue
      : outsideValue
  const locationOptions = [
    { value: outsideValue, label: 'Fora do planejamento' },
    { value: unallocatedValue, label: 'Não alocadas' },
    ...periods.map((period) => ({
      value: String(period.id),
      label: periodReference(period, periods, planningStart),
    })),
  ]
  const changeLocation = async (value: string) => {
    if (value === locationValue) return
    if (value === outsideValue) {
      const succeeded = await dispatch({
        type: 'removeCourseFromPlan',
        courseId: course.id,
      })
      if (succeeded) onRemoved()
      return
    }
    if (value === unallocatedValue) {
      await dispatch({
        type: plannedPeriodId
          ? 'moveCourseToUnallocated'
          : 'addCourseToUnallocated',
        courseId: course.id,
      })
      return
    }
    await dispatch({
      type: plannedPeriodId ? 'moveCourseToPeriod' : 'addCourseToPeriod',
      courseId: course.id,
      periodId: value as PlanningPeriodId,
    })
  }
  const complete = async () => {
    const grade = completedGrade.trim() === '' ? null : Number(completedGrade)
    if (
      grade !== null &&
      (!Number.isFinite(grade) || grade < 0 || grade > 10)
    ) {
      setGradeError('Informe uma nota entre 0 e 10.')
      return
    }
    const succeeded = await dispatch({
      type: 'markCourseCompleted',
      courseId: course.id,
      studyPeriodId: completedStudyPeriodId
        ? Number(completedStudyPeriodId)
        : undefined,
      grade,
    })
    if (succeeded) setCompletionOpen(false)
  }
  const openCompletion = () => {
    setCompletedStudyPeriodId('')
    setCompletedGrade('')
    setGradeError('')
    setCompletionOpen(true)
  }
  const studyPeriodOptions = mostRecentStudyPeriodsFirst(
    studyPeriodsQuery.data ?? [],
  ).map((period) => ({
    value: String(period.id),
    label: studyPeriodLabel(period),
  }))

  return (
    <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
      <section className="space-y-3">
        <h3 className="font-extrabold">No planejamento</h3>
        <AutocompleteSelect
          ariaLabel={`Local de ${course.code} no planejamento`}
          value={locationValue}
          onValueChange={(value) => void changeLocation(value)}
          options={locationOptions}
          disabled={disabled}
        />
        {!periods.length && !planned && (
          <p className="text-sm text-muted-foreground">
            Adicione um semestre para planejar esta disciplina.
          </p>
        )}
      </section>
      <section className="space-y-3 border-t-2 border-border pt-4">
        <h3 className="font-extrabold">Conclusão</h3>
        {completed ? (
          <div className="flex items-center justify-between gap-3 rounded-sm bg-muted/60 p-3">
            <span className="flex items-center gap-2 text-sm font-bold">
              <CircleCheck className="size-4" /> Marcada como concluída
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() =>
                void dispatch({
                  type: 'unmarkCourseCompleted',
                  courseId: course.id,
                })
              }
            >
              Desmarcar
            </Button>
          </div>
        ) : completionOpen ? (
          <div className="space-y-3 rounded-sm border-2 border-border p-3">
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
                    ? 'Carregando períodos...'
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
                onChange={(event) => {
                  setCompletedGrade(event.target.value)
                  setGradeError('')
                }}
              />
            </label>
            {gradeError && (
              <p
                className="text-sm font-semibold text-destructive"
                role="alert"
              >
                {gradeError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCompletionOpen(false)}
              >
                Cancelar
              </Button>
              <Button disabled={disabled} onClick={() => void complete()}>
                Confirmar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            disabled={disabled}
            onClick={openCompletion}
          >
            <CircleCheck /> Marcar como concluída
          </Button>
        )}
      </section>
      <PrerequisiteSection course={course} prerequisites={prerequisites} />
      <DetailsSection courseId={course.id} catalogYear={catalogYear} />
      {planned && (
        <section className="border-t-2 border-border pt-4">
          <Button
            variant="outline"
            className="text-destructive"
            disabled={disabled}
            onClick={() => void changeLocation(outsideValue)}
          >
            <Trash2 /> Remover do planejamento
          </Button>
        </section>
      )}
    </div>
  )
}

export type CourseDetailsDialogProps = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: Course
  plannedPeriodId?: PlanningPeriodId
  unallocated: boolean
  completed: boolean
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dispatch: PlannerDispatch
  prerequisites?: CoursePrerequisiteMenuState
  catalogYear: number
  onRemoved: () => void
}>

export function CourseDetailsDialog(props: CourseDetailsDialogProps) {
  const desktop = useDesktopLayout()
  if (!props.course) return null
  const title = `${props.course.code} - ${props.course.name}`
  const body = <CourseDetailsBody {...props} course={props.course} />

  if (desktop)
    return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogContent
          className="flex max-h-[88dvh] max-w-2xl flex-col overflow-hidden p-0"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader className="mb-0 border-b-2 border-strong-border p-5 pr-12">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {props.course.credits} créditos
            </DialogDescription>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    )

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[88dvh] rounded-t-xl bg-background text-foreground"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="border-b-2 border-strong-border pr-12">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{props.course.credits} créditos</SheetDescription>
        </SheetHeader>
        {body}
      </SheetContent>
    </Sheet>
  )
}
