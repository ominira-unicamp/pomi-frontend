import { scheduleDays as days } from '@pomi/planner-domain/semester'
import type {
  ClassMeeting,
  SemesterClass,
  SemesterCourse,
} from '@pomi/planner-domain/semester'

import type { ProfessorEvaluationSummary } from '@/features/semester-planner/data/semesterPlanningApi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function SelectedClassDialog({
  classItem,
  course,
  meetings,
  professorEvaluationSummaries,
  onOpenChange,
  onShowAlternatives,
  onRemove,
}: {
  classItem?: SemesterClass
  course?: SemesterCourse
  meetings: ReadonlyArray<ClassMeeting>
  professorEvaluationSummaries: ReadonlyMap<number, ProfessorEvaluationSummary>
  onOpenChange: (open: boolean) => void
  onShowAlternatives: (courseId: number) => void
  onRemove: (classId: number) => void
}) {
  return (
    <Dialog open={Boolean(classItem)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {classItem && (
          <>
            <DialogHeader>
              <DialogTitle>
                {classItem.courseCode} · Turma {classItem.code}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {course && (
                <p className="text-sm text-muted-foreground">
                  {course.name} · {course.credits} créditos
                </p>
              )}
              <div>
                <h3 className="text-xs font-black tracking-[0.08em] uppercase">
                  Horários
                </h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {meetings.map((meeting) => (
                    <li key={meeting.id}>
                      {days.find(([day]) => day === meeting.dayOfWeek)?.[1]}{' '}
                      {meeting.start}–{meeting.end} · {meeting.roomCode}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-black tracking-[0.08em] uppercase">
                  Professores
                </h3>
                <div className="mt-2 space-y-2">
                  {classItem.professors.length ? (
                    classItem.professors.map((professor) => {
                      const evaluation = professorEvaluationSummaries.get(
                        professor.id,
                      )
                      return (
                        <div key={professor.id}>
                          <p className="text-sm font-bold">{professor.name}</p>
                          {evaluation && (
                            <p className="text-xs text-muted-foreground">
                              {evaluation.responseCount} avaliações · Voltaria{' '}
                              {evaluation.wouldTakeAgain.toFixed(1)} · Clareza{' '}
                              {evaluation.clarity.toFixed(1)} · Dificuldade{' '}
                              {evaluation.difficulty.toFixed(1)}
                            </p>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Professor não informado
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:justify-between">
              <Button
                variant="outline"
                onClick={() => onShowAlternatives(classItem.courseId)}
              >
                Ver alternativas
              </Button>
              <Button
                variant="destructive"
                onClick={() => onRemove(classItem.id)}
              >
                Remover turma
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
