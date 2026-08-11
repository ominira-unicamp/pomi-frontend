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
import type {
  CurriculumDocument,
  CurriculumSummary,
} from '@/planner/data/curriculumPersistenceApi'
import type { StudentProfile } from '@/student/data/studentApi'
import type { CurriculumDraftBootstrap } from '@/planner/data/planningDraftBootstrap'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { createCurriculumCatalogDataSource } from '@/catalog/data/curriculumCatalogApi'
import {
  createCurriculum,
  deleteCurriculum,
  patchCurriculum,
  stateFromDocument,
} from '@/planner/data/curriculumPersistenceApi'
import { persistCurriculumState } from '@/planner/data/curriculumPersistenceAdapter'
import { curriculumDraftBootstrapKey } from '@/planner/data/planningDraftBootstrap'
import {
  getCurrentStudent,
  registerCurrentStudent,
  setCourseCompleted,
} from '@/student/data/studentApi'
import { useCurriculumRemoteData } from '@/planner/hooks/useCurriculumRemoteData'
import { suggestionOnboardingPreferenceKey } from '@/planner/data/curriculumSuggestionApi'
import { createInMemoryCurriculumPlanner } from '@/planner/domain/inMemoryCurriculumPlanner'

const staticDataKey = ['curriculum-planner', 'static-data'] as const
const snapshotKey = ['curriculum-planner', 'snapshot'] as const

class PlannerResultError extends Error {
  constructor(readonly plannerError: PlannerError) {
    super(plannerError.code)
  }
}

async function unwrap<T>(
  operation: Promise<
    { ok: true; value: T } | { ok: false; error: PlannerError }
  >,
) {
  const result = await operation
  if (!result.ok) throw new PlannerResultError(result.error)
  return result.value
}

export type CurriculumPlannerContextValue = Readonly<{
  staticData?: CurriculumPlannerStaticData
  snapshot?: CurriculumPlannerSnapshot
  isLoading: boolean
  isDispatching: boolean
  isAuthenticationReady: boolean
  isAuthenticated: boolean
  saveStatus: 'idle' | 'pending' | 'saving' | 'error'
  error?: PlannerError
  dispatch: (command: CurriculumPlannerCommand) => Promise<boolean>
  retry: () => Promise<void>
  resetLocalPlan: () => Promise<void>
  curricula: ReadonlyArray<CurriculumSummary>
  activeCurriculumId?: number
  selectCurriculum: (id: number) => void
  createCurriculumPlan: (name?: string) => Promise<number | undefined>
  saveDraft: () => Promise<number | undefined>
  draftName?: string
  setDraftName: (name?: string) => void
  renameCurriculum: (name: string) => Promise<boolean>
  setCurriculumFavorite: (
    curriculumId: number,
    isFavorite: boolean,
  ) => Promise<boolean>
  deleteCurriculumPlan: () => Promise<boolean>
  entryState: 'selection' | 'editing'
  openAnonymousDraft: () => void
  backToSelection: () => void
  actionError?: string
  studentProfile?: StudentProfile
}>

const CurriculumPlannerContext = createContext<
  CurriculumPlannerContextValue | undefined
>(undefined)

function createDefaultPlanner(
  initialState?: Parameters<
    typeof createInMemoryCurriculumPlanner
  >[0]['initialState'],
) {
  return createInMemoryCurriculumPlanner({
    staticDataSource: createCurriculumCatalogDataSource(),
    initialState: initialState ?? {
      revision: crypto.randomUUID() as PlannerRevision,
      selection: {},
      plan: { periods: [], unallocatedCourseIds: [] },
      academicRecord: { completedCourses: [] },
    },
  })
}

export function CurriculumPlannerProvider({
  children,
  planner: injectedPlanner,
}: {
  children: ReactNode
  planner?: CurriculumPlanner
}) {
  const auth = useOptionalAuth()
  const queryClient = useQueryClient()
  const [draftBootstrap] = useState(() =>
    queryClient.getQueryData<CurriculumDraftBootstrap>(
      curriculumDraftBootstrapKey,
    ),
  )
  const [generation, setGeneration] = useState(0)
  const [activeCurriculumId, setActiveCurriculumId] = useState<number>()
  const [entryState, setEntryState] = useState<'selection' | 'editing'>(
    injectedPlanner ? 'editing' : 'selection',
  )
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'pending' | 'saving' | 'error'
  >('idle')
  const [actionError, setActionError] = useState<string>()
  const [draftName, setDraftName] = useState<string | undefined>(
    draftBootstrap?.name,
  )
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const saveQueue = useRef(Promise.resolve())
  const remoteDocument = useRef<CurriculumDocument | undefined>(undefined)

  const { remoteQuery, studentProfileQuery } = useCurriculumRemoteData({
    isAuthenticated: auth.isAuthenticated,
    authInitialized: auth.initialized,
    injected: Boolean(injectedPlanner),
    generation,
    activeCurriculumId,
    getAccessToken: auth.getAccessToken,
  })
  useEffect(() => {
    const summaries = remoteQuery.data?.summaries
    if (!summaries) return
    if (summaries.length === 0) {
      setActiveCurriculumId(undefined)
      return
    }
    if (
      activeCurriculumId !== undefined &&
      !summaries.some((summary) => summary.id === activeCurriculumId)
    )
      setActiveCurriculumId(undefined)
  }, [activeCurriculumId, remoteQuery.data?.summaries])

  const initialState = useMemo(
    () =>
      remoteQuery.data?.document
        ? stateFromDocument(
            remoteQuery.data.document,
            remoteQuery.data.completed,
          )
        : draftBootstrap?.state,
    [draftBootstrap?.state, remoteQuery.data],
  )
  const planner = useMemo(
    () => injectedPlanner ?? createDefaultPlanner(initialState),
    [generation, injectedPlanner, initialState],
  )
  useEffect(() => {
    remoteDocument.current = remoteQuery.data?.document
  }, [remoteQuery.data?.document])
  useEffect(() => {
    if (draftBootstrap)
      queryClient.removeQueries({ queryKey: curriculumDraftBootstrapKey })
  }, [draftBootstrap, queryClient])

  const staticDataQuery = useQuery({
    queryKey: staticDataKey,
    queryFn: () => unwrap(planner.getStaticData()),
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
  const snapshotQuery = useQuery({
    queryKey: [
      ...snapshotKey,
      generation,
      remoteQuery.data?.document?.id ?? 'anonymous',
    ],
    queryFn: () => unwrap(planner.getSnapshot()),
    retry: false,
  })

  const persist = useCallback(
    async (snapshot: CurriculumPlannerSnapshot, name?: string) => {
      if (
        !auth.isAuthenticated ||
        !remoteQuery.data?.studentId ||
        injectedPlanner
      )
        return
      const studentId = remoteQuery.data.studentId
      const state = {
        revision: snapshot.revision,
        selection: snapshot.selection,
        plan: snapshot.plan,
        academicRecord: snapshot.academicRecord,
      }
      const document = await persistCurriculumState({
        studentId,
        current: remoteDocument.current,
        state,
        name,
        getAccessToken: auth.getAccessToken,
      })
      remoteDocument.current = document
      if (!activeCurriculumId) setActiveCurriculumId(document.id)
    },
    [
      auth.getAccessToken,
      auth.isAuthenticated,
      injectedPlanner,
      activeCurriculumId,
      remoteQuery.data?.studentId,
    ],
  )

  const dispatch = useCallback(
    async (command: CurriculumPlannerCommand) => {
      const snapshot = queryClient.getQueryData<CurriculumPlannerSnapshot>([
        ...snapshotKey,
        generation,
        remoteQuery.data?.document?.id ?? 'anonymous',
      ])
      if (!snapshot) return false
      try {
        await unwrap(
          planner.dispatch(command, { expectedRevision: snapshot.revision }),
        )
        const next = await unwrap(planner.getSnapshot())
        queryClient.setQueryData(
          [
            ...snapshotKey,
            generation,
            remoteQuery.data?.document?.id ?? 'anonymous',
          ],
          next,
        )
        if (
          auth.isAuthenticated &&
          remoteQuery.data?.studentId &&
          !injectedPlanner
        ) {
          if (
            command.type === 'markCourseCompleted' ||
            command.type === 'unmarkCourseCompleted'
          ) {
            try {
              await setCourseCompleted(
                remoteQuery.data.studentId,
                command.courseId,
                command.type === 'markCourseCompleted',
                auth.getAccessToken,
                command.type === 'markCourseCompleted'
                  ? {
                      studyPeriodId: command.studyPeriodId,
                      grade: command.grade,
                    }
                  : undefined,
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
    },
    [
      auth.isAuthenticated,
      generation,
      injectedPlanner,
      persist,
      planner,
      queryClient,
      remoteQuery.data?.document?.id,
      remoteQuery.data?.studentId,
    ],
  )

  const retry = useCallback(async () => {
    await Promise.all([
      staticDataQuery.refetch(),
      snapshotQuery.refetch(),
      remoteQuery.refetch(),
    ])
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
    setActiveCurriculumId(undefined)
    setEntryState('editing')
  }, [])
  const backToSelection = useCallback(() => {
    setEntryState('selection')
    if (auth.isAuthenticated) setActiveCurriculumId(undefined)
  }, [auth.isAuthenticated])
  const createCurriculumPlan = useCallback(
    async (name = 'Meu planejamento') => {
      setActionError(undefined)
      if (!auth.isAuthenticated || injectedPlanner) {
        const error = new Error('A criação exige uma sessão autenticada.')
        console.error('[curriculum-planner] create skipped', error)
        setActionError(error.message)
        return undefined
      }
      try {
        let studentId =
          remoteQuery.data?.studentId ??
          (await getCurrentStudent(auth.getAccessToken)).studentId
        if (!studentId) {
          const student = await registerCurrentStudent(
            String(
              auth.profile?.name ??
                auth.profile?.preferred_username ??
                'Estudante',
            ),
            auth.getAccessToken,
          )
          studentId = student.id
        }
        if (!studentId) {
          const error = new Error(
            'A conta autenticada não possui um estudante associado.',
          )
          console.error('[curriculum-planner] create rejected', error)
          setActionError(error.message)
          return undefined
        }
        const created = await createCurriculum(
          studentId,
          {
            name,
            isFavorite: false,
            selection: {
              catalogProgramId: null,
              specializationId: null,
              languageId: null,
            },
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
    },
    [auth.getAccessToken, auth.isAuthenticated, injectedPlanner, remoteQuery],
  )
  const saveDraft = useCallback(async () => {
    if (
      !auth.isAuthenticated ||
      !remoteQuery.data?.studentId ||
      injectedPlanner
    )
      return undefined
    try {
      const snapshot = await unwrap(planner.getSnapshot())
      await persist(snapshot, draftName)
      return remoteDocument.current?.id
    } catch {
      return undefined
    }
  }, [
    auth.isAuthenticated,
    draftName,
    injectedPlanner,
    persist,
    planner,
    remoteQuery.data?.studentId,
  ])
  const renameCurriculum = useCallback(
    async (name: string) => {
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
    },
    [auth.getAccessToken, auth.isAuthenticated, persist, planner, remoteQuery],
  )
  const setCurriculumFavorite = useCallback(
    async (curriculumId: number, isFavorite: boolean) => {
      if (!auth.isAuthenticated || !remoteQuery.data?.studentId) return false
      try {
        const updated = await patchCurriculum(
          remoteQuery.data.studentId,
          curriculumId,
          { isFavorite },
          auth.getAccessToken,
        )
        if (remoteDocument.current?.id === curriculumId)
          remoteDocument.current = updated
        await remoteQuery.refetch()
        return true
      } catch {
        return false
      }
    },
    [auth.getAccessToken, auth.isAuthenticated, remoteQuery],
  )
  const deleteCurriculumPlan = useCallback(async () => {
    if (!auth.isAuthenticated) return false
    if (!remoteDocument.current?.id) {
      setEntryState('selection')
      await resetLocalPlan()
      return true
    }
    if (!remoteQuery.data?.studentId) return false
    try {
      await deleteCurriculum(
        remoteQuery.data.studentId,
        remoteDocument.current.id,
        auth.getAccessToken,
      )
      remoteDocument.current = undefined
      setEntryState('selection')
      setActiveCurriculumId(undefined)
      await remoteQuery.refetch()
      return true
    } catch {
      return false
    }
  }, [auth.getAccessToken, auth.isAuthenticated, remoteQuery, resetLocalPlan])

  const resultError =
    snapshotQuery.error instanceof PlannerResultError
      ? snapshotQuery.error.plannerError
      : undefined
  const value = useMemo<CurriculumPlannerContextValue>(
    () => ({
      staticData: staticDataQuery.data,
      snapshot: snapshotQuery.data,
      isLoading:
        !auth.initialized ||
        staticDataQuery.isLoading ||
        snapshotQuery.isLoading ||
        remoteQuery.isLoading,
      isDispatching: saveStatus === 'saving',
      isAuthenticationReady: auth.initialized,
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
      setCurriculumFavorite,
      deleteCurriculumPlan,
      actionError,
      studentProfile: studentProfileQuery.data,
      entryState,
      openAnonymousDraft,
      backToSelection,
    }),
    [
      actionError,
      studentProfileQuery.data,
      activeCurriculumId,
      auth.initialized,
      auth.isAuthenticated,
      backToSelection,
      createCurriculumPlan,
      deleteCurriculumPlan,
      dispatch,
      draftName,
      entryState,
      openAnonymousDraft,
      renameCurriculum,
      setCurriculumFavorite,
      resetLocalPlan,
      resultError,
      retry,
      remoteQuery.data?.summaries,
      remoteQuery.isLoading,
      saveDraft,
      saveStatus,
      selectCurriculum,
      snapshotQuery.data,
      snapshotQuery.isLoading,
      staticDataQuery.data,
      staticDataQuery.isLoading,
    ],
  )

  return (
    <CurriculumPlannerContext.Provider value={value}>
      {children}
    </CurriculumPlannerContext.Provider>
  )
}

export function useCurriculumPlanner() {
  const context = useContext(CurriculumPlannerContext)
  if (!context)
    throw new Error(
      'useCurriculumPlanner must be used within CurriculumPlannerProvider.',
    )
  return context
}
