import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { ClassOccurrence } from '@/student/absences/studentAbsences'
import type { StudentAbsence } from '@/student/data/studentAbsenceApi'
import { occurrenceKey } from '@/student/absences/studentAbsences'
import {
  createStudentAbsence,
  deleteStudentAbsence,
  listStudentAbsences,
} from '@/student/data/studentAbsenceApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function studentAbsencesQueryKey(
  sessionSubject: string,
  studentId: number | undefined,
) {
  return privateQueryKeys.absences(sessionSubject, studentId)
}

export function useStudentAbsences(
  studentId: number | undefined,
  getAccessToken: () => Promise<string>,
  enabled = true,
) {
  const auth = useOptionalAuth()
  const queryClient = useQueryClient()
  const queryKey = studentAbsencesQueryKey(
    auth.sessionSubject ?? 'unknown-session',
    studentId,
  )
  const query = useQuery({
    queryKey,
    queryFn: () => listStudentAbsences(studentId!, getAccessToken),
    enabled: Boolean(studentId && enabled),
  })
  const createMutation = useMutation({
    mutationFn: (occurrence: ClassOccurrence) =>
      createStudentAbsence(
        studentId!,
        {
          courseAttemptId: occurrence.courseAttemptId,
          classScheduleId: occurrence.classScheduleId,
          date: occurrence.date,
        },
        getAccessToken,
      ),
    onSuccess: (created) => {
      queryClient.setQueryData<ReadonlyArray<StudentAbsence>>(
        queryKey,
        (current = []) => [
          created,
          ...current.filter((absence) => absence.id !== created.id),
        ],
      )
      void queryClient.invalidateQueries({ queryKey })
    },
  })
  const removeMutation = useMutation({
    mutationFn: ({ absence }: { absence: StudentAbsence }) =>
      deleteStudentAbsence(studentId!, absence.id, getAccessToken),
    onSuccess: (_, { absence }) => {
      queryClient.setQueryData<ReadonlyArray<StudentAbsence>>(
        queryKey,
        (current = []) => current.filter((item) => item.id !== absence.id),
      )
      void queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    absences: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    markAbsent: createMutation.mutateAsync,
    removeAbsence: (absence: StudentAbsence) =>
      removeMutation.mutateAsync({ absence }),
    isPending(occurrence: ClassOccurrence) {
      const createPending =
        createMutation.isPending &&
        occurrenceKey(createMutation.variables) === occurrenceKey(occurrence)
      const removePending =
        removeMutation.isPending &&
        occurrenceKey({
          courseAttemptId:
            removeMutation.variables.absence.studentCourseAttemptId,
          classScheduleId: removeMutation.variables.absence.classScheduleId,
          date: removeMutation.variables.absence.date,
        }) === occurrenceKey(occurrence)
      return Boolean(createPending || removePending)
    },
  }
}

export type StudentAbsenceController = ReturnType<typeof useStudentAbsences>
