import { scheduleDays as days } from '@pomi/planner-domain/semester'
import { MoreHorizontal } from 'lucide-react'
import type {
  ClassMeeting,
  SemesterClass,
  SemesterCourse,
} from '@pomi/planner-domain/semester'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SelectedClassesPanel({
  selectedClasses,
  coursesById,
  meetings,
  onOpen,
  onShowAlternatives,
  onShowInSchedule,
  onRemove,
}: {
  selectedClasses: ReadonlyArray<SemesterClass>
  coursesById: ReadonlyMap<number, SemesterCourse>
  meetings: ReadonlyArray<ClassMeeting>
  onOpen: (classId: number) => void
  onShowAlternatives: (courseId: number) => void
  onShowInSchedule: (classId: number) => void
  onRemove: (classId: number) => void
}) {
  return (
    <div className="divide-y divide-border">
      {selectedClasses.length ? (
        selectedClasses.map((classItem) => {
          const course = coursesById.get(classItem.courseId)
          const classMeetings = meetings.filter(
            (meeting) => meeting.classId === classItem.id,
          )
          return (
            <article
              key={classItem.id}
              className="grid gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <button
                  type="button"
                  className="pomi-focus block max-w-full text-left text-sm font-extrabold hover:underline"
                  onClick={() => onOpen(classItem.id)}
                >
                  {classItem.courseCode} · Turma {classItem.code}
                </button>
                <p className="text-xs text-muted-foreground">{course?.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {classMeetings
                    .map(
                      (meeting) =>
                        `${days.find(([day]) => day === meeting.dayOfWeek)?.[1]} ${meeting.start}–${meeting.end}`,
                    )
                    .join(' · ')}
                </p>
              </div>
              <div className="flex gap-2 sm:hidden">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowInSchedule(classItem.id)}
                >
                  Ver na grade
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label={`Ações de ${classItem.courseCode}, turma ${classItem.code}`}
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => onShowAlternatives(classItem.courseId)}
                    >
                      Trocar turma
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => onRemove(classItem.id)}
                    >
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="hidden flex-wrap gap-2 sm:flex sm:justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowInSchedule(classItem.id)}
                >
                  Ver na grade
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShowAlternatives(classItem.courseId)}
                >
                  Trocar
                </Button>
                <Button
                  className="text-destructive hover:text-destructive"
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(classItem.id)}
                >
                  Remover
                </Button>
              </div>
            </article>
          )
        })
      ) : (
        <p className="py-2 text-sm text-muted-foreground">
          Nenhuma turma selecionada.
        </p>
      )}
    </div>
  )
}
