import { AlertCircle, CalendarDays, LoaderCircle } from 'lucide-react'

import { CourseAttemptRow } from './CourseAttemptRow'
import type { ProfessorEvaluationTarget } from '@/features/student/components/ProfessorEvaluationDialog'
import type {
  StudentClassSchedule,
  StudentCourseAttempt,
  StudyPeriod,
} from '@/features/student/data/studentApi'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { DataList } from '@/components/patterns/DataList'
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from '@/components/patterns/Section'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/patterns/Badge'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/PageLayout'
import { StudentWeeklySchedule } from '@/features/student/components/StudentWeeklySchedule'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'

function ScheduleState({
  periodSelected,
  loading,
  error,
  meetings,
}: {
  periodSelected: boolean
  loading: boolean
  error: boolean
  meetings: ReadonlyArray<StudentClassSchedule>
}) {
  if (!periodSelected)
    return (
      <Card
        variant="flat"
        className="grid min-h-40 place-items-center p-6 text-center"
      >
        <div>
          <h3 className="font-extrabold">Nenhum período informado</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Edite as disciplinas cursando e informe período e turma para montar
            sua agenda.
          </p>
        </div>
      </Card>
    )
  if (loading)
    return (
      <Card
        variant="flat"
        className="flex min-h-40 items-center justify-center gap-3 p-6"
        role="status"
      >
        <LoaderCircle className="size-5 animate-spin text-primary" />
        <span className="font-bold">Carregando horários</span>
      </Card>
    )
  if (error)
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Não foi possível carregar a agenda</AlertTitle>
        <AlertDescription>
          A lista de disciplinas continua disponível abaixo.
        </AlertDescription>
      </Alert>
    )
  if (meetings.length) return <StudentWeeklySchedule meetings={meetings} />
  return (
    <Card
      variant="flat"
      className="grid min-h-40 place-items-center p-6 text-center"
    >
      <div>
        <h3 className="font-extrabold">Nenhum horário disponível</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Vincule turmas com horários cadastrados para preencher a agenda.
        </p>
      </div>
    </Card>
  )
}

export function EnrolledCoursesSection({
  attempts,
  periods,
  selectedPeriodId,
  meetings,
  scheduleLoading,
  scheduleError,
  attemptsOutsideSchedule,
  absenceCount,
  onPeriodChange,
  onNewAttempt,
  onOpenAbsences,
  onEvaluate,
  onEdit,
  onRemove,
}: {
  attempts: ReadonlyArray<StudentCourseAttempt>
  periods: ReadonlyArray<StudyPeriod>
  selectedPeriodId: string
  meetings: ReadonlyArray<StudentClassSchedule>
  scheduleLoading: boolean
  scheduleError: boolean
  attemptsOutsideSchedule: number
  absenceCount: (attemptId: number) => number
  onPeriodChange: (periodId: string) => void
  onNewAttempt: () => void
  onOpenAbsences: (attemptId: number) => void
  onEvaluate: (target: ProfessorEvaluationTarget) => void
  onEdit: (attempt: StudentCourseAttempt) => void
  onRemove: (attemptId: number) => void
}) {
  if (!attempts.length)
    return (
      <EmptyState
        title="Nenhuma disciplina em andamento"
        description="Adicione as disciplinas que você está cursando neste período."
        action={{
          label: 'Adicionar disciplina cursando',
          onClick: onNewAttempt,
        }}
      />
    )

  return (
    <div className="space-y-8">
      <Section aria-labelledby="student-schedule-title">
        <SectionHeader className="sm:items-end">
          <div>
            <SectionTitle
              id="student-schedule-title"
              className="flex items-center gap-2"
            >
              <CalendarDays className="size-5 text-primary" /> Agenda das aulas
            </SectionTitle>
            <SectionDescription>
              Horários das turmas vinculadas às disciplinas cursando.
            </SectionDescription>
          </div>
          {periods.length > 1 ? (
            <div className="w-full sm:w-64">
              <AutocompleteSelect
                ariaLabel="Período da agenda"
                value={selectedPeriodId}
                options={periods.map((period) => ({
                  value: String(period.id),
                  label: studyPeriodLabel(period),
                }))}
                placeholder="Escolha o período"
                onValueChange={onPeriodChange}
              />
            </div>
          ) : (
            periods[0] && (
              <Badge variant="outline">{studyPeriodLabel(periods[0])}</Badge>
            )
          )}
        </SectionHeader>
        <SectionContent className="space-y-4">
          {attemptsOutsideSchedule > 0 && (
            <Alert>
              <AlertCircle />
              <AlertTitle>Agenda parcial</AlertTitle>
              <AlertDescription>
                {attemptsOutsideSchedule}{' '}
                {attemptsOutsideSchedule === 1
                  ? 'disciplina ficou'
                  : 'disciplinas ficaram'}{' '}
                fora da agenda por não possuir período, turma ou horário
                cadastrado.
              </AlertDescription>
            </Alert>
          )}
          <ScheduleState
            periodSelected={Boolean(selectedPeriodId)}
            loading={scheduleLoading}
            error={scheduleError}
            meetings={meetings}
          />
        </SectionContent>
      </Section>
      <Section aria-labelledby="enrolled-courses-title">
        <SectionTitle id="enrolled-courses-title" className="mb-3">
          Disciplinas cursando
        </SectionTitle>
        <SectionContent>
          <DataList className="space-y-2 divide-y-0">
            {attempts.map((attempt) => (
              <CourseAttemptRow
                key={attempt.id}
                attempt={attempt}
                absenceCount={absenceCount(attempt.id)}
                onOpenAbsences={onOpenAbsences}
                onEvaluate={onEvaluate}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))}
          </DataList>
        </SectionContent>
      </Section>
    </div>
  )
}
