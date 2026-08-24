type StudyPeriodOption = Readonly<{
  startDate: string
  year: number
  yearPeriod: string
}>

export function mostRecentStudyPeriodsFirst<T extends StudyPeriodOption>(
  periods: ReadonlyArray<T>,
) {
  return [...periods].sort(
    (left, right) =>
      right.startDate.localeCompare(left.startDate) ||
      right.year - left.year || right.yearPeriod.localeCompare(left.yearPeriod),
  )
}
