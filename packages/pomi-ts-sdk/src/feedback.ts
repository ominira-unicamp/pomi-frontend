import { appApi } from './endpoint'
import type { PomiClient } from './client'

export const feedbackKinds = ['BUG', 'SUGGESTION', 'DATA_ISSUE'] as const
export type FeedbackKind = (typeof feedbackKinds)[number]

export const feedbackFeatureKeys = [
  'home',
  'curriculum-planner',
  'semester-planner',
  'course-situation',
  'agenda',
  'social',
  'academic-data',
] as const
export type FeedbackFeatureKey = (typeof feedbackFeatureKeys)[number]

export const feedbackAcademicResourceTypes = [
  'COURSE',
  'CATALOG_COURSE',
  'CATALOG_PROGRAM',
  'CURRICULUM_SUGGESTION',
  'CLASS',
  'CLASS_SCHEDULE',
  'STUDY_PERIOD',
  'DAILY_MENU',
  'CALENDAR_EVENT',
] as const
export type FeedbackAcademicResourceType =
  (typeof feedbackAcademicResourceTypes)[number]

export type FeedbackTarget =
  | Readonly<{ type: 'GENERAL' }>
  | Readonly<{ type: 'FEATURE'; featureKey: FeedbackFeatureKey }>
  | Readonly<{
      type: 'ACADEMIC_RESOURCE'
      academicResourceType: FeedbackAcademicResourceType
      academicResourceId: number
    }>

export type FeedbackReportInput = Readonly<{
  kind: FeedbackKind
  target: FeedbackTarget
  title: string
  description: string
  sourcePath?: string
}>

export type FeedbackReceipt = Readonly<{ createdAt: string }>

export const feedbackReportStatuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'] as const
export type FeedbackReportStatus = (typeof feedbackReportStatuses)[number]

export type FeedbackReport = Readonly<{
  id: number
  kind: FeedbackKind
  target: FeedbackTarget
  title: string
  description: string
  sourcePath: string | null
  status: FeedbackReportStatus
  adminMessage: string | null
  reporterStudentId: number | null
  createdAt: string
  updatedAt: string
}>

type FeedbackInput = Readonly<{ input: FeedbackReportInput }>
type StudentFeedbackInput = Readonly<{
  studentId: number
  input?: FeedbackReportInput
}>

const publicFeedbackInterface = appApi.public.interface('/feedback-reports')
const studentFeedbackInterface = appApi.authenticated.interface(
  '/student/:studentId/feedback-reports',
)

const publicFeedbackEndpoints = publicFeedbackInterface.define({
  submitAnonymousFeedbackReport: publicFeedbackInterface.post<
    FeedbackReceipt,
    FeedbackInput
  >('', { body: ({ input }) => input }),
})

const studentFeedbackEndpoints = studentFeedbackInterface.define({
  submitStudentFeedbackReport: studentFeedbackInterface.post<
    FeedbackReceipt,
    Required<StudentFeedbackInput>
  >('', { body: ({ input }) => input }),
  listStudentFeedbackReports: studentFeedbackInterface.get<
    ReadonlyArray<FeedbackReport>,
    Pick<StudentFeedbackInput, 'studentId'>
  >(),
})

export function createFeedbackApi(client: PomiClient) {
  return {
    ...client.bind(publicFeedbackEndpoints),
    ...client.bind(studentFeedbackEndpoints),
  }
}
