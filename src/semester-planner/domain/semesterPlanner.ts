export type SemesterPlannerResult<T = void> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; error: SemesterPlannerError }>

export type SemesterPlannerError =
  | Readonly<{ code: 'notFound'; entity: 'class' | 'studyPeriod'; id: string }>
  | Readonly<{ code: 'classOutsideStudyPeriod'; classId: number }>
  | Readonly<{ code: 'courseAlreadyHasClass'; currentClassId: number }>
  | Readonly<{ code: 'unavailable' }>
  | Readonly<{ code: 'unexpected' }>

export type StudyPeriod = Readonly<{
  id: number
  code: string
  startDate: string
}>

export type SemesterCourse = Readonly<{
  id: number
  code: string
  name: string
  credits: number
}>

export type ClassMeeting = Readonly<{
  id: number
  classId: number
  dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY'
  start: string
  end: string
  roomCode: string
}>

export type SemesterClass = Readonly<{
  id: number
  code: string
  courseId: number
  courseCode: string
  professors: ReadonlyArray<string>
}>

export type SemesterPlannerStaticData = Readonly<{
  studyPeriods: ReadonlyArray<StudyPeriod>
  courses: ReadonlyArray<SemesterCourse>
  classes: ReadonlyArray<SemesterClass>
  meetings: ReadonlyArray<ClassMeeting>
}>

export type SemesterPlanningGuide = Readonly<{
  mode: 'curriculum' | 'program' | 'none'
  curriculum: Readonly<{
    source: 'saved' | 'suggestion' | null
    curriculumId: number | null
    suggestionId: number | null
    suggestionCatalogProgramId: number | null
  }>
  program: Readonly<{
    catalogProgramId: number | null
    specializationId: number | null
    languageId: number | null
  }>
  manualCourseIds: ReadonlyArray<number>
}>

export type SemesterPlanningDocument = Readonly<{
  name: string
  studyPeriodId: number | null
  curriculumId: number | null
  classIds: ReadonlyArray<number>
  guide: SemesterPlanningGuide
}>

export type ScheduleConflict = Readonly<{
  classId: number
  conflictingClassId: number
  dayOfWeek: ClassMeeting['dayOfWeek']
}>

export type SemesterPlannerSnapshot = Readonly<{
  document: SemesterPlanningDocument
  selectedClasses: ReadonlyArray<SemesterClass>
  conflicts: ReadonlyArray<ScheduleConflict>
}>

export type ClassEvaluation = Readonly<{
  classItem: SemesterClass
  meetings: ReadonlyArray<ClassMeeting>
  conflicts: ReadonlyArray<ScheduleConflict>
  replacesClassId?: number
}>

export type SemesterPlannerCommand =
  | Readonly<{ type: 'selectStudyPeriod'; studyPeriodId: number }>
  | Readonly<{ type: 'rename'; name: string }>
  | Readonly<{ type: 'selectCurriculum'; curriculumId: number | null }>
  | Readonly<{ type: 'setGuide'; guide: SemesterPlanningGuide }>
  | Readonly<{ type: 'addClass'; classId: number }>
  | Readonly<{ type: 'replaceClass'; classId: number }>
  | Readonly<{ type: 'removeClass'; classId: number }>
  | Readonly<{ type: 'clearPlanning' }>
  | Readonly<{ type: 'importPlanning'; data: SemesterPlanningDocument }>

export interface SemesterPlanner {
  getStaticData: () => Promise<SemesterPlannerResult<SemesterPlannerStaticData>>
  getSnapshot: () => Promise<SemesterPlannerResult<SemesterPlannerSnapshot>>
  evaluateClass: (
    classId: number,
  ) => Promise<SemesterPlannerResult<ClassEvaluation>>
  dispatch: (command: SemesterPlannerCommand) => Promise<SemesterPlannerResult>
}

export function classMeetings(
  data: SemesterPlannerStaticData,
  classId: number,
) {
  return data.meetings.filter((meeting) => meeting.classId === classId)
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export function scheduleConflicts(
  data: SemesterPlannerStaticData,
  classIds: ReadonlyArray<number>,
): ReadonlyArray<ScheduleConflict> {
  const conflicts: Array<ScheduleConflict> = []
  for (let index = 0; index < classIds.length; index += 1) {
    const classId = classIds[index]
    for (const otherClassId of classIds.slice(index + 1)) {
      for (const meeting of classMeetings(data, classId)) {
        for (const other of classMeetings(data, otherClassId)) {
          if (
            meeting.dayOfWeek === other.dayOfWeek &&
            toMinutes(meeting.start) < toMinutes(other.end) &&
            toMinutes(other.start) < toMinutes(meeting.end)
          ) {
            conflicts.push({
              classId,
              conflictingClassId: otherClassId,
              dayOfWeek: meeting.dayOfWeek,
            })
          }
        }
      }
    }
  }
  return conflicts
}
