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

async function responseJson(response: Promise<Response>) {
  const resolvedResponse = await response
  await expectApiResponse(resolvedResponse)
  return (await resolvedResponse.json()) as FeedbackReceipt
}

export function submitAnonymousFeedbackReport(input: FeedbackReportInput) {
  return responseJson(
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
  return responseJson(
    appApiRequest(`/student/${studentId}/feedback-reports`, getAccessToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  )
}
