export type StudyPeriodYearPeriod =
  | 'FIRST_SEMESTER'
  | 'SECOND_SEMESTER'
  | 'SUMMER'
  | 'WINTER'

export type StudyPeriodReference = Readonly<{
  year: number
  yearPeriod: StudyPeriodYearPeriod
}>

export function studyPeriodCode(period: StudyPeriodReference) {
  const suffix: Record<StudyPeriodYearPeriod, string> = {
    FIRST_SEMESTER: 's1',
    SECOND_SEMESTER: 's2',
    SUMMER: 'v',
    WINTER: 'i',
  }
  return `${period.year}${suffix[period.yearPeriod]}`
}

export function studyPeriodLabel(period: StudyPeriodReference) {
  return studyPeriodCode(period)
}

export function studyPeriodFromCode(code: string): StudyPeriodReference | null {
  const match = /^(\d{4})s([12])$/i.exec(code.trim())
  if (!match) return null
  return {
    year: Number(match[1]),
    yearPeriod: match[2] === '1' ? 'FIRST_SEMESTER' : 'SECOND_SEMESTER',
  }
}

export function previousSemester(
  period: Pick<StudyPeriodReference, 'year' | 'yearPeriod'>,
): Readonly<{
  year: number
  yearPeriod: 'FIRST_SEMESTER' | 'SECOND_SEMESTER'
}> | null {
  if (period.yearPeriod === 'FIRST_SEMESTER')
    return { year: period.year - 1, yearPeriod: 'SECOND_SEMESTER' }
  if (period.yearPeriod === 'SECOND_SEMESTER')
    return { year: period.year, yearPeriod: 'FIRST_SEMESTER' }
  return null
}
