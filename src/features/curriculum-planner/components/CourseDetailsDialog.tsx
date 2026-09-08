import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
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
  CoursePrerequisiteEvaluation,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import type { CoursePrerequisiteMenuState } from '@/features/curriculum-planner/components/CourseCard'
import type { CurriculumPlannerContextValue } from '@/features/curriculum-planner/CurriculumPlannerProvider'
import type { CatalogCourseDetails } from '@/features/curriculum-planner/data/courseDetailsApi'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CatalogCourseDetailsContent } from '@/features/course-catalog/CatalogCourseDetailsContent'
import { getCatalogCourseDetails } from '@/features/curriculum-planner/data/courseDetailsApi'
import { useFeedbackReport } from '@/features/feedback/FeedbackReportProvider'
import { isApprovedStudentCourseAttempt } from '@/features/student/data/studentApi'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'

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
    <section className="space-y-3 border-t-2 border-border pt-4">
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
        <ul className="divide-y divide-border">
          {selected.items.map((item) => (
            <li
              key={`${selected.key}:${prerequisiteItemLabel(item)}`}
              className="flex items-center justify-between gap-4 py-2 text-sm"
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
  return (
    <div className="space-y-5">
      <section className="space-y-3">
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
      <section className="space-y-3 border-t-2 border-border pt-4">
        <div>
          <h3 className="font-extrabold">Conclusão</h3>
          <p className="text-sm text-muted-foreground">
            A conclusão é registrada no histórico do aluno.
          </p>
        </div>
        {approvedAttempt ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <span className="flex items-center gap-2 text-sm font-bold">
              <CircleCheck className="size-4" />
              Concluída
              {approvedAttempt.studyPeriod &&
                ` em ${studyPeriodLabel(approvedAttempt.studyPeriod)}`}
              {approvedAttempt.grade !== null &&
                ` · Nota ${approvedAttempt.grade}`}
            </span>
          </div>
        ) : completed ? (
          <div className="border-t border-border pt-3 text-sm font-bold">
            <CircleCheck className="mr-2 inline size-4" /> Concluída
          </div>
        ) : (
          <p className="border-t border-border pt-3 text-sm text-muted-foreground">
            Não concluída no histórico acadêmico.
          </p>
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

function CatalogCourseFooter({
  course,
  details,
  catalogYear,
}: {
  course: Course
  details?: CatalogCourseDetails | null
  catalogYear: number
}) {
  const { openFeedback } = useFeedbackReport()
  return (
    <div className="flex flex-wrap items-center gap-4 border-t-2 border-border pt-4">
      {details?.sourceUrl && (
        <a
          className="inline-flex items-center gap-1 text-sm font-bold text-primary underline"
          href={details.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Ver fonte institucional <ExternalLink className="size-4" />
        </a>
      )}
      <Link
        className="text-sm font-bold text-primary underline"
        to="/disciplinas/$courseId"
        params={{ courseId: String(course.id) }}
        search={{ catalogYear }}
      >
        Ver detalhes completos
      </Link>
      {details && (
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
          <MessageSquareWarning className="size-4" /> Reportar dado incorreto
        </Button>
      )}
    </div>
  )
}

function CourseDetailsBody({
  course,
  ...props
}: CourseDetailsDialogProps & { course: Course }) {
  const catalogQuery = useQuery({
    queryKey: publicQueryKeys.courseDetails(
      String(course.id),
      props.catalogYear,
    ),
    queryFn: () =>
      getCatalogCourseDetails(Number(course.id), props.catalogYear),
    staleTime: Infinity,
  })
  return (
    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
      <PlanningSection {...props} course={course} />
      {catalogQuery.isLoading && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Carregando informações acadêmicas...
        </p>
      )}
      {catalogQuery.isError && (
        <p className="text-sm text-destructive" role="alert">
          Não foi possível carregar as informações acadêmicas desta disciplina.
        </p>
      )}
      {!catalogQuery.isLoading &&
        !catalogQuery.isError &&
        !catalogQuery.data && (
          <p className="text-sm text-muted-foreground">
            Esta disciplina não possui informações acadêmicas no catálogo de{' '}
            {props.catalogYear}.
          </p>
        )}
      {catalogQuery.data && (
        <CatalogCourseDetailsContent details={catalogQuery.data} />
      )}
      <CatalogCourseFooter
        course={course}
        details={catalogQuery.data}
        catalogYear={props.catalogYear}
      />
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
  if (!props.course) return null
  const title = `${props.course.code} — ${props.course.name}`
  const description = `${props.course.credits} créditos · Catálogo ${props.catalogYear}`
  const body = <CourseDetailsBody {...props} course={props.course} />

  if (desktop)
    return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogContent
          className="flex max-h-[88dvh] max-w-2xl flex-col overflow-hidden p-0"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader className="mb-0 border-b-2 border-strong-border p-5 pr-12 sm:p-6 sm:pr-12">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
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
        closeButtonClassName="text-foreground hover:bg-accent"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="border-b-2 border-strong-border pr-12">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {body}
      </SheetContent>
    </Sheet>
  )
}
