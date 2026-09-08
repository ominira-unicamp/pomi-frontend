import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  CircleCheck,
  ExternalLink,
  MessageSquareWarning,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import type {
  Course,
  CoursePrerequisiteEvaluation,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import type { CoursePrerequisiteMenuState } from '@/features/curriculum-planner/components/CourseCard'
import type { CurriculumPlannerContextValue } from '@/features/curriculum-planner/CurriculumPlannerProvider'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Badge } from '@/components/patterns/Badge'
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
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  CatalogCourseAcademicCard,
  CatalogCoursePrerequisites,
  CatalogCourseSelector,
  CatalogCourseSyllabus,
  selectCatalog,
} from '@/features/course-catalog/CatalogCourseDetails'
import { listCatalogCourses } from '@/features/course-catalog/data/courseCatalogApi'
import { useFeedbackReport } from '@/features/feedback/FeedbackReportProvider'
import { labelForStatus } from '@/features/course-situation/model/model'
import {
  isApprovedStudentCourseAttempt,
  listStudyPeriods,
} from '@/features/student/data/studentApi'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'
import { mostRecentStudyPeriodsFirst } from '@/features/student/data/studyPeriodOrdering'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const outsideValue = '__outside__'
const unallocatedValue = '__unallocated__'

type CourseDetailsTab = 'planning' | 'academic' | 'history'

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

function PrerequisitePlanningSection({
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
    <section className="space-y-3 rounded-sm border-2 border-border p-4">
      <div>
        <h3 className="font-extrabold">Situação no planejamento</h3>
        <p className="text-sm text-muted-foreground">
          Avaliação dos pré-requisitos do catálogo {prerequisites.year} dentro
          deste currículo.
        </p>
      </div>
      {prerequisites.status === 'loading' && (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      )}
      {prerequisites.status === 'error' && (
        <p className="text-sm text-destructive">
          Não foi possível avaliar os pré-requisitos deste planejamento.
        </p>
      )}
      {prerequisites.status === 'notInCatalog' && (
        <p className="text-sm text-muted-foreground">
          {course.code} não está disponível no catálogo de {prerequisites.year}.
        </p>
      )}
      {prerequisites.status === 'ready' && !evaluation && (
        <p className="text-sm text-muted-foreground">
          Esta disciplina não possui pré-requisitos no catálogo de{' '}
          {prerequisites.year}.
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
                className={
                  ['samePeriod', 'plannedAfter', 'missing'].includes(
                    item.status,
                  )
                    ? 'text-right font-semibold text-destructive'
                    : 'text-right font-semibold text-muted-foreground'
                }
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

function PlanningSection({
  course,
  plannedPeriodId,
  unallocated,
  completed,
  attempts,
  periods,
  planningStart,
  disabled,
  dispatch,
  prerequisites,
  onRemoved,
}: CourseDetailsDialogProps & { course: Course }) {
  const [completionOpen, setCompletionOpen] = useState(false)
  const [completedStudyPeriodId, setCompletedStudyPeriodId] = useState('')
  const [completedGrade, setCompletedGrade] = useState('')
  const [gradeError, setGradeError] = useState('')
  const studyPeriodsQuery = useQuery({
    queryKey: publicQueryKeys.studyPeriods(),
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
    { value: unallocatedValue, label: 'Não alocada' },
    ...periods.map((period) => ({
      value: String(period.id),
      label: periodReference(period, periods, planningStart),
    })),
  ]
  const approvedAttempt = attempts.find((attempt) =>
    isApprovedStudentCourseAttempt(attempt),
  )
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
    <div className="space-y-5">
      <section className="space-y-3 rounded-sm border-2 border-border p-4">
        <div>
          <h3 className="font-extrabold">Local no planejamento</h3>
          <p className="text-sm text-muted-foreground">
            Altere o semestre sem modificar o histórico acadêmico.
          </p>
        </div>
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
      <section className="space-y-3 rounded-sm border-2 border-border p-4">
        <div>
          <h3 className="font-extrabold">Conclusão</h3>
          <p className="text-sm text-muted-foreground">
            A conclusão é registrada no histórico do aluno.
          </p>
        </div>
        {approvedAttempt ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm bg-muted/60 p-3">
            <span className="flex items-center gap-2 text-sm font-bold">
              <CircleCheck className="size-4" />
              Concluída
              {approvedAttempt.studyPeriod &&
                ` em ${studyPeriodLabel(approvedAttempt.studyPeriod)}`}
              {approvedAttempt.grade !== null &&
                ` · Nota ${approvedAttempt.grade}`}
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
        ) : completed ? (
          <div className="rounded-sm bg-muted/60 p-3 text-sm font-bold">
            <CircleCheck className="mr-2 inline size-4" /> Concluída
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
              <p className="text-sm font-semibold text-destructive" role="alert">
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
      <PrerequisitePlanningSection
        course={course}
        prerequisites={prerequisites}
      />
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

function AcademicSection({
  course,
  catalogYear,
}: {
  course: Course
  catalogYear: number
}) {
  const { openFeedback } = useFeedbackReport()
  const [selectedYear, setSelectedYear] = useState(catalogYear)
  const catalogQuery = useQuery({
    queryKey: ['public', 'course-catalog', 'catalogs', course.id],
    queryFn: () => listCatalogCourses(Number(course.id)),
    staleTime: Infinity,
  })
  const catalogs = catalogQuery.data ?? []
  const selectedCatalog = selectCatalog(catalogs, selectedYear)

  useEffect(() => {
    setSelectedYear(catalogYear)
  }, [catalogYear, course.id])

  useEffect(() => {
    if (selectedCatalog && selectedYear !== selectedCatalog.catalogYear) {
      setSelectedYear(selectedCatalog.catalogYear)
    }
  }, [selectedCatalog, selectedYear])

  if (catalogQuery.isLoading)
    return <p className="text-sm text-muted-foreground">Carregando catálogo...</p>
  if (catalogQuery.isError)
    return (
      <p className="text-sm text-destructive">
        Não foi possível carregar os dados acadêmicos desta disciplina.
      </p>
    )
  if (!selectedCatalog)
    return (
      <p className="text-sm text-muted-foreground">
        Esta disciplina não está disponível em um catálogo consultável.
      </p>
    )

  return (
    <div className="space-y-5">
      <CatalogCourseSelector
        courses={catalogs}
        selected={selectedCatalog}
        loading={false}
        onChange={setSelectedYear}
      />
      {selectedCatalog.syllabus && (
        <CatalogCourseSyllabus text={selectedCatalog.syllabus} />
      )}
      <CatalogCoursePrerequisites course={course} catalog={selectedCatalog} />
      <CatalogCourseAcademicCard course={selectedCatalog} />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
        {selectedCatalog.sourceUrl && (
          <a
            className="inline-flex items-center gap-1 text-sm font-bold text-primary underline"
            href={selectedCatalog.sourceUrl}
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
                academicResourceId: selectedCatalog.id,
              },
              title: `Informação de ${selectedCatalog.code}`,
            })
          }
        >
          <MessageSquareWarning className="size-4" /> Reportar dado incorreto
        </Button>
      </div>
    </div>
  )
}

function HistorySection({
  course,
  attempts,
  loading,
}: {
  course: Course
  attempts: ReadonlyArray<StudentCourseAttempt>
  loading: boolean
}) {
  if (loading)
    return <p className="text-sm text-muted-foreground">Carregando histórico...</p>
  if (attempts.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma tentativa registrada para esta disciplina.
      </p>
    )
  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-extrabold">Tentativas de {course.code}</h3>
        <p className="text-sm text-muted-foreground">
          O histórico preserva tentativas de aprovação, reprovação e matrícula.
        </p>
      </div>
      <div className="space-y-3">
        {attempts.map((attempt) => (
          <div
            key={attempt.id}
            className="rounded-sm border-2 border-border p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold">
                {attempt.studyPeriod
                  ? studyPeriodLabel(attempt.studyPeriod)
                  : 'Período não informado'}
              </span>
              <Badge
                variant={
                  isApprovedStudentCourseAttempt(attempt)
                    ? 'success'
                    : attempt.status === 'ENROLLED'
                      ? 'warning'
                      : 'destructive'
                }
              >
                {labelForStatus(attempt.status)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {attempt.grade !== null ? `Nota ${attempt.grade}` : 'Sem nota'}
              {attempt.class ? ` · Turma ${attempt.class.code}` : ''}
              {attempt.class?.professors.length
                ? ` · ${attempt.class.professors.map((professor) => professor.name).join(', ')}`
                : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CourseDetailsBody({
  course,
  activeTab,
  setActiveTab,
  ...props
}: CourseDetailsDialogProps & {
  course: Course
  activeTab: CourseDetailsTab
  setActiveTab: (tab: CourseDetailsTab) => void
}) {
  const attempts = props.attempts.filter(
    (attempt) => String(attempt.courseId) === String(course.id),
  )
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-3 border-b-2 border-border px-5 sm:px-6">
        {(
          [
            ['planning', 'Planejamento'],
            ['academic', 'Acadêmico'],
            ['history', 'Histórico'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={activeTab === value}
            className={`pomi-focus border-b-2 py-3 text-sm font-bold ${activeTab === value ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
            onClick={() => setActiveTab(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
        {activeTab === 'planning' && <PlanningSection {...props} course={course} />}
        {activeTab === 'academic' && (
          <AcademicSection course={course} catalogYear={props.catalogYear} />
        )}
        {activeTab === 'history' && (
          <HistorySection
            course={course}
            attempts={attempts}
            loading={props.attemptsLoading}
          />
        )}
      </div>
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
  attempts: ReadonlyArray<StudentCourseAttempt>
  attemptsLoading: boolean
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  dispatch: CurriculumPlannerContextValue['dispatch']
  prerequisites?: CoursePrerequisiteMenuState
  catalogYear: number
  onRemoved: () => void
}>

export function CourseDetailsDialog(props: CourseDetailsDialogProps) {
  const desktop = useDesktopLayout()
  const [activeTab, setActiveTab] = useState<CourseDetailsTab>('planning')
  useEffect(() => {
    if (props.course) setActiveTab('planning')
  }, [props.course?.id])
  if (!props.course) return null
  const title = `${props.course.code} — ${props.course.name}`
  const description = `${props.course.credits} créditos`
  const body = (
    <CourseDetailsBody
      {...props}
      course={props.course}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  )

  if (desktop)
    return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogContent
          className="flex max-h-[90dvh] max-w-3xl flex-col overflow-hidden p-0"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader className="mb-0 border-b-2 border-strong-border p-5 pr-12">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <Link
              to="/disciplinas/$courseId"
              params={{ courseId: String(props.course.id) }}
              search={{}}
              className="w-fit text-sm font-bold text-primary underline"
            >
              Ver disciplina completa
            </Link>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    )

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[90dvh] flex-col rounded-t-xl bg-background text-foreground"
        closeButtonClassName="text-foreground hover:bg-accent"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="border-b-2 border-strong-border pr-12">
          <SheetTitle>{title}</SheetTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Link
            to="/disciplinas/$courseId"
            params={{ courseId: String(props.course.id) }}
            search={{}}
            className="w-fit text-sm font-bold text-primary underline"
          >
            Ver disciplina completa
          </Link>
        </SheetHeader>
        {body}
      </SheetContent>
    </Sheet>
  )
}

function periodReference(
  period: PlanningPeriod,
  periods: ReadonlyArray<PlanningPeriod>,
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart'],
) {
  if (!planningStart) return `Semestre ${periods.indexOf(period) + 1}`
  const index = periods.findIndex((candidate) => candidate.id === period.id)
  const offset = planningStart.semester - 1 + index
  const year = planningStart.year + Math.floor(offset / 2)
  const semester = offset % 2 === 0 ? 1 : 2
  return `${year}/${semester}`
}
