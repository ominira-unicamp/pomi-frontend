import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ExternalLink, MessageSquareWarning, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { periodReference } from '@pomi/planner-domain/curriculum'
import type {
  Course,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
  PlanningPeriodId,
} from '@pomi/planner-domain/curriculum'
import type { CoursePrerequisiteMenuState } from '@/features/curriculum-planner/components/CourseCard'
import type { CurriculumPlannerContextValue } from '@/features/curriculum-planner/CurriculumPlannerProvider'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
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
import type { CatalogCourseDetails } from '@/features/curriculum-planner/data/courseDetailsApi'
import { getCatalogCourseDetails } from '@/features/curriculum-planner/data/courseDetailsApi'
import { useFeedbackReport } from '@/features/feedback/FeedbackReportProvider'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import { cn } from '@/lib/utils'

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

function PlanningSection({
  course,
  plannedPeriodId,
  unallocated,
  periods,
  planningStart,
  disabled,
  dispatch,
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
    </div>
  )
}

function CourseDetailsFooter({
  course,
  catalogYear,
  planned,
  disabled,
  dispatch,
  onRemoved,
}: {
  course: Course
  catalogYear: number
  planned: boolean
  disabled: boolean
  dispatch: CourseDetailsDialogProps['dispatch']
  onRemoved: () => void
}) {
  const removeFromPlanning = async () => {
    const succeeded = await dispatch({
      type: 'removeCourseFromPlan',
      courseId: course.id,
    })
    if (succeeded) onRemoved()
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t-2 border-border bg-card px-5 py-4 sm:px-6">
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'h-auto px-0 py-1 text-primary underline-offset-4 hover:bg-transparent hover:underline',
        )}
        to="/disciplinas/$courseId"
        params={{ courseId: String(course.id) }}
        search={{ catalogYear }}
      >
        Dados completos
      </Link>
      <Button
        variant="outline"
        className="shrink-0 text-destructive"
        disabled={!planned || disabled}
        onClick={() => void removeFromPlanning()}
      >
        <Trash2 /> Remover do planejamento
      </Button>
    </div>
  )
}

function CatalogCourseDetailsLinks({
  details,
}: {
  details?: CatalogCourseDetails | null
}) {
  const { openFeedback } = useFeedbackReport()
  if (!details) return null
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
      {details.sourceUrl && (
        <a
          className="pomi-focus inline-flex items-center gap-1 text-sm font-bold text-primary underline-offset-4 hover:underline"
          href={details.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Ver fonte institucional <ExternalLink className="size-4" />
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
        <MessageSquareWarning className="size-4" /> Reportar dado incorreto
      </Button>
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
    <div className="min-h-0 flex flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
        <PlanningSection {...props} course={course} />
        {catalogQuery.isLoading && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Carregando informações acadêmicas...
          </p>
        )}
        {catalogQuery.isError && (
          <p className="text-sm text-destructive" role="alert">
            Não foi possível carregar as informações acadêmicas desta
            disciplina.
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
        <CatalogCourseDetailsLinks details={catalogQuery.data} />
      </div>
      <CourseDetailsFooter
        course={course}
        catalogYear={props.catalogYear}
        planned={Boolean(props.plannedPeriodId || props.unallocated)}
        disabled={props.disabled}
        dispatch={props.dispatch}
        onRemoved={props.onRemoved}
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
        className="max-h-[88dvh] overflow-hidden rounded-t-xl bg-background text-foreground"
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
