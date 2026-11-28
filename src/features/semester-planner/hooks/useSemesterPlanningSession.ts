import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { guideFromApi } from '@pomi/planner-domain/semester'
import { createSemesterPlanningSession } from '../application/semesterPlanningSession'
import { patchSemesterPlanning } from '../data/semesterPlanningApi'
import type {
  SemesterPlannerStaticData,
  SemesterPlanningDocument,
} from '@pomi/planner-domain/semester'

export function useSemesterPlanningSession({
  data,
  initialDocument,
  identity,
  userId,
  planningId,
  getAccessToken,
  onConfirmed,
}: {
  data?: SemesterPlannerStaticData
  initialDocument: SemesterPlanningDocument
  identity: string
  userId?: number | null
  planningId?: number
  getAccessToken: () => Promise<string>
  onConfirmed: () => void
}) {
  const confirmedRef = useRef(onConfirmed)
  confirmedRef.current = onConfirmed
  const session = useMemo(
    () =>
      data
        ? createSemesterPlanningSession({
            data,
            document: initialDocument,
            onConfirmed: () => confirmedRef.current(),
            save:
              userId && planningId
                ? async (document) => {
                    const saved = await patchSemesterPlanning(
                      userId,
                      planningId,
                      document,
                      getAccessToken,
                    )
                    return {
                      name: saved.name,
                      studyPeriodId: saved.studyPeriodId,
                      curriculumId: saved.curriculumId,
                      classIds: saved.classes.map((item) => item.id),
                      guide: guideFromApi(saved.guide),
                    }
                  }
                : undefined,
          })
        : undefined,
    [Boolean(data), identity, userId, planningId, getAccessToken],
  )
  useEffect(() => {
    session?.activate()
    return () => session?.dispose()
  }, [session])
  useEffect(() => {
    if (data) void session?.updateData(data)
  }, [data, session])
  const state = useSyncExternalStore(
    session?.subscribe ?? noSubscribe,
    session?.getState ?? emptyState,
  )
  return { session, state }
}
const noSubscribe = () => () => undefined
const emptyState = () => undefined
