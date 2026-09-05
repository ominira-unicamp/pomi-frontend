import { appApiPublicRequest, appApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'

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

async function responseJson<T>(response: Promise<Response>): Promise<T> {
  const resolvedResponse = await response
  await expectApiResponse(resolvedResponse)
  return (await resolvedResponse.json()) as T
}

export function submitAnonymousFeedbackReport(input: FeedbackReportInput) {
  return responseJson<FeedbackReceipt>(
    appApiPublicRequest('/feedback-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  )
}

export function submitStudentFeedbackReport(
  studentId: number,
  input: FeedbackReportInput,
  getAccessToken: () => Promise<string>,
) {
  return responseJson<FeedbackReceipt>(
    appApiRequest(`/student/${studentId}/feedback-reports`, getAccessToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  )
}

export function listStudentFeedbackReports(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return responseJson<ReadonlyArray<FeedbackReport>>(
    appApiRequest(`/student/${studentId}/feedback-reports`, getAccessToken),
  )
}
