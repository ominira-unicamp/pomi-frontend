import { Check, LoaderCircle } from 'lucide-react'
import { useState } from 'react'

import type { ClassOccurrence } from '@/features/student/absences/studentAbsences'
import type { StudentAbsenceController } from '@/features/student/absences/useStudentAbsences'
import type { StudentAbsence } from '@/features/student/data/studentAbsenceApi'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/api/errors'

type StudentAbsenceActionProps = Readonly<{
  occurrence: ClassOccurrence
  absence: StudentAbsence | undefined
  controller: StudentAbsenceController
  disabled?: boolean
  onRegistered?: (absence: StudentAbsence, occurrence: ClassOccurrence) => void
  onRemoved?: (occurrence: ClassOccurrence) => void
}>

function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const path = error.problem?.fields?.[0]?.path.at(-1)
    if (error.status === 409) return 'Essa falta já foi registrada.'
    if (path === 'date')
      return 'A data escolhida não corresponde ao dia dessa aula.'
    if (path === 'classScheduleId')
      return 'Esse horário não pertence à turma da disciplina.'
    if (path === 'courseAttemptId')
      return 'A disciplina cursando não foi encontrada.'
    return error.problem?.detail ?? 'Não foi possível atualizar a falta.'
  }
  return 'Não foi possível atualizar a falta.'
}

export function StudentAbsenceAction({
  occurrence,
  absence,
  controller,
  disabled,
  onRegistered,
  onRemoved,
}: StudentAbsenceActionProps) {
  const [error, setError] = useState<string>()
  const pending = controller.isPending(occurrence)

  async function toggle() {
    setError(undefined)
    try {
      if (absence) {
        await controller.removeAbsence(absence)
        onRemoved?.(occurrence)
      } else {
        const created = await controller.markAbsent(occurrence)
        onRegistered?.(created, occurrence)
      }
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 409) {
        await controller.refetch()
        return
      }
      if (caught instanceof ApiError && caught.status === 404) {
        await controller.refetch()
        setError('Essa falta já havia sido removida.')
        return
      }
      setError(errorMessage(caught))
    }
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <Button
        size="sm"
        variant="outline"
        aria-pressed={Boolean(absence)}
        disabled={disabled || pending}
        onClick={() => void toggle()}
      >
        {pending ? (
          <LoaderCircle className="animate-spin" />
        ) : absence ? (
          <Check />
        ) : null}
        {pending
          ? absence
            ? 'Removendo...'
            : 'Registrando...'
          : absence
            ? 'Falta registrada'
            : 'Eu faltei'}
      </Button>
      {error && (
        <p
          className="max-w-64 text-xs font-semibold text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}
