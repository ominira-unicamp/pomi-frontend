import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import type {
  CurriculumPlanner,
  CurriculumPlannerCommand,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlannerError,
  PlannerRevision,
} from '@/planner/domain/curriculumPlanner'
import type { CurriculumDocument } from '@/planner/data/curriculumPersistenceApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { createApiCurriculumPlannerStaticDataSource } from '@/planner/data/curriculumPlannerApi'
import {
  createCurriculum,
  deleteCurriculum,
  documentFromState,
  getCurrentStudent,
  getCurriculum,
  listCompletedCourses,
  listCurricula,
  patchBodyFromState,
  patchCurriculum,
  registerCurrentStudent,
  setCourseCompleted,
  stateFromDocument,
} from '@/planner/data/curriculumPersistenceApi'
import { suggestionOnboardingPreferenceKey } from '@/planner/data/curriculumSuggestionApi'
import { createInMemoryCurriculumPlanner } from '@/planner/domain/inMemoryCurriculumPlanner'

const staticDataKey = ['curriculum-planner', 'static-data'] as const
const snapshotKey = ['curriculum-planner', 'snapshot'] as const

class PlannerResultError extends Error {
  constructor(readonly plannerError: PlannerError) {
    super(plannerError.code)
  }
}

async function unwrap<T>(operation: Promise<{ ok: true; value: T } | { ok: false; error: PlannerError }>) {
  const result = await operation
  if (!result.ok) throw new PlannerResultError(result.error)
  return result.value
}

export type CurriculumPlannerContextValue = Readonly<{
  staticData?: CurriculumPlannerStaticData
  snapshot?: CurriculumPlannerSnapshot
  isLoading: boolean
  isDispatching: boolean
  isAuthenticated: boolean
  saveStatus: 'idle' | 'pending' | 'saving' | 'error'
  error?: PlannerError
  dispatch: (command: CurriculumPlannerCommand) => Promise<boolean>
  retry: () => Promise<void>
  resetLocalPlan: () => Promise<void>
  curricula: ReadonlyArray<{ id: number; name: string }>
  activeCurriculumId?: number
  selectCurriculum: (id: number) => void
  createCurriculumPlan: (name?: string) => Promise<number | undefined>
  saveDraft: () => Promise<number | undefined>
  draftName?: string
  setDraftName: (name?: string) => void
  renameCurriculum: (name: string) => Promise<boolean>
  deleteCurriculumPlan: () => Promise<boolean>
  entryState: 'selection' | 'editing'
  openAnonymousDraft: () => void
  backToSelection: () => void
  actionError?: string
}>

const CurriculumPlannerContext = createContext<CurriculumPlannerContextValue | undefined>(undefined)

function createDefaultPlanner(initialState?: Parameters<typeof createInMemoryCurriculumPlanner>[0]['initialState']) {
  return createInMemoryCurriculumPlanner({
    staticDataSource: createApiCurriculumPlannerStaticDataSource(),
    initialState: initialState ?? {
      revision: crypto.randomUUID() as PlannerRevision,
      selection: {},
      plan: { periods: [], unallocatedCourseIds: [] },
      academicRecord: { completedCourses: [] },
    },
  })
}

export function CurriculumPlannerProvider({ children, planner: injectedPlanner }: { children: ReactNode; planner?: CurriculumPlanner }) {
  const auth = useOptionalAuth()
  const queryClient = useQueryClient()
  const [generation, setGeneration] = useState(0)
  const [activeCurriculumId, setActiveCurriculumId] = useState<number>()
  const [entryState, setEntryState] = useState<'selection' | 'editing'>(
    injectedPlanner ? 'editing' : 'selection',
  )
  const [saveStatus, setSaveStatus] = useState<'idle' | 'pending' | 'saving' | 'error'>('idle')
  const [actionError, setActionError] = useState<string>()
  const [draftName, setDraftName] = useState<string>()
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const saveQueue = useRef(Promise.resolve())
  const remoteDocument = useRef<CurriculumDocument | undefined>(undefined)

  const remoteQuery = useQuery({
    queryKey: ['curriculum-planner', 'remote', auth.isAuthenticated, generation, activeCurriculumId ?? 'first'],
    enabled: auth.initialized && auth.isAuthenticated && !injectedPlanner,
    queryFn: async () => {
      const me = await getCurrentStudent(auth.getAccessToken)
      if (!me.studentId)
        return {
          studentId: undefined,
          summaries: [],
          document: undefined,
          completed: [] as Array<string>,
        }
      const summaries = await listCurricula(me.studentId, auth.getAccessToken)
      if (summaries.length === 0) {
        const completed = await listCompletedCourses(me.studentId, auth.getAccessToken)
        return { studentId: me.studentId, summaries, document: undefined, completed }
      }
      if (activeCurriculumId === undefined) {
        const completed = await listCompletedCourses(me.studentId, auth.getAccessToken)
        return { studentId: me.studentId, summaries, document: undefined, completed }
      }
      const summary = summaries.find((item) => item.id === activeCurriculumId)
      if (!summary) {
        const completed = await listCompletedCourses(me.studentId, auth.getAccessToken)
        return { studentId: me.studentId, summaries, document: undefined, completed }
      }
      const document = await getCurriculum(me.studentId, summary.id, auth.getAccessToken)
      const completed = await listCompletedCourses(me.studentId, auth.getAccessToken)
      return { studentId: me.studentId, summaries, document, completed }
    },
    retry: false,
  })
  useEffect(() => {
    const summaries = remoteQuery.data?.summaries
    if (!summaries) return
    if (summaries.length === 0) {
      setActiveCurriculumId(undefined)
      return
    }
    if (activeCurriculumId !== undefined && !summaries.some((summary) => summary.id === activeCurriculumId))
      setActiveCurriculumId(undefined)
  }, [activeCurriculumId, remoteQuery.data?.summaries])

  const initialState = useMemo(
    () => remoteQuery.data?.document
      ? stateFromDocument(remoteQuery.data.document, remoteQuery.data.completed)
      : undefined,
    [remoteQuery.data],
  )
  const planner = useMemo(
    () => injectedPlanner ?? createDefaultPlanner(initialState),
    [generation, injectedPlanner, initialState],
  )
  useEffect(() => {
    remoteDocument.current = remoteQuery.data?.document
  }, [remoteQuery.data?.document])

  const staticDataQuery = useQuery({
    queryKey: staticDataKey,
    queryFn: () => unwrap(planner.getStaticData()),
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
  const snapshotQuery = useQuery({
    queryKey: [...snapshotKey, generation, remoteQuery.data?.document?.id ?? 'anonymous'],
    queryFn: () => unwrap(planner.getSnapshot()),
    retry: false,
  })

  const persist = useCallback(async (snapshot: CurriculumPlannerSnapshot, name?: string) => {
    if (!auth.isAuthenticated || !remoteQuery.data?.studentId || injectedPlanner) return
    const studentId = remoteQuery.data.studentId
    const state = {
      revision: snapshot.revision,
      selection: snapshot.selection,
      plan: snapshot.plan,
      academicRecord: snapshot.academicRecord,
    }
    if (!remoteDocument.current) {
      const draft = documentFromState(state, name)
      const created = await createCurriculum(
        studentId,
        draft,
        auth.getAccessToken,
      )
      const byPosition = new Map(created.periods.map((period) => [period.position, String(period.id)]))
      const courses = draft.courses.map((course) => {
        const period = draft.periods.find((item) => item.id === course.periodId)
        return {
          courseId: Number(course.courseId),
          periodId: period ? Number(byPosition.get(period.position)) : null,
        }
      })
      remoteDocument.current = await patchCurriculum(
        studentId,
        created.id!,
        { courses: { upsert: courses } },
        auth.getAccessToken,
      )
      setActiveCurriculumId(created.id)
      return
    }
    const previous = remoteDocument.current
    const response = await patchCurriculum(
      studentId,
      remoteDocument.current.id!,
      patchBodyFromState(previous, state),
      auth.getAccessToken,
    )
    remoteDocument.current = response
    const byPosition = new Map(response.periods.map((period) => [period.position, String(period.id)]))
    const nextDocument = documentFromState(state, previous.name)
    const courses = nextDocument.courses.map((course) => {
      const period = nextDocument.periods.find((item) => item.id === course.periodId)
      return { courseId: Number(course.courseId), periodId: period ? Number(byPosition.get(period.position)) : null }
    })
    await patchCurriculum(studentId, response.id!, { courses: { upsert: courses } }, auth.getAccessToken)
  }, [auth.getAccessToken, auth.isAuthenticated, injectedPlanner, remoteQuery.data?.studentId])

  const dispatch = useCallback(async (command: CurriculumPlannerCommand) => {
    const snapshot = queryClient.getQueryData<CurriculumPlannerSnapshot>([
      ...snapshotKey,
      generation,
      remoteQuery.data?.document?.id ?? 'anonymous',
    ])
    if (!snapshot) return false
    try {
      await unwrap(planner.dispatch(command, { expectedRevision: snapshot.revision }))
      const next = await unwrap(planner.getSnapshot())
      queryClient.setQueryData([...snapshotKey, generation, remoteQuery.data?.document?.id ?? 'anonymous'], next)
      if (auth.isAuthenticated && remoteQuery.data?.studentId && !injectedPlanner) {
        if (command.type === 'markCourseCompleted' || command.type === 'unmarkCourseCompleted') {
          try {
            await setCourseCompleted(
              remoteQuery.data.studentId,
              command.courseId,
              command.type === 'markCourseCompleted',
              auth.getAccessToken,
            )
          } catch {
            setSaveStatus('error')
          }
        }
        if (!remoteDocument.current?.id) return true
        setSaveStatus('pending')
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
          saveQueue.current = saveQueue.current.then(async () => {
            setSaveStatus('saving')
            try {
              await persist(next)
              setSaveStatus('idle')
            } catch {
              setSaveStatus('error')
            }
          })
        }, 500)
      }
      return true
    } catch {
      return false
    }
  }, [auth.isAuthenticated, generation, injectedPlanner, persist, planner, queryClient, remoteQuery.data?.document?.id, remoteQuery.data?.studentId])

  const retry = useCallback(async () => {
    await Promise.all([staticDataQuery.refetch(), snapshotQuery.refetch(), remoteQuery.refetch()])
  }, [remoteQuery, snapshotQuery, staticDataQuery])

  const resetLocalPlan = useCallback(() => {
    window.localStorage.removeItem(suggestionOnboardingPreferenceKey)
    queryClient.removeQueries({ queryKey: snapshotKey })
    setGeneration((current) => current + 1)
    return Promise.resolve()
  }, [queryClient])

  const selectCurriculum = useCallback((id: number) => {
    setDraftName(undefined)
    setSaveStatus('idle')
    setActiveCurriculumId(id)
    setEntryState('editing')
    setGeneration((current) => current + 1)
  }, [])
  const openAnonymousDraft = useCallback(() => {
    setDraftName(undefined)
    setActiveCurriculumId(undefined)
    setEntryState('editing')
  }, [])
  const backToSelection = useCallback(() => {
    setEntryState('selection')
    if (auth.isAuthenticated) setActiveCurriculumId(undefined)
  }, [auth.isAuthenticated])
  const createCurriculumPlan = useCallback(async (name = 'Meu planejamento') => {
    setActionError(undefined)
    if (!auth.isAuthenticated || injectedPlanner) {
      const error = new Error('A criação exige uma sessão autenticada.')
      console.error('[curriculum-planner] create skipped', error)
      setActionError(error.message)
      return undefined
    }
    try {
      let studentId = remoteQuery.data?.studentId ??
        (await getCurrentStudent(auth.getAccessToken)).studentId
      if (!studentId) {
        const student = await registerCurrentStudent(
          String(auth.profile?.name ?? auth.profile?.preferred_username ?? 'Estudante'),
          auth.getAccessToken,
        )
        studentId = student.id
      }
      if (!studentId) {
        const error = new Error('A conta autenticada não possui um estudante associado.')
        console.error('[curriculum-planner] create rejected', error)
        setActionError(error.message)
        return undefined
      }
      const created = await createCurriculum(
        studentId,
        {
          name,
          selection: { catalogProgramId: null, specializationId: null, languageId: null },
          planningStart: null,
          currentPeriodId: null,
          periods: [],
          courses: [],
        },
        auth.getAccessToken,
      )
      remoteDocument.current = created
      setDraftName(undefined)
      setActiveCurriculumId(created.id)
      setEntryState('editing')
      setGeneration((current) => current + 1)
      void remoteQuery.refetch()
      return created.id
    } catch (error) {
      console.error('[curriculum-planner] create failed', error)
      setActionError(
        'Não foi possível criar o planejamento. Verifique se sua conta possui a permissão de planejamento.',
      )
      return undefined
    }
  }, [auth.getAccessToken, auth.isAuthenticated, injectedPlanner, remoteQuery])
  const saveDraft = useCallback(async () => {
    if (!auth.isAuthenticated || !remoteQuery.data?.studentId || injectedPlanner)
      return undefined
    try {
      const snapshot = await unwrap(planner.getSnapshot())
      await persist(snapshot, draftName)
      return remoteDocument.current?.id
    } catch {
      return undefined
    }
  }, [auth.isAuthenticated, draftName, injectedPlanner, persist, planner, remoteQuery.data?.studentId])
  const renameCurriculum = useCallback(async (name: string) => {
    if (!auth.isAuthenticated || !remoteQuery.data?.studentId) return false
    try {
      if (!remoteDocument.current?.id) {
        const snapshot = await unwrap(planner.getSnapshot())
        await persist(snapshot)
      }
      if (!remoteDocument.current?.id) return false
      remoteDocument.current = await patchCurriculum(
        remoteQuery.data.studentId,
        remoteDocument.current.id,
        { name: name.trim() },
        auth.getAccessToken,
      )
      await remoteQuery.refetch()
      return true
    } catch {
      return false
    }
  }, [auth.getAccessToken, auth.isAuthenticated, persist, planner, remoteQuery])
  const deleteCurriculumPlan = useCallback(async () => {
    if (!auth.isAuthenticated) return false
    if (!remoteDocument.current?.id) {
      setEntryState('selection')
      await resetLocalPlan()
      return true
    }
    if (!remoteQuery.data?.studentId) return false
    try {
      await deleteCurriculum(remoteQuery.data.studentId, remoteDocument.current.id, auth.getAccessToken)
      remoteDocument.current = undefined
      setEntryState('selection')
      setActiveCurriculumId(undefined)
      await remoteQuery.refetch()
      return true
    } catch {
      return false
    }
  }, [auth.getAccessToken, auth.isAuthenticated, remoteQuery, resetLocalPlan])

  const resultError = snapshotQuery.error instanceof PlannerResultError ? snapshotQuery.error.plannerError : undefined
  const value = useMemo<CurriculumPlannerContextValue>(() => ({
    staticData: staticDataQuery.data,
    snapshot: snapshotQuery.data,
    isLoading: staticDataQuery.isLoading || snapshotQuery.isLoading || remoteQuery.isLoading,
    isDispatching: saveStatus === 'saving',
    isAuthenticated: auth.isAuthenticated,
    saveStatus,
    error: resultError,
    dispatch,
    retry,
    resetLocalPlan,
    curricula: remoteQuery.data?.summaries ?? [],
    activeCurriculumId,
    selectCurriculum,
    createCurriculumPlan,
    saveDraft,
    draftName,
    setDraftName,
    renameCurriculum,
    deleteCurriculumPlan,
    actionError,
      entryState,
      openAnonymousDraft,
      backToSelection,
  }), [actionError, activeCurriculumId, auth.isAuthenticated, backToSelection, createCurriculumPlan, deleteCurriculumPlan, dispatch, draftName, entryState, openAnonymousDraft, renameCurriculum, resetLocalPlan, resultError, retry, remoteQuery.data?.summaries, remoteQuery.isLoading, saveDraft, saveStatus, selectCurriculum, snapshotQuery.data, snapshotQuery.isLoading, staticDataQuery.data, staticDataQuery.isLoading])

  return <CurriculumPlannerContext.Provider value={value}>{children}</CurriculumPlannerContext.Provider>
}

export function useCurriculumPlanner() {
  const context = useContext(CurriculumPlannerContext)
  if (!context) throw new Error('useCurriculumPlanner must be used within CurriculumPlannerProvider.')
  return context
}
