import type { StudentCourseAttempt } from '@/features/student/data/studentApi'
import type {
  StudentHistoryImport,
  StudentHistoryImportCourse,
} from '@/features/student/historyImport/studentHistoryParser'

export function historyImportPreview(
  value: StudentHistoryImport,
  attempts: ReadonlyArray<StudentCourseAttempt>,
) {
  const seen = new Set<string>()
  return value.semesters.flatMap((semester) =>
    semester.courses.map((course) => {
      const key = `${semester.year}:${semester.yearPeriod}:${course.code}`
      const repeated = seen.has(key)
      seen.add(key)
      const existing = attempts.filter(
        (attempt) =>
          attempt.course.code === course.code &&
          attempt.studyPeriod?.year === semester.year &&
          attempt.studyPeriod.yearPeriod === semester.yearPeriod,
      )
      const same =
        existing.length === 1 &&
        existing[0].status === course.status &&
        existing[0].grade === course.grade &&
        (!course.classCode || existing[0].class?.code === course.classCode)
      return {
        key,
        semester,
        course,
        existing,
        kind: repeated
          ? ('duplicate' as const)
          : existing.length > 1
            ? ('ambiguous' as const)
            : !existing.length
              ? ('new' as const)
              : same
                ? ('unchanged' as const)
                : ('conflict' as const),
      }
    }),
  )
}

export function selectedHistoryImport(
  value: StudentHistoryImport,
  selected: ReadonlySet<string>,
): StudentHistoryImport {
  const sent = new Set<string>()
  return {
    ...value,
    semesters: value.semesters
      .map((semester) => ({
        ...semester,
        courses: semester.courses.filter(
          (course: StudentHistoryImportCourse) => {
            const key = `${semester.year}:${semester.yearPeriod}:${course.code}`
            if (!selected.has(key) || sent.has(key)) return false
            sent.add(key)
            return true
          },
        ),
      }))
      .filter((semester) => semester.courses.length),
  }
}
