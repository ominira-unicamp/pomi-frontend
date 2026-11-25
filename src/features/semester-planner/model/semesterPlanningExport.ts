import { scheduleDays, scheduleMinutes } from '@pomi/planner-domain/semester'
import type {
  ClassMeeting,
  SemesterClass,
  SemesterCourse,
  StudyPeriod,
} from '@pomi/planner-domain/semester'

export type SemesterPlanningExportData = Readonly<{
  name: string
  period: StudyPeriod
  classes: ReadonlyArray<SemesterClass>
  courses: ReadonlyArray<SemesterCourse>
  meetings: ReadonlyArray<ClassMeeting>
}>

export const semesterExportHourHeight = 84

export function buildSemesterPlanningExport(data: SemesterPlanningExportData) {
  const ids = new Set(data.classes.map((item) => item.id))
  const meetings = data.meetings.filter((meeting) => ids.has(meeting.classId))
  const courses = new Map(data.courses.map((course) => [course.id, course]))
  const courseIds = [...new Set(data.classes.map((item) => item.courseId))]
  const entries = data.classes.map((item) => ({
    ...item,
    colorIndex: (courseIds.indexOf(item.courseId) % 4) + 1,
    name: courses.get(item.courseId)?.name ?? item.courseCode,
    credits: courses.get(item.courseId)?.credits,
    meetings: meetings.filter((meeting) => meeting.classId === item.id),
  }))
  const days: ReadonlyArray<readonly [ClassMeeting['dayOfWeek'], string]> =
    meetings.some((meeting) => meeting.dayOfWeek === 'SUNDAY')
      ? [...scheduleDays, ['SUNDAY', 'Dom']]
      : scheduleDays
  const startHour = meetings.length
    ? Math.floor(
        Math.min(...meetings.map((meeting) => scheduleMinutes(meeting.start))) /
          60,
      )
    : 7
  const endHour = meetings.length
    ? Math.max(
        startHour + 1,
        Math.ceil(
          Math.max(...meetings.map((meeting) => scheduleMinutes(meeting.end))) /
            60,
        ),
      )
    : 23
  const conflicts: Array<{ first: ClassMeeting; second: ClassMeeting }> = []
  const blocks = days.flatMap(([day], dayIndex) => {
    const sorted = meetings
      .filter((meeting) => meeting.dayOfWeek === day)
      .sort(
        (a, b) =>
          scheduleMinutes(a.start) - scheduleMinutes(b.start) || a.id - b.id,
      )
    const groups: Array<Array<ClassMeeting>> = []
    let groupEnd = -1
    for (const meeting of sorted) {
      const start = scheduleMinutes(meeting.start)
      if (start >= groupEnd) groups.push([])
      groups[groups.length - 1].push(meeting)
      groupEnd = Math.max(
        start >= groupEnd ? -1 : groupEnd,
        scheduleMinutes(meeting.end),
      )
    }
    return groups.flatMap((group) => {
      const laneEnds: Array<number> = []
      const positioned = group.map((meeting) => {
        let lane = laneEnds.findIndex(
          (end) => end <= scheduleMinutes(meeting.start),
        )
        if (lane < 0) lane = laneEnds.length
        laneEnds[lane] = scheduleMinutes(meeting.end)
        return { meeting, lane }
      })
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          if (
            group[i].classId !== group[j].classId &&
            scheduleMinutes(group[j].start) < scheduleMinutes(group[i].end)
          )
            conflicts.push({ first: group[i], second: group[j] })
        }
      }
      return positioned.map(({ meeting, lane }) => ({
        ...meeting,
        classItem: entries.find((item) => item.id === meeting.classId)!,
        dayIndex,
        lane,
        lanes: laneEnds.length,
        top:
          (scheduleMinutes(meeting.start) - startHour * 60) *
          (semesterExportHourHeight / 60),
        height:
          (scheduleMinutes(meeting.end) - scheduleMinutes(meeting.start)) *
          (semesterExportHourHeight / 60),
        hasConflict: group.some(
          (other) =>
            other.classId !== meeting.classId &&
            scheduleMinutes(other.start) < scheduleMinutes(meeting.end) &&
            scheduleMinutes(meeting.start) < scheduleMinutes(other.end),
        ),
      }))
    })
  })
  return {
    entries,
    blocks,
    conflicts,
    days,
    startHour,
    endHour,
    height: (endHour - startHour) * semesterExportHourHeight,
    credits: [...new Set(data.classes.map((item) => item.courseId))].reduce(
      (total, id) => total + (courses.get(id)?.credits ?? 0),
      0,
    ),
  }
}
