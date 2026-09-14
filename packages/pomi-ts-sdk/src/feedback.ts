import {
  feedbackAcademicResourceTypeValues,
  feedbackFeatureKeyValues,
  feedbackKindValues,
  feedbackStatusValues,
} from './generated/app/enums.js'
import type { createFeedbackReportInput } from './generated/app/operations.js'
import type {
  FeedbackReportAccepted,
  FeedbackReport as GeneratedFeedbackReport,
} from './generated/app/domain.js'
import type { PomiRequestContext, PomiSdkClient } from './generatedClient.js'

export const feedbackKinds = feedbackKindValues
export type FeedbackReportInput = Readonly<createFeedbackReportInput['body']>
export type FeedbackKind = FeedbackReportInput['kind']

export const feedbackFeatureKeys = feedbackFeatureKeyValues
export type FeedbackFeatureKey = (typeof feedbackFeatureKeys)[number]

export const feedbackAcademicResourceTypes =
  feedbackAcademicResourceTypeValues
export type FeedbackAcademicResourceType =
  (typeof feedbackAcademicResourceTypes)[number]

export type FeedbackTarget = FeedbackReportInput['target']
export type FeedbackReceipt = FeedbackReportAccepted
export type FeedbackReport = GeneratedFeedbackReport

export const feedbackReportStatuses = feedbackStatusValues
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
      return client.app.feedbackReports.createForStudent(
        studentId,
        input,
        context(getAccessToken!),
      )
    },
    async listStudentFeedbackReports(
      { studentId }: Pick<StudentFeedbackInput, 'studentId'>,
      { getAccessToken }: PomiRequestContext,
    ) {
      return client.app.feedbackReports.listAll(
        studentId,
        {},
        context(getAccessToken!),
      )
    },
  }
}
