import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ExternalLink, MessageSquareWarning } from 'lucide-react'
import { useId, useRef } from 'react'
import type { ReactNode } from 'react'
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
import { useDesktopLayout } from '@/hooks/useDesktopLayout'

export function CatalogProgramCourseDialog({
  course,
  catalogYear,
  personalContext,
  onOpenChange,
}: {
  course?: Readonly<{
    id: string | number
    code: string
    name: string
    credits: number
  }>
  catalogYear: number
  personalContext?: ReactNode
  onOpenChange: (open: boolean) => void
}) {
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const handleOpenAutoFocus = (event: Event) => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    event.preventDefault()
    document.getElementById(titleId)?.focus()
  }
  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault()
    const target = returnFocusRef.current
    if (target?.isConnected && target.getClientRects().length) target.focus()
  }
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
      {personalContext}
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
          onClick={() => onOpenChange(false)}
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
            onClick={() => {
              returnFocusRef.current = null
              onOpenChange(false)
              openFeedback({
                kind: 'DATA_ISSUE',
                target: {
                  type: 'ACADEMIC_RESOURCE',
                  academicResource: {
                    type: 'CATALOG_COURSE',
                    id: details.id,
                  },
                },
                title: `Informação de ${details.code}`,
              })
            }}
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
        aria-labelledby={titleId}
        className="flex max-h-[88dvh] max-w-2xl flex-col overflow-hidden p-0"
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
      >
        <DialogHeader className="mb-0 border-b-2 border-strong-border p-5 pr-12 sm:p-6 sm:pr-12">
          <DialogTitle id={titleId} tabIndex={-1} className="pomi-focus">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open onOpenChange={onOpenChange}>
      <SheetContent
        aria-labelledby={titleId}
        side="bottom"
        className="max-h-[88dvh] rounded-t-xl bg-background text-foreground"
        closeButtonClassName="text-foreground hover:bg-accent"
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
      >
        <SheetHeader className="border-b-2 border-strong-border pr-12">
          <SheetTitle id={titleId} tabIndex={-1} className="pomi-focus">
            {title}
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {body}
      </SheetContent>
    </Sheet>
  )
}
