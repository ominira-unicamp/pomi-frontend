import type { StudentCourseAttempt } from '@/academic-record/data/studentApi'
import type { StudyPeriodYearPeriod } from '@/catalog/model/studyPeriod'
import { studyPeriodLabel } from '@/catalog/model/studyPeriod'

const studyPeriodSortOrder: Readonly<Record<StudyPeriodYearPeriod, number>> = {
  SUMMER: 0,
  FIRST_SEMESTER: 1,
  WINTER: 2,
  SECOND_SEMESTER: 3,
}

export type CourseHistoryGroup = Readonly<{
  key: string
  label: string
  period?: Readonly<{ year: number; yearPeriod: StudyPeriodYearPeriod }>
  attempts: ReadonlyArray<StudentCourseAttempt>
}>

export function groupCourseHistory(
  attempts: ReadonlyArray<StudentCourseAttempt>,
): ReadonlyArray<CourseHistoryGroup> {
  const entries = new Map<string, CourseHistoryGroup>()
  for (const attempt of attempts) {
    if (attempt.status === 'ENROLLED') continue
    const period = attempt.studyPeriod
      ? {
          year: attempt.studyPeriod.year,
          yearPeriod: attempt.studyPeriod.yearPeriod,
        }
      : undefined
    const key = period
      ? `${period.year}:${period.yearPeriod}`
      : 'unknown-period'
    const entry = entries.get(key)
    entries.set(key, {
      key,
      label: period ? studyPeriodLabel(period) : 'Período não informado',
      period,
      attempts: [...(entry?.attempts ?? []), attempt],
    })
  }
  return [...entries.values()].sort((left, right) => {
    if (!left.period) return right.period ? 1 : 0
    if (!right.period) return -1
    return (
      right.period.year - left.period.year ||
      studyPeriodSortOrder[right.period.yearPeriod] -
        studyPeriodSortOrder[left.period.yearPeriod]
    )
  })
}

export function parseGrade(value: string) {
  const normalized = value.trim().replace(',', '.')
  const numeric = normalized ? Number(normalized) : null
  const error =
    numeric !== null &&
    (!Number.isFinite(numeric) || numeric < 0 || numeric > 10)
      ? 'Informe uma nota entre 0 e 10.'
      : undefined
  return { numeric, error }
}

export {
  evaluationModes,
  statusesByEvaluationMode,
  labelForStatus,
} from '@/academic-record/model/courseAttemptStatus'
