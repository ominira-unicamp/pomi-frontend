import { createContext, useContext } from 'react'
import type { FeedbackReportInput } from '@/features/feedback/feedbackReportApi'

type FeedbackContextValue = Readonly<{
  openFeedback: (input?: Partial<FeedbackReportInput>) => void
}>

export const FeedbackReportContext = createContext<
  FeedbackContextValue | undefined
>(undefined)

export function useFeedbackReport() {
  const context = useContext(FeedbackReportContext)
  return context ?? { openFeedback: () => undefined }
}
