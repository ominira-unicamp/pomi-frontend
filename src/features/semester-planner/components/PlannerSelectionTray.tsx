import { AlertTriangle, BookOpen, Clock3, GraduationCap } from 'lucide-react'
import type {
  ClassMeeting,
  SemesterClass,
  SemesterCourse,
} from '@pomi/planner-domain/semester'

import type {
  DetailedScheduleConflict,
  SemesterPlannerSummary,
} from '@/features/semester-planner/model/semesterPlannerView'
import { SelectedClassesPanel } from '@/features/semester-planner/components/SelectedClassesPanel'
import { Button } from '@/components/ui/button'

export function PlannerSelectionTray({
  summary,
  conflicts,
  selectedClasses,
  coursesById,
  meetings,
  onOpen,
  onShowAlternatives,
  onShowInSchedule,
  onRemove,
}: {
  summary: SemesterPlannerSummary
  conflicts: ReadonlyArray<DetailedScheduleConflict>
  selectedClasses: ReadonlyArray<SemesterClass>
  coursesById: ReadonlyMap<number, SemesterCourse>
  meetings: ReadonlyArray<ClassMeeting>
  onOpen: (classId: number) => void
  onShowAlternatives: (courseId: number) => void
  onShowInSchedule: (classId: number) => void
  onRemove: (classId: number) => void
}) {
  const panel = (
    <div>
      <SelectedClassesPanel
        selectedClasses={selectedClasses}
        coursesById={coursesById}
        meetings={meetings}
        onOpen={onOpen}
        onShowAlternatives={onShowAlternatives}
        onShowInSchedule={onShowInSchedule}
        onRemove={onRemove}
      />
      {conflicts.length > 0 && (
        <section className="mt-3 space-y-2 border-t border-chart-4 pt-3">
          <h3 className="text-sm font-extrabold">Conflitos de horário</h3>
          {conflicts.map((conflict) => (
            <div
              key={conflict.key}
              className="flex flex-wrap items-center justify-between gap-2"
            >
              <p className="text-xs">
                <strong>
                  {conflict.classItem.courseCode} {conflict.classItem.code} ×{' '}
                  {conflict.conflictingClass.courseCode}{' '}
                  {conflict.conflictingClass.code}
                </strong>{' '}
                · {conflict.dayLabel} {conflict.start}–{conflict.end}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onShowAlternatives(conflict.classItem.courseId)}
              >
                Ver alternativas
              </Button>
            </div>
          ))}
        </section>
      )}
    </div>
  )

  return (
    <section className="mt-4 rounded-lg border-2 border-strong-border bg-card">
      <header className="flex w-full flex-wrap items-center gap-3 p-3 sm:gap-4">
        <SummaryItems summary={summary} />
        <h2 className="w-full text-sm font-extrabold sm:ml-auto sm:w-auto">
          Minhas turmas ({selectedClasses.length})
        </h2>
      </header>
      <div className="border-t-2 border-strong-border px-3 py-3 sm:px-4">
        {panel}
      </div>
    </section>
  )
}

function SummaryItems({ summary }: { summary: SemesterPlannerSummary }) {
  const items = [
    [BookOpen, summary.disciplines, 'disciplinas'],
    [GraduationCap, summary.credits, 'créditos'],
    [Clock3, formatDuration(summary.weeklyMinutes), 'semanais'],
    [AlertTriangle, summary.conflicts, 'conflitos'],
  ] as const
  return (
    <span className="flex flex-wrap items-center gap-3 sm:gap-5">
      {items.map(([Icon, value, label], index) => (
        <span
          key={label}
          className={`inline-flex items-center gap-1 text-xs ${index === 3 && summary.conflicts > 0 ? 'text-chart-4' : ''}`}
        >
          <Icon className="size-4" />
          <strong>{value}</strong>
          <span className="text-muted-foreground">{label}</span>
        </span>
      ))}
    </span>
  )
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder
    ? `${hours}h${String(remainder).padStart(2, '0')}`
    : `${hours}h`
}
