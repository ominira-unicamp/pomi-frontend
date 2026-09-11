import {
  createFeedbackReportBodyKindValues,
  feedbackReportStatusValues,
  feedbackReportTargetAcademicResourceTypeValues,
  feedbackReportTargetFeatureKeyValues,
} from './generated/app/enums.js'
import type {
  createFeedbackReportsInput,
  createFeedbackReportsOutput,
  listStudentFeedbackReportsOutput,
} from './generated/app/operations.js'
import type { PomiRequestContext, PomiSdkClient } from './generatedClient.js'

export const feedbackKinds = createFeedbackReportBodyKindValues
export type FeedbackReportInput = Readonly<createFeedbackReportsInput['body']>
export type FeedbackKind = FeedbackReportInput['kind']

export const feedbackFeatureKeys = feedbackReportTargetFeatureKeyValues
export type FeedbackFeatureKey = (typeof feedbackFeatureKeys)[number]

export const feedbackAcademicResourceTypes =
  feedbackReportTargetAcademicResourceTypeValues
export type FeedbackAcademicResourceType =
  (typeof feedbackAcademicResourceTypes)[number]

export type FeedbackTarget = FeedbackReportInput['target']
export type FeedbackReceipt = Readonly<createFeedbackReportsOutput>

export const feedbackReportStatuses = feedbackReportStatusValues
export type FeedbackReportStatus = (typeof feedbackReportStatuses)[number]
export type FeedbackReport = Readonly<listStudentFeedbackReportsOutput[number]>

type FeedbackInput = Readonly<{ input: FeedbackReportInput }>
type StudentFeedbackInput = Readonly<{
  studentId: number
  input?: FeedbackReportInput
}>

export function createFeedbackApi(client: PomiSdkClient) {
  const context = (
    getAccessToken: () => Promise<string>,
  ): PomiRequestContext => ({
    getAccessToken,
  })
  return {
    async submitAnonymousFeedbackReport({ input }: FeedbackInput) {
      return client.app.createFeedbackReports({ body: input })
    },
    async submitStudentFeedbackReport(
      { studentId, input }: Required<StudentFeedbackInput>,
      { getAccessToken }: PomiRequestContext,
    ) {
      return client.app.createStudentFeedbackReports(
        { sid: String(studentId), body: input },
        context(getAccessToken!),
      )
    },
    async listStudentFeedbackReports(
      { studentId }: Pick<StudentFeedbackInput, 'studentId'>,
      { getAccessToken }: PomiRequestContext,
    ) {
      return client.app.listStudentFeedbackReports(
        { sid: String(studentId) },
        context(getAccessToken!),
      )
    },
  }
}
