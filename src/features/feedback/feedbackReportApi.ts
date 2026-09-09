import type { FeedbackReportInput } from '@pomi/pomi-ts-sdk/feedback'
import { pomiApi } from '@/api/client'

export type {
  FeedbackAcademicResourceType,
  FeedbackFeatureKey,
  FeedbackKind,
  FeedbackReceipt,
  FeedbackReport,
  FeedbackReportInput,
  FeedbackReportStatus,
  FeedbackTarget,
} from '@pomi/pomi-ts-sdk/feedback'

export {
  feedbackAcademicResourceTypes,
  feedbackFeatureKeys,
  feedbackKinds,
  feedbackReportStatuses,
} from '@pomi/pomi-ts-sdk/feedback'

type GetAccessToken = () => Promise<string>

export function submitAnonymousFeedbackReport(input: FeedbackReportInput) {
  return pomiApi.feedback.submitAnonymousFeedbackReport({ input })
}

export function submitStudentFeedbackReport(
  studentId: number,
  input: FeedbackReportInput,
  getAccessToken: GetAccessToken,
) {
  return pomiApi.feedback.submitStudentFeedbackReport(
    { studentId, input },
    { getAccessToken },
  )
}

export function listStudentFeedbackReports(
  studentId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiApi.feedback.listStudentFeedbackReports(
    { studentId },
    { getAccessToken },
  )
}
