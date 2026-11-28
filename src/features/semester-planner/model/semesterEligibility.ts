import type {
  CoursePrerequisiteRule,
  PrerequisiteItem,
} from '@pomi/planner-domain/curriculum'
import type { SemesterClass, StudyPeriod } from '@pomi/planner-domain/semester'
import type { StudentCourseAttempt } from '@/academic-record/data/studentApi'
import { isApprovedStudentCourseAttempt } from '@/academic-record/data/studentApi'

export type RequirementStatus =
  | 'satisfied'
  | 'pending'
  | 'unknown'
  | 'authorization'
export type RequirementResult = Readonly<{
  label: string
  status: RequirementStatus
}>
export type PrerequisiteResult = Readonly<{
  status: RequirementStatus
  label: string
  alternatives: ReadonlyArray<ReadonlyArray<RequirementResult>>
}>
export type ReservationResult = Readonly<{
  status: 'matched' | 'mismatch' | 'empty' | 'unknown'
  label: string
}>

const periodOrder = {
  SUMMER: 0,
  FIRST_SEMESTER: 1,
  WINTER: 2,
  SECOND_SEMESTER: 3,
}
function periodPosition(period: Pick<StudyPeriod, 'year' | 'yearPeriod'>) {
  return period.year * 4 + periodOrder[period.yearPeriod]
}
function combineAll(
  items: ReadonlyArray<RequirementResult>,
): RequirementStatus {
  if (items.some((item) => item.status === 'pending')) return 'pending'
  if (items.some((item) => item.status === 'unknown')) return 'unknown'
  if (items.some((item) => item.status === 'authorization'))
    return 'authorization'
  return 'satisfied'
}

export function evaluateSemesterPrerequisites({
  rule,
  found,
  attempts,
  period,
  courseLabels,
}: {
  rule?: CoursePrerequisiteRule
  found: boolean
  attempts?: ReadonlyArray<StudentCourseAttempt>
  period?: StudyPeriod
  courseLabels: ReadonlyMap<number, string>
}): PrerequisiteResult {
  const unknown = (label: string): PrerequisiteResult => ({
    status: 'unknown',
    label,
    alternatives: [],
  })
  if (!found) return unknown('Disciplina não encontrada no catálogo do aluno')
  if (!rule || rule.alternatives.length === 0)
    return {
      status: 'satisfied',
      label: 'Sem pré-requisitos',
      alternatives: [],
    }
  const evaluate = (item: PrerequisiteItem): RequirementResult => {
    const target = item.target
    if (target.type === 'special')
      return target.requirementType === 'AUTHORIZATION'
        ? { label: 'AA200 · Depende de autorização', status: 'authorization' }
        : {
            label: `Coeficiente de progressão ≥ ${target.value / 100} · Não foi possível verificar`,
            status: 'unknown',
          }
    if (target.type === 'unresolvedCourse')
      return { label: 'Disciplina não identificada', status: 'unknown' }
    const id = Number(target.courseId)
    const label = `${courseLabels.get(id) ?? `Disciplina ${id}`}${target.fulfillment === 'PARTIAL' ? ' · requisito parcial' : ''}`
    if (!attempts || !period) return { label, status: 'unknown' }
    let uncertain = false
    for (const attempt of attempts.filter((entry) => entry.courseId === id)) {
      const approved = isApprovedStudentCourseAttempt(attempt)
      const partial =
        target.fulfillment === 'PARTIAL' && attempt.status === 'FAILED_BY_GRADE'
      const qualifies =
        approved || (partial && attempt.grade !== null && attempt.grade >= 3)
      if (!qualifies) {
        if (partial && attempt.grade === null) uncertain = true
        continue
      }
      if (!attempt.studyPeriod) uncertain = true
      else if (periodPosition(attempt.studyPeriod) < periodPosition(period))
        return { label, status: 'satisfied' }
    }
    return { label, status: uncertain ? 'unknown' : 'pending' }
  }
  const alternatives = rule.alternatives.map((alternative) =>
    alternative.allOf.map(evaluate),
  )
  const states = alternatives.map(combineAll)
  const status = states.includes('satisfied')
    ? 'satisfied'
    : states.includes('authorization')
      ? 'authorization'
      : states.includes('unknown')
        ? 'unknown'
        : 'pending'
  const labels: Record<RequirementStatus, string> = {
    satisfied: 'Pré-requisitos atendidos pelo histórico',
    pending: 'Pré-requisitos pendentes no histórico',
    unknown: 'Pré-requisitos: não foi possível verificar',
    authorization: 'Depende de autorização',
  }
  return { status, label: labels[status], alternatives }
}

export function evaluateSemesterReservations(
  reservations: SemesterClass['reservationPrograms'],
  programId?: number | null,
): ReservationResult {
  if (!reservations)
    return { status: 'unknown', label: 'Reservas indisponíveis' }
  if (reservations.length === 0)
    return { status: 'empty', label: 'Nenhuma reserva informada' }
  if (programId == null)
    return {
      status: 'unknown',
      label: 'Defina seu curso para comparar as reservas',
    }
  return reservations.some((program) => program.id === programId)
    ? { status: 'matched', label: 'Reserva contempla seu curso' }
    : {
        status: 'mismatch',
        label: 'Seu curso não consta nas reservas informadas',
      }
}
