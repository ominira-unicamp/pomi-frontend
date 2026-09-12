import {
  createFeedbackReportBodyKindValues,
  feedbackReportStatusValues,
  feedbackReportTargetAcademicResourceTypeValues,
  feedbackReportTargetFeatureKeyValues,
} from './generated/app/enums.js'
import type { createFeedbackReportsInput } from './generated/app/operations.js'
import type {
  FeedbackReport as GeneratedFeedbackReport,
  FeedbackReportAccepted,
} from './generated/app/domain.js'
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
export type FeedbackReceipt = FeedbackReportAccepted
export type FeedbackReport = GeneratedFeedbackReport

export const feedbackReportStatuses = feedbackReportStatusValues
export type FeedbackReportStatus = (typeof feedbackReportStatuses)[number]
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
      return client.app.feedbackReports.create(input)
    },
    async submitStudentFeedbackReport(
      { studentId, input }: Required<StudentFeedbackInput>,
      { getAccessToken }: PomiRequestContext,
    ) {
      return client.app.studentFeedbackReports.create(
        studentId,
        input,
        context(getAccessToken!),
      )
    },
    async listStudentFeedbackReports(
      { studentId }: Pick<StudentFeedbackInput, 'studentId'>,
      { getAccessToken }: PomiRequestContext,
    ) {
      return client.app.studentFeedbackReports.list(
        studentId,
        {},
        context(getAccessToken!),
      )
    },
  }
}
