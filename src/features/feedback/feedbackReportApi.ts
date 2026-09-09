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

export const {
  submitAnonymousFeedbackReport,
  submitStudentFeedbackReport,
  listStudentFeedbackReports,
} = pomiApi.feedback
