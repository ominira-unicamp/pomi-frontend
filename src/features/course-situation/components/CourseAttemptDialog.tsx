import { evaluationModes, statusesByEvaluationMode } from '../model/model'
import type {
  StudentCourseAttemptClass,
  StudentCourseAttemptStatus,
  StudentCourseEvaluationMode,
  StudyPeriod,
} from '@/features/student/data/studentApi'
import type { Course } from '@pomi/planner-domain/curriculum'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Field, FieldError, FieldLabel } from '@/components/patterns/Field'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { mostRecentStudyPeriodsFirst } from '@/features/student/data/studyPeriodOrdering'
import { studyPeriodLabel } from '@/features/student/data/studyPeriod'

export type CourseAttemptFormState = Readonly<{
  editingAttemptId?: number
  courseId: string
  studyPeriodId: string
  classId: string
  evaluationMode: StudentCourseEvaluationMode | ''
  status: StudentCourseAttemptStatus | ''
  grade: string
}>

export function CourseAttemptDialog({
  open,
  form,
  periods,
  courses,
  classes,
  classesLoading,
  evaluationModeLoading,
  gradeError,
  operationError,
  saving,
  onOpenChange,
  onFormChange,
  onSave,
}: {
  open: boolean
  form: CourseAttemptFormState
  periods: ReadonlyArray<StudyPeriod>
  courses: ReadonlyArray<Course>
  classes: ReadonlyArray<StudentCourseAttemptClass>
  classesLoading: boolean
  evaluationModeLoading: boolean
  gradeError?: string
  operationError?: string
  saving: boolean
  onOpenChange: (open: boolean) => void
  onFormChange: (form: CourseAttemptFormState) => void
  onSave: () => void
}) {
  const acceptsGrade = form.evaluationMode === 'GRADE_AND_ATTENDANCE'
  const statuses = form.evaluationMode
    ? statusesByEvaluationMode[form.evaluationMode]
    : []
  const update = (value: Partial<CourseAttemptFormState>) =>
    onFormChange({ ...form, ...value })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {form.editingAttemptId
              ? 'Editar tentativa'
              : 'Adicionar disciplina'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field>
            <FieldLabel>Período letivo</FieldLabel>
            <AutocompleteSelect
              ariaLabel="Período letivo"
              value={form.studyPeriodId}
              options={mostRecentStudyPeriodsFirst(periods).map((period) => ({
                value: String(period.id),
                label: studyPeriodLabel(period),
              }))}
              placeholder="Escolha o período (opcional)"
              onValueChange={(studyPeriodId) =>
                update({
                  studyPeriodId,
                  classId: '',
                  evaluationMode: '',
                  status: '',
                  grade: '',
                })
              }
            />
          </Field>
          {!form.editingAttemptId && (
            <Field>
              <FieldLabel>Disciplina</FieldLabel>
              <AutocompleteSelect
                ariaLabel="Disciplina"
                value={form.courseId}
                options={courses.map((course) => ({
                  value: String(course.id),
                  label: `${course.code} — ${course.name}`,
                }))}
                placeholder="Escolha a disciplina"
                onValueChange={(courseId) =>
                  update({
                    courseId,
                    classId: '',
                    ...(form.studyPeriodId
                      ? { evaluationMode: '', status: '', grade: '' }
                      : {}),
                  })
                }
              />
            </Field>
          )}
          <Field>
            <FieldLabel>Turma</FieldLabel>
            <AutocompleteSelect
              ariaLabel="Turma (opcional)"
              value={form.classId}
              options={classes.map((classData) => ({
                value: String(classData.id),
                label: `Turma ${classData.code}${classData.professors.length ? ` — ${classData.professors.map((professor) => professor.name).join(', ')}` : ''}`,
              }))}
              emptyLabel="Sem turma"
              placeholder={
                form.courseId && form.studyPeriodId
                  ? 'Escolha a turma (opcional)'
                  : 'Escolha disciplina e período primeiro'
              }
              disabled={!form.courseId || !form.studyPeriodId || classesLoading}
              onValueChange={(classId) => update({ classId })}
            />
          </Field>
          <Field>
            <FieldLabel>Modalidade de avaliação</FieldLabel>
            <AutocompleteSelect
              ariaLabel="Modalidade de avaliação"
              value={form.evaluationMode}
              options={evaluationModes.map(([value, label]) => ({
                value,
                label,
              }))}
              placeholder={
                evaluationModeLoading
                  ? 'Carregando modalidade do catálogo'
                  : form.studyPeriodId
                    ? 'Modalidade não encontrada no catálogo'
                    : 'Escolha a modalidade de avaliação'
              }
              disabled={Boolean(form.studyPeriodId) || evaluationModeLoading}
              onValueChange={(value) =>
                update({
                  evaluationMode: value as StudentCourseEvaluationMode,
                  status: '',
                  grade: '',
                })
              }
            />
            {form.studyPeriodId &&
              !evaluationModeLoading &&
              !form.evaluationMode && (
                <InlineMessage>
                  Não há modalidade de avaliação cadastrada para esta disciplina
                  no catálogo do período escolhido.
                </InlineMessage>
              )}
          </Field>
          <Field>
            <FieldLabel>Resultado da tentativa</FieldLabel>
            <AutocompleteSelect
              ariaLabel="Resultado da tentativa"
              value={form.status}
              options={statuses.map(([value, label]) => ({ value, label }))}
              placeholder={
                form.evaluationMode
                  ? 'Escolha o resultado'
                  : 'Aguarde a modalidade de avaliação'
              }
              disabled={!form.evaluationMode}
              onValueChange={(value) =>
                update({
                  status: value as StudentCourseAttemptStatus,
                  ...(!acceptsGrade ? { grade: '' } : {}),
                })
              }
            />
          </Field>
          {acceptsGrade && (
            <Field>
              <FieldLabel htmlFor="course-attempt-grade">
                Nota final (opcional)
              </FieldLabel>
              <Input
                id="course-attempt-grade"
                value={form.grade}
                onChange={(event) => update({ grade: event.target.value })}
                inputMode="decimal"
                aria-invalid={Boolean(gradeError)}
                aria-describedby={
                  gradeError ? 'course-attempt-grade-error' : undefined
                }
              />
              <FieldError id="course-attempt-grade-error">
                {gradeError}
              </FieldError>
            </Field>
          )}
          {operationError && (
            <InlineMessage variant="error">{operationError}</InlineMessage>
          )}
          <Button
            className="w-full"
            disabled={
              !form.status ||
              !form.evaluationMode ||
              Boolean(gradeError) ||
              saving ||
              (!form.editingAttemptId && !form.courseId)
            }
            onClick={onSave}
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
