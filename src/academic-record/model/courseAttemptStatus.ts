import type { StudentCourseAttemptStatus, StudentCourseEvaluationMode } from '../data/studentApi'

export const evaluationModes = [
  ['GRADE_AND_ATTENDANCE', 'Nota e frequência'],
  ['ATTENDANCE', 'Frequência'],
  ['CONCEPT', 'Conceito'],
] as const satisfies ReadonlyArray<
  readonly [StudentCourseEvaluationMode, string]
>

export const statusesByEvaluationMode = {
  GRADE_AND_ATTENDANCE: [
    ['ENROLLED', 'Cursando'],
    ['DROPPED', 'Desistida'],
    ['APPROVED', 'Aprovada'],
    ['FAILED_BY_GRADE', 'Reprovada por nota'],
    ['FAILED_BY_ATTENDANCE', 'Reprovada por frequência'],
  ],
  ATTENDANCE: [
    ['ENROLLED', 'Cursando'],
    ['DROPPED', 'Desistida'],
    ['APPROVED_BY_ATTENDANCE', 'Aprovada por frequência'],
    ['FAILED_BY_ATTENDANCE', 'Reprovada por frequência'],
  ],
  CONCEPT: [
    ['ENROLLED', 'Cursando'],
    ['DROPPED', 'Desistida'],
    ['SUFFICIENT', 'Suficiente'],
    ['INSUFFICIENT', 'Insuficiente'],
  ],
} as const satisfies Record<
  StudentCourseEvaluationMode,
  ReadonlyArray<readonly [StudentCourseAttemptStatus, string]>
>

export function labelForStatus(status: StudentCourseAttemptStatus) {
  if (status === 'APPROVED_BY_PROFICIENCY') return 'Aprovada por proficiência'
  return (
    Object.values(statusesByEvaluationMode)
      .flat()
      .find(([value]) => value === status)?.[1] ?? status
  )
}
