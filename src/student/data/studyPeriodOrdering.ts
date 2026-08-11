type StudyPeriodOption = Readonly<{
  startDate: string
  code: string
}>

export function mostRecentStudyPeriodsFirst<T extends StudyPeriodOption>(
  periods: ReadonlyArray<T>,
) {
  return [...periods].sort(
    (left, right) =>
      right.startDate.localeCompare(left.startDate) ||
      right.code.localeCompare(left.code),
  )
}
