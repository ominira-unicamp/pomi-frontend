export const scheduleDays = [
  ['MONDAY', 'Seg'],
  ['TUESDAY', 'Ter'],
  ['WEDNESDAY', 'Qua'],
  ['THURSDAY', 'Qui'],
  ['FRIDAY', 'Sex'],
  ['SATURDAY', 'Sáb'],
] as const

export const scheduleStartHour = 7
export const scheduleEndHour = 23
export const scheduleRowCount = scheduleEndHour - scheduleStartHour

export type GridSelection = Readonly<{
  startDay: number
  endDay: number
  startRow: number
  endRow: number
}>

export function scheduleMinutes(value: string) {
  const [hours, minute] = value.split(':').map(Number)
  return hours * 60 + minute
}

function clamp(value: number, max: number) {
  return Math.max(0, Math.min(max, value))
}

export function selectionFromScheduleFilters(
  selectedDays: ReadonlyArray<string>,
  start: string,
  end: string,
): GridSelection | undefined {
  if (!selectedDays.length && !start && !end) return undefined
  const dayIndexes = selectedDays
    .map((day) => scheduleDays.findIndex(([value]) => value === day))
    .filter((index) => index >= 0)
  const startRow = start
    ? clamp(scheduleMinutes(start) / 60 - scheduleStartHour, scheduleRowCount - 1)
    : 0
  const endRow = end
    ? clamp(scheduleMinutes(end) / 60 - scheduleStartHour, scheduleRowCount)
    : scheduleRowCount
  return {
    startDay: dayIndexes.length ? Math.min(...dayIndexes) : 0,
    endDay: dayIndexes.length ? Math.max(...dayIndexes) : scheduleDays.length - 1,
    startRow: Math.min(startRow, endRow),
    endRow: Math.max(startRow + 1, endRow),
  }
}

export function scheduleCourseColor(code: string) {
  const colors = [
    'border-primary bg-primary/10',
    'border-chart-2 bg-chart-2/10',
    'border-chart-3 bg-chart-3/10',
    'border-chart-4 bg-chart-4/10',
  ]
  return (
    colors[
      [...code].reduce((total, char) => total + char.charCodeAt(0), 0) %
        colors.length
    ] ?? colors[0]
  )
}
