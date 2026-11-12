import {
  feedbackAcademicResourceTypeValues,
  feedbackFeatureKeyValues,
  feedbackKindValues,
  feedbackStatusValues,
} from '@ominira/pomi-sdk/generated/app'
import type {
  FeedbackReport,
  FeedbackReportAccepted,
  createFeedbackReportInput,
} from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

export type { FeedbackReport }
export type FeedbackReportInput = Readonly<createFeedbackReportInput['body']>
export type FeedbackKind = FeedbackReportInput['kind']
export type FeedbackTarget = FeedbackReportInput['target']
export type FeedbackReceipt = FeedbackReportAccepted
export type FeedbackFeatureKey = (typeof feedbackFeatureKeyValues)[number]
export type FeedbackAcademicResourceType =
  (typeof feedbackAcademicResourceTypeValues)[number]
export type FeedbackReportStatus = (typeof feedbackStatusValues)[number]
export const feedbackKinds = feedbackKindValues
export const feedbackFeatureKeys = feedbackFeatureKeyValues
export const feedbackAcademicResourceTypes = feedbackAcademicResourceTypeValues
export const feedbackReportStatuses = feedbackStatusValues

type GetAccessToken = () => Promise<string>

export function submitAnonymousFeedbackReport(input: FeedbackReportInput) {
  return pomiSdk.app.feedbackReports.create(input)
}

export function submitUserFeedbackReport(
  userId: number,
  input: FeedbackReportInput,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.feedbackReports.createForUser(userId, input, {
    getAccessToken,
  })
}

export function listUserFeedbackReports(
  userId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.feedbackReports.listForUserAll(
    userId,
    {},
    {
      getAccessToken,
    },
  )
}
