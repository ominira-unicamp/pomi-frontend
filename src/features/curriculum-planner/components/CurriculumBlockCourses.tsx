import { useDroppable } from '@dnd-kit/core'
import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { memo } from 'react'

import { CompactCourseCard, CompactVisual } from './CourseCard'
import type {
  CourseId,
  CurriculumBlockView,
  CurriculumPlannerSnapshot,
  PlanningPeriod,
} from '@pomi/planner-domain/curriculum'
import { cn } from '@/lib/utils'

export const CurriculumBlockCourses = memo(function CurriculumBlockCourses({
  block,
  groupId,
  view,
  periods,
  planningStart,
  disabled,
  onOpenCourseDetails,
  onOpenCourseSearch,
  selectedCourseIds,
  selectionMode,
  onToggleCourseSelection,
}: {
  block: CurriculumBlockView
  groupId: string
  view: 'snip' | 'table'
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  onOpenCourseDetails: (courseId: CourseId) => void
  onOpenCourseSearch: (prefix?: string) => void
  selectedCourseIds: ReadonlySet<CourseId>
  selectionMode: boolean
  onToggleCourseSelection: (courseId: CourseId) => void
}) {
  const { setNodeRef } = useDroppable({
    id: `curriculum-block:${groupId}:${block.id}`,
  })

  return (
    <div ref={setNodeRef} className="space-y-3">
      {view === 'table' ? (
        <CurriculumBlockTable
          block={block}
          onOpenCourseDetails={onOpenCourseDetails}
          onOpenCourseSearch={onOpenCourseSearch}
          selectedCourseIds={selectedCourseIds}
          selectionMode={selectionMode}
          onToggleCourseSelection={onToggleCourseSelection}
        />
      ) : (
        <CurriculumBlockSnip
          block={block}
          periods={periods}
          planningStart={planningStart}
          disabled={disabled}
          onOpenCourseDetails={onOpenCourseDetails}
          onOpenCourseSearch={onOpenCourseSearch}
          selectedCourseIds={selectedCourseIds}
          selectionMode={selectionMode}
          onToggleCourseSelection={onToggleCourseSelection}
          dragIdPrefix={`${groupId}:${block.id}`}
        />
      )}
    </div>
  )
})

function CurriculumBlockSnip({
  block,
  periods,
  planningStart,
  disabled,
  onOpenCourseDetails,
  onOpenCourseSearch,
  selectedCourseIds,
  selectionMode,
  onToggleCourseSelection,
  dragIdPrefix,
}: {
  block: CurriculumBlockView
  periods: ReadonlyArray<PlanningPeriod>
  planningStart: CurriculumPlannerSnapshot['plan']['planningStart']
  disabled: boolean
  onOpenCourseDetails: (courseId: CourseId) => void
  onOpenCourseSearch: (prefix?: string) => void
  selectedCourseIds: ReadonlySet<CourseId>
  selectionMode: boolean
  onToggleCourseSelection: (courseId: CourseId) => void
  dragIdPrefix: string
}) {
  return (
    <>
      {block.selectorLabels.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">
            Elegíveis:
          </span>
          {block.selectorLabels.map((label) => (
            <button
              type="button"
              key={label}
              className={
                label === 'Qualquer disciplina'
                  ? 'pomi-focus rounded-sm border-2 border-strong-border bg-muted px-2 py-1 font-mono text-xs font-black hover:border-primary hover:text-primary'
                  : 'pomi-focus rounded-sm'
              }
              onClick={() =>
                onOpenCourseSearch(
                  label === 'Qualquer disciplina' ? undefined : label,
                )
              }
            >
              {label === 'Qualquer disciplina' ? (
                label
              ) : (
                <CompactVisual
                  code={`${label}---`}
                  className="hover:border-primary hover:text-primary"
                />
              )}
            </button>
          ))}
        </div>
      )}
      {block.courses.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {block.courses.map((state) => (
            <CompactCourseCard
              key={`${block.id}:${state.course.id}`}
              dragId={`block:${dragIdPrefix}:course:${state.course.id}`}
              state={state}
              periods={periods}
              planningStart={planningStart}
              disabled={disabled}
              onOpenDetails={onOpenCourseDetails}
              selected={selectedCourseIds.has(state.course.id)}
              selectionMode={selectionMode}
              onToggleSelection={onToggleCourseSelection}
            />
          ))}
        </div>
      ) : !block.selectorLabels.length ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma disciplina não concluída neste bloco.
        </p>
      ) : null}
    </>
  )
}

function CurriculumBlockTable({
  block,
  onOpenCourseDetails,
  onOpenCourseSearch,
  selectedCourseIds,
  selectionMode,
  onToggleCourseSelection,
}: {
  block: CurriculumBlockView
  onOpenCourseDetails: (courseId: CourseId) => void
  onOpenCourseSearch: (prefix?: string) => void
  selectedCourseIds: ReadonlySet<CourseId>
  selectionMode: boolean
  onToggleCourseSelection: (courseId: CourseId) => void
}) {
  const visibleSelectors = block.selectors.filter((selector) => {
    if (selector.type !== 'specificCourse') return true
    return block.courses.some((state) => state.course.id === selector.courseId)
  })

  if (visibleSelectors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma disciplina não concluída neste bloco.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border-2 border-border">
      <table className="w-full table-fixed border-collapse bg-white text-left text-sm">
        <colgroup>
          <col className="w-24 sm:w-36" />
          <col className="w-20 sm:w-28" />
          <col />
        </colgroup>
        <thead className="bg-muted/60 text-xs font-black tracking-[0.08em] uppercase">
          <tr>
            <th className="border-b-2 border-border px-3 py-2">Código</th>
            <th className="border-b-2 border-border px-3 py-2">Créditos</th>
            <th className="border-b-2 border-border px-3 py-2">Nome</th>
          </tr>
        </thead>
        <tbody>
          {visibleSelectors.map((selector, index) => {
            const courseState =
              selector.type === 'specificCourse'
                ? block.courses.find(
                    (state) => state.course.id === selector.courseId,
                  )
                : undefined
            const course = courseState?.course
            const selected = course ? selectedCourseIds.has(course.id) : false
            const prefix =
              selector.type === 'prefix'
                ? selector.prefix.trim().toUpperCase()
                : undefined
            const code = course?.code ?? (prefix ? `${prefix}---` : '---')
            const name =
              course?.name ??
              (prefix
                ? `Qualquer disciplina com prefixo ${prefix}`
                : 'Qualquer disciplina')
            const open = () => {
              if (course) onOpenCourseDetails(course.id)
              else onOpenCourseSearch(prefix)
            }
            return (
              <tr
                key={`${selector.type}-${course?.id ?? prefix ?? index}`}
                role="button"
                tabIndex={0}
                aria-pressed={course ? selected : undefined}
                aria-label={
                  course
                    ? `Ver informações de ${course.code}`
                    : `Buscar disciplinas para ${code}`
                }
                className={cn(
                  'cursor-pointer border-b border-border last:border-b-0 hover:bg-muted/40',
                  selected &&
                    'bg-primary text-primary-foreground hover:bg-primary',
                )}
                onClick={(event) => {
                  if ((selectionMode || event.shiftKey) && course) {
                    onToggleCourseSelection(course.id)
                    return
                  }
                  open()
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    if ((selectionMode || event.shiftKey) && course) {
                      onToggleCourseSelection(course.id)
                      return
                    }
                    open()
                  }
                }}
              >
                <td
                  className={cn(
                    'px-3 py-2 font-mono font-black',
                    selected ? 'text-primary-foreground' : 'text-primary',
                  )}
                >
                  {course ? (
                    <Link
                      to="/disciplinas/$courseId"
                      params={{ courseId: String(course.id) }}
                      search={{}}
                      className="underline-offset-2 hover:underline"
                      aria-label={`Abrir disciplina ${course.code}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {code}
                    </Link>
                  ) : (
                    code
                  )}
                </td>
                <td className="px-3 py-2 font-semibold">
                  {course?.credits ?? '—'}
                </td>
                <td className="relative py-2 pr-10 pl-3 font-semibold">
                  {name}
                  <ChevronRight className="absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
