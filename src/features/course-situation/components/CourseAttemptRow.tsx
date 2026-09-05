import { CalendarDays, Pencil, Trash2 } from 'lucide-react'

import { labelForStatus } from '../model/model'
import type { ProfessorEvaluationTarget } from '@/features/student/components/ProfessorEvaluationDialog'
import type { StudentCourseAttempt } from '@/features/student/data/studentApi'
import { ActionBar } from '@/components/patterns/ActionBar'
import { Badge } from '@/components/patterns/Badge'
import { DataRow } from '@/components/patterns/DataList'
import { Button } from '@/components/ui/button'

function statusVariant(status: StudentCourseAttempt['status']) {
  if (
    status === 'APPROVED' ||
    status === 'APPROVED_BY_ATTENDANCE' ||
    status === 'APPROVED_BY_PROFICIENCY' ||
    status === 'SUFFICIENT'
  )
    return 'success' as const
  if (status === 'ENROLLED') return 'warning' as const
  if (status === 'DROPPED') return 'secondary' as const
  return 'destructive' as const
}

export function CourseAttemptRow({
  attempt,
  absenceCount,
  onOpenAbsences,
  onEvaluate,
  onEdit,
  onRemove,
}: {
  attempt: StudentCourseAttempt
  absenceCount: number
  onOpenAbsences: (attemptId: number) => void
  onEvaluate: (target: ProfessorEvaluationTarget) => void
  onEdit: (attempt: StudentCourseAttempt) => void
  onRemove: (attemptId: number) => void
}) {
  return (
    <DataRow className="rounded-md border border-strong-border p-3 first:pt-3 last:pb-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold">
            {attempt.course.code} — {attempt.course.name}
          </p>
          <Badge variant={statusVariant(attempt.status)}>
            {labelForStatus(attempt.status)}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {attempt.course.credits} créditos
          {attempt.grade !== null ? ` · Nota ${attempt.grade}` : ''}
          {attempt.class ? ` · Turma ${attempt.class.code}` : ''}
          {attempt.class?.professors.length
            ? ` · ${attempt.class.professors.map((professor) => professor.name).join(', ')}`
            : ''}
          {attempt.status === 'ENROLLED'
            ? ` · ${absenceCount} ${absenceCount === 1 ? 'falta' : 'faltas'}`
            : ''}
        </p>
      </div>
      <ActionBar className="w-full sm:w-auto">
        {attempt.status === 'ENROLLED' && (
          <Button
            className="flex-1 sm:flex-none"
            size="sm"
            variant="outline"
            onClick={() => onOpenAbsences(attempt.id)}
          >
            <CalendarDays /> Aulas e faltas
          </Button>
        )}
        {attempt.status !== 'ENROLLED' &&
          attempt.class?.professors.map((professor) => (
            <Button
              key={professor.id}
              className="flex-1 sm:flex-none"
              size="sm"
              onClick={() =>
                onEvaluate({
                  classId: attempt.class!.id,
                  classCode: attempt.class!.code,
                  courseCode: attempt.course.code,
                  courseName: attempt.course.name,
                  professorId: professor.id,
                  professorName: professor.name,
                })
              }
            >
              Avaliar {professor.name}
            </Button>
          ))}
        <Button
          className="flex-1 sm:flex-none"
          size="sm"
          variant="outline"
          onClick={() => onEdit(attempt)}
        >
          <Pencil /> Editar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-destructive sm:flex-none"
          onClick={() => onRemove(attempt.id)}
        >
          <Trash2 /> Remover
        </Button>
      </ActionBar>
    </DataRow>
  )
}
