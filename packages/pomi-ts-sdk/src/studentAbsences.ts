import { appApi } from './endpoint'
import type { PomiClient } from './client'

export type StudyPeriodYearPeriod =
  | 'SUMMER'
  | 'FIRST_SEMESTER'
  | 'WINTER'
  | 'SECOND_SEMESTER'
export type StudentAbsenceDayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export type StudentAbsence = Readonly<{
  id: number
  studentCourseAttemptId: number
  classScheduleId: number
  date: string
  createdAt: string
  updatedAt: string
  studyPeriodId: number
  studyPeriodYear: number
  studyPeriodYearPeriod: StudyPeriodYearPeriod
  courseId: number
  courseCode: string
  classId: number
  classCode: string
  dayOfWeek: StudentAbsenceDayOfWeek
  start: string
  end: string
  _paths: Readonly<{
    self: string
    courseAttempt: string
    classSchedule: string
    class: string
    course: string
    studyPeriod: string
  }>
}>

export type CreateStudentAbsenceInput = Readonly<{
  courseAttemptId: number
  classScheduleId: number
  date: string
}>

type StudentInput = Readonly<{ studentId: number }>
type CreateAbsenceEndpointInput = StudentInput &
  Readonly<{ input: CreateStudentAbsenceInput }>
type DeleteAbsenceEndpointInput = StudentInput & Readonly<{ absenceId: number }>

const studentAbsenceInterface = appApi.authenticated.interface(
  '/student/:studentId/absences',
)
const studentAbsenceEndpoints = studentAbsenceInterface.define({
  listStudentAbsences: studentAbsenceInterface.get<
    ReadonlyArray<StudentAbsence>,
    StudentInput
  >(),
  createStudentAbsence: studentAbsenceInterface.post<
    StudentAbsence,
    CreateAbsenceEndpointInput
  >('', { body: ({ input }) => input }),
  deleteStudentAbsence:
    studentAbsenceInterface.remove<DeleteAbsenceEndpointInput>('/:absenceId'),
})

export function createStudentAbsencesApi(client: PomiClient) {
  return client.bind(studentAbsenceEndpoints)
}
