import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import type {FeedbackReportInput} from '@/feedback/feedbackReportApi';
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  
  submitAnonymousFeedbackReport,
  submitStudentFeedbackReport
} from '@/feedback/feedbackReportApi'
import { useCurrentStudent } from '@/student/hooks/useStudentProfile'
import { FeedbackReportDialog } from '@/feedback/FeedbackReportDialog'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const draftKey = 'pomi.feedback-report.draft'

export type FeedbackDraft = Readonly<{
  input: FeedbackReportInput
  identified: boolean
}>

type FeedbackContextValue = Readonly<{
  openFeedback: (input?: Partial<FeedbackReportInput>) => void
}>

const FeedbackReportContext = createContext<FeedbackContextValue | undefined>(
  undefined,
)

function readDraft() {
  try {
    const raw = window.sessionStorage.getItem(draftKey)
    if (!raw) return undefined
    return JSON.parse(raw) as FeedbackDraft
  } catch {
    return undefined
  }
}

function writeDraft(draft: FeedbackDraft) {
  try {
    window.sessionStorage.setItem(draftKey, JSON.stringify(draft))
  } catch {}
}

function clearDraft() {
  try {
    window.sessionStorage.removeItem(draftKey)
  } catch {}
}

export function FeedbackReportProvider({ children }: { children: ReactNode }) {
  const auth = useOptionalAuth()
  const student = useCurrentStudent()
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<FeedbackDraft | undefined>(() =>
    readDraft(),
  )
  const [open, setOpen] = useState(() => Boolean(readDraft()))
  const mutation = useMutation({
    mutationFn: async (submission: FeedbackDraft) => {
      if (submission.identified) {
        const studentId = student.data?.studentId
        if (!studentId) throw new Error('Student feedback requires a student.')
        return submitStudentFeedbackReport(
          studentId,
          submission.input,
          auth.getAccessToken,
        )
      }
      return submitAnonymousFeedbackReport(submission.input)
    },
  })
  const openFeedback = useCallback(
    (input: Partial<FeedbackReportInput> = {}) => {
      setDraft({
        identified: auth.isAuthenticated && Boolean(student.data?.studentId),
        input: {
          kind: input.kind ?? 'BUG',
          target: input.target ?? { type: 'GENERAL' },
          title: input.title ?? '',
          description: input.description ?? '',
          sourcePath: input.sourcePath ?? window.location.pathname,
        },
      })
      setOpen(true)
    },
    [auth.isAuthenticated, student.data?.studentId],
  )
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen) mutation.reset()
    },
    [mutation],
  )
  const handleSubmit = useCallback(
    async (submission: FeedbackDraft) => {
      await mutation.mutateAsync(submission)
      clearDraft()
      if (student.data?.studentId) {
        await queryClient.invalidateQueries({
          queryKey: privateQueryKeys.feedbackReports(
            auth.sessionSubject ?? 'unknown-session',
            student.data.studentId,
          ),
        })
      }
    },
    [auth.sessionSubject, mutation, queryClient, student.data?.studentId],
  )
  const handleLogin = useCallback(
    (submission: FeedbackDraft) => {
      writeDraft(submission)
      void auth.login(window.location.href)
    },
    [auth],
  )
  const value = useMemo(() => ({ openFeedback }), [openFeedback])

  return (
    <FeedbackReportContext.Provider value={value}>
      {children}
      <FeedbackReportDialog
        open={open}
        onOpenChange={handleOpenChange}
        initialDraft={draft}
        authenticated={auth.isAuthenticated}
        studentId={student.data?.studentId ?? undefined}
        submitting={mutation.isPending}
        error={mutation.error}
        submitted={mutation.isSuccess}
        onSubmit={handleSubmit}
        onLogin={handleLogin}
      />
    </FeedbackReportContext.Provider>
  )
}

export function useFeedbackReport() {
  const context = useContext(FeedbackReportContext)
  return context ?? { openFeedback: () => undefined }
}
