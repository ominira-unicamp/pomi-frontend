import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ExternalLink, MessageSquareWarning } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { Course } from '@pomi/planner-domain/curriculum'
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
import { Button } from '@/components/ui/button'
import { useFeedbackReport } from '@/features/feedback/FeedbackReportProvider'
import { CatalogCourseDetailsContent } from '@/features/course-catalog/CatalogCourseDetailsContent'
import { getCatalogCourseDetails } from '@/features/curriculum-planner/data/courseDetailsApi'
import { publicQueryKeys } from '@/integrations/tanstack-query/queryKeys'

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

export function CatalogProgramCourseDialog({
  course,
  catalogYear,
  onOpenChange,
}: {
  course?: Course
  catalogYear: number
  onOpenChange: (open: boolean) => void
}) {
  const desktop = useDesktopLayout()
  const { openFeedback } = useFeedbackReport()
  const courseId = course ? Number(course.id) : undefined
  const query = useQuery({
    queryKey: publicQueryKeys.courseDetails(
      course ? String(course.id) : 'none',
      catalogYear,
    ),
    queryFn: () => getCatalogCourseDetails(courseId!, catalogYear),
    enabled: courseId !== undefined,
    staleTime: Infinity,
  })

  if (!course) return null

  const details = query.data
  const title = `${course.code} — ${course.name}`
  const description = `${course.credits} créditos · Catálogo ${catalogYear}`
  const body = (
    <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
      {query.isLoading && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Carregando informações acadêmicas...
        </p>
      )}
      {query.isError && (
        <p className="text-sm text-destructive" role="alert">
          Não foi possível carregar as informações acadêmicas desta disciplina.
        </p>
      )}
      {!query.isLoading && !query.isError && !details && (
        <p className="text-sm text-muted-foreground">
          Esta disciplina não possui informações acadêmicas no catálogo de{' '}
          {catalogYear}.
        </p>
      )}
      {details && <CatalogCourseDetailsContent details={details} />}
      <div className="flex flex-wrap items-center gap-4 border-t-2 border-border pt-4">
        <Link
          className="pomi-focus inline-flex rounded-md bg-primary px-3 py-2 text-sm font-extrabold text-primary-foreground shadow-[2px_2px_0_var(--strong-border)] transition-colors hover:bg-primary/90"
          to="/disciplinas/$courseId"
          params={{ courseId: String(course.id) }}
          search={{ catalogYear }}
        >
          Ver detalhes completos
        </Link>
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
    </div>
  )

  return desktop ? (
    <Dialog open onOpenChange={onOpenChange}>
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
  ) : (
    <Sheet open onOpenChange={onOpenChange}>
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
