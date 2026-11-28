import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createInMemoryCurriculumPlanner } from '@pomi/planner-domain/curriculum'
import {
  createCurriculumPlanningSession,
  unwrapPlannerResult as unwrap,
} from './application/curriculumPlanningSession'
import { createCurriculumSaveCoordinator } from './application/curriculumSaveCoordinator'
import type { ReactNode } from 'react'

import type {
  CurriculumPlanner,
  CurriculumPlannerCommand,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  PlannerError,
  PlannerRevision,
} from '@pomi/planner-domain/curriculum'
import type {
  CurriculumDocument,
  CurriculumSummary,
} from '@/features/curriculum-planner/data/curriculumPersistenceApi'
import type {
  StudentCourseAttempt,
  StudentProfile,
} from '@/academic-record/data/studentApi'
import type { CurriculumDraftBootstrap } from '@/planning-drafts/data/planningDraftBootstrap'
import { requireCurrentUserId } from '@/features/identity/identityApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { createCurriculumCatalogDataSource } from '@/catalog/data/curriculumCatalogApi'
import {
  createCurriculum,
  deleteCurriculum,
  patchCurriculum,
  stateFromDocument,
} from '@/features/curriculum-planner/data/curriculumPersistenceApi'
import { persistCurriculumState } from '@/features/curriculum-planner/data/curriculumPersistenceAdapter'
import { curriculumDraftBootstrapKey } from '@/planning-drafts/data/planningDraftBootstrap'
import { setCourseCompleted } from '@/academic-record/data/studentApi'
import { useCurriculumRemoteData } from '@/features/curriculum-planner/hooks/useCurriculumRemoteData'
import { suggestionOnboardingPreferenceKey } from '@/catalog/data/curriculumSuggestionApi'
import {
  privateQueryKeys,
  publicQueryKeys,
} from '@/integrations/tanstack-query/queryKeys'

import { PendingPlanningChanges } from '@/components/planning/PendingPlanningChanges'

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
  studentCourseAttempts: ReadonlyArray<StudentCourseAttempt>
  studentCourseAttemptsLoading: boolean
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
  routeCurriculumId,
  routeShowsSelection = false,
}: {
  children: ReactNode
  planner?: CurriculumPlanner
  routeCurriculumId?: string
  routeShowsSelection?: boolean
}) {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'anonymous-session'
  const queryClient = useQueryClient()
  const [draftBootstrap] = useState(() =>
    queryClient.getQueryData<CurriculumDraftBootstrap>(
      curriculumDraftBootstrapKey,
    ),
  )
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<number>()
  const [entryState, setEntryState] = useState<'selection' | 'editing'>(
    injectedPlanner ? 'editing' : 'selection',
  )
  const [actionError, setActionError] = useState<string>()
  const [draftName, setDraftName] = useState<string | undefined>(
    draftBootstrap?.name,
  )
  const remoteDocument = useRef<CurriculumDocument | undefined>(undefined)
  const persistedPeriodIds = useRef(new Map<string, number>())

  const routeCurriculumNumber = Number(routeCurriculumId)
  const routedCurriculumId = Number.isInteger(routeCurriculumNumber)
    ? routeCurriculumNumber
    : undefined
  const activeCurriculumId = routedCurriculumId ?? selectedCurriculumId
  const effectiveEntryState = routeShowsSelection
    ? 'selection'
    : routeCurriculumId
      ? 'editing'
      : entryState

  const { remoteQuery, studentProfileQuery, attemptsQuery } =
    useCurriculumRemoteData({
      isAuthenticated: auth.isAuthenticated,
      authInitialized: auth.initialized,
      injected: Boolean(injectedPlanner),
      activeCurriculumId,
      getAccessToken: auth.getAccessToken,
    })
  useEffect(() => {
    const summaries = remoteQuery.data?.summaries
    if (!summaries) return
    if (summaries.length === 0) {
      setSelectedCurriculumId(undefined)
      return
    }
    if (
      activeCurriculumId !== undefined &&
      !summaries.some((summary) => summary.id === activeCurriculumId)
    )
      setSelectedCurriculumId(undefined)
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
    [
      injectedPlanner,
      sessionSubject,
      activeCurriculumId,
      Boolean(remoteQuery.data?.document),
    ],
  )
  const documentIdentity = `${sessionSubject}:${activeCurriculumId ?? 'draft'}`
  const previousDocumentIdentity = useRef(documentIdentity)
  useEffect(() => {
    if (previousDocumentIdentity.current !== documentIdentity) {
      previousDocumentIdentity.current = documentIdentity
      remoteDocument.current = undefined
      persistedPeriodIds.current.clear()
    }
    remoteDocument.current ??= remoteQuery.data?.document
  }, [documentIdentity, remoteQuery.data?.document])
  useEffect(() => {
    if (draftBootstrap)
      queryClient.removeQueries({ queryKey: curriculumDraftBootstrapKey })
  }, [draftBootstrap, queryClient])

  const planningSession = useMemo(
    () => createCurriculumPlanningSession(planner),
    [planner, sessionSubject, activeCurriculumId],
  )
  const sessionState = useSyncExternalStore(
    planningSession.subscribe,
    planningSession.getState,
  )

  const staticDataQuery = useQuery({
    queryKey: publicQueryKeys.curriculumCatalog(),
    queryFn: () => unwrap(planner.getStaticData()),
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })
  const persistenceLifetime = useMemo(
    () => ({ active: true }),
    [sessionSubject, activeCurriculumId],
  )
  useEffect(() => {
    persistenceLifetime.active = true
    return () => {
      persistenceLifetime.active = false
    }
  }, [persistenceLifetime])
  const persist = useCallback(
    async (snapshot: CurriculumPlannerSnapshot, name?: string) => {
      if (!auth.isAuthenticated || !remoteQuery.data?.userId || injectedPlanner)
        return
      const userId = remoteQuery.data.userId
      const state = {
        revision: snapshot.revision,
        selection: snapshot.selection,
        plan: snapshot.plan,
        academicRecord: snapshot.academicRecord,
      }
      const document = await persistCurriculumState({
        userId,
        current: remoteDocument.current,
        state,
        periodIds: persistedPeriodIds.current,
        name,
        getAccessToken: auth.getAccessToken,
        onStructurePersisted: (confirmed) => {
          if (!persistenceLifetime.active) return
          remoteDocument.current = confirmed
          for (const [index, period] of state.plan.periods.entries()) {
            const persisted = confirmed.periods.find(
              (item) => item.position === index + 1,
            )
            if (persisted)
              persistedPeriodIds.current.set(period.id, Number(persisted.id))
          }
        },
      })
      if (!persistenceLifetime.active) return
      const mappedIds = new Set(persistedPeriodIds.current.values())
      for (const [index, period] of state.plan.periods.entries()) {
        if (persistedPeriodIds.current.has(period.id)) continue
        const persisted = document.periods.find(
          (candidate) =>
            candidate.position === index + 1 &&
            !mappedIds.has(Number(candidate.id)),
        )
        if (!persisted) continue
        const persistedId = Number(persisted.id)
        persistedPeriodIds.current.set(period.id, persistedId)
        mappedIds.add(persistedId)
      }
      remoteDocument.current = document
      queryClient.setQueryData(
        privateQueryKeys.curriculum(sessionSubject, userId, document.id),
        document,
      )
      if (!activeCurriculumId) setSelectedCurriculumId(document.id)
    },
    [
      auth.getAccessToken,
      auth.isAuthenticated,
      injectedPlanner,
      activeCurriculumId,
      persistenceLifetime,
      queryClient,
      sessionSubject,
      remoteQuery.data?.userId,
    ],
  )

  const persistRef = useRef(persist)
  persistRef.current = persist
  const saveCoordinator = useMemo(
    () => createCurriculumSaveCoordinator((next) => persistRef.current(next)),
    [sessionSubject, activeCurriculumId],
  )
  const saveStatus = useSyncExternalStore(
    saveCoordinator.subscribe,
    saveCoordinator.getStatus,
  )
  const [academicPending, setAcademicPending] = useState(false)
  useEffect(() => {
    setAcademicPending(false)
    setActionError(undefined)
  }, [persistenceLifetime])
  useEffect(() => {
    planningSession.activate()
    return () => planningSession.dispose()
  }, [planningSession])
  useEffect(() => {
    saveCoordinator.activate()
    return () => saveCoordinator.dispose()
  }, [saveCoordinator])

  const dispatch = useCallback(
    async (command: CurriculumPlannerCommand) => {
      try {
        return await planningSession.dispatch(
          command,
          async () => {
            if (
              auth.isAuthenticated &&
              remoteQuery.data?.userId &&
              !injectedPlanner &&
              (command.type === 'markCourseCompleted' ||
                command.type === 'unmarkCourseCompleted')
            ) {
              setAcademicPending(true)
              setActionError(undefined)
              try {
                await setCourseCompleted(
                  remoteQuery.data.userId,
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
                void queryClient.invalidateQueries({
                  queryKey: privateQueryKeys.courseAttempts(
                    sessionSubject,
                    remoteQuery.data.userId,
                  ),
                })
              } catch (error) {
                if (persistenceLifetime.active)
                  setActionError(
                    'Não foi possível atualizar o histórico. A aprovação anterior foi mantida.',
                  )
                throw error
              } finally {
                if (persistenceLifetime.active) setAcademicPending(false)
              }
            }
          },
          (next) => {
            if (
              auth.isAuthenticated &&
              remoteQuery.data?.userId &&
              !injectedPlanner &&
              remoteDocument.current?.id
            )
              saveCoordinator.schedule(next)
          },
        )
      } catch {
        return false
      }
    },
    [
      planningSession,
      saveCoordinator,
      auth.isAuthenticated,
      auth.getAccessToken,
      remoteQuery.data?.userId,
      injectedPlanner,
      persistenceLifetime,
      queryClient,
      sessionSubject,
      activeCurriculumId,
    ],
  )

  const retry = useCallback(async () => {
    if (saveCoordinator.getStatus() === 'error') {
      await saveCoordinator.flush()
      return
    }
    await Promise.all([
      staticDataQuery.refetch(),
      planningSession.refresh(),
      remoteQuery.refetch(),
    ])
  }, [remoteQuery, planningSession, staticDataQuery, saveCoordinator])

  const resetLocalPlan = useCallback(() => {
    window.localStorage.removeItem(suggestionOnboardingPreferenceKey)
    queryClient.removeQueries({
      queryKey: privateQueryKeys.curriculumPlannerSnapshots(sessionSubject),
    })
    return Promise.resolve()
  }, [queryClient, sessionSubject])

  const selectCurriculum = useCallback((id: number) => {
    setDraftName(undefined)
    setSelectedCurriculumId(id)
    setEntryState('editing')
  }, [])
  const openAnonymousDraft = useCallback(() => {
    setSelectedCurriculumId(undefined)
    setEntryState('editing')
  }, [])
  const backToSelection = useCallback(() => {
    setEntryState('selection')
    if (auth.isAuthenticated) setSelectedCurriculumId(undefined)
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
        const userId =
          remoteQuery.data?.userId ??
          (await requireCurrentUserId(auth.getAccessToken))
        const created = await createCurriculum(
          userId,
          {
            name,
            isFavorite: false,
            selection: {
              catalogProgramId: null,
              catalogProgramVariantId: null,
              languageId: null,
            },
            planningStart: null,
            currentPeriodId: null,
            periods: [],
            courses: [],
          },
          auth.getAccessToken,
        )
        if (!persistenceLifetime.active) return undefined
        remoteDocument.current = created
        queryClient.setQueryData(
          privateQueryKeys.curriculum(sessionSubject, userId, created.id),
          created,
        )
        setDraftName(undefined)
        setSelectedCurriculumId(created.id)
        setEntryState('editing')
        await queryClient.invalidateQueries({
          queryKey: privateQueryKeys.curricula(sessionSubject, userId),
        })
        return created.id
      } catch (error) {
        if (!persistenceLifetime.active) return undefined
        console.error('[curriculum-planner] create failed', error)
        setActionError(
          'Não foi possível criar o planejamento. Verifique se sua conta possui a permissão de planejamento.',
        )
        return undefined
      }
    },
    [
      auth.getAccessToken,
      auth.isAuthenticated,
      injectedPlanner,
      persistenceLifetime,
      queryClient,
      remoteQuery.data?.userId,
      sessionSubject,
    ],
  )
  const saveDraft = useCallback(async () => {
    if (!auth.isAuthenticated || !remoteQuery.data?.userId || injectedPlanner)
      return undefined
    try {
      const snapshot = await unwrap(planner.getSnapshot())
      await persist(snapshot, draftName)
      return persistenceLifetime.active ? remoteDocument.current?.id : undefined
    } catch {
      return undefined
    }
  }, [
    auth.isAuthenticated,
    draftName,
    persistenceLifetime,
    injectedPlanner,
    persist,
    planner,
    remoteQuery.data?.userId,
  ])
  const renameCurriculum = useCallback(
    async (name: string) => {
      if (!auth.isAuthenticated || !remoteQuery.data?.userId) return false
      try {
        await planningSession.settled()
        if (!(await saveCoordinator.flush())) return false
        if (!remoteDocument.current?.id) {
          const snapshot = await unwrap(planner.getSnapshot())
          await persist(snapshot)
        }
        if (!remoteDocument.current?.id) return false
        const renamed = await patchCurriculum(
          remoteQuery.data.userId,
          remoteDocument.current.id,
          { name: name.trim() },
          auth.getAccessToken,
        )
        if (!persistenceLifetime.active) return false
        remoteDocument.current = renamed
        queryClient.setQueryData(
          privateQueryKeys.curriculum(
            sessionSubject,
            remoteQuery.data.userId,
            remoteDocument.current.id,
          ),
          remoteDocument.current,
        )
        await queryClient.invalidateQueries({
          queryKey: privateQueryKeys.curricula(
            sessionSubject,
            remoteQuery.data.userId,
          ),
        })
        return true
      } catch {
        return false
      }
    },
    [
      auth.getAccessToken,
      auth.isAuthenticated,
      persist,
      planner,
      planningSession,
      persistenceLifetime,
      saveCoordinator,
      queryClient,
      remoteQuery.data?.userId,
      sessionSubject,
    ],
  )
  const setCurriculumFavorite = useCallback(
    async (curriculumId: number, isFavorite: boolean) => {
      if (!auth.isAuthenticated || !remoteQuery.data?.userId) return false
      try {
        const updated = await patchCurriculum(
          remoteQuery.data.userId,
          curriculumId,
          { isFavorite },
          auth.getAccessToken,
        )
        if (!persistenceLifetime.active) return false
        if (remoteDocument.current?.id === curriculumId)
          remoteDocument.current = updated
        queryClient.setQueryData(
          privateQueryKeys.curriculum(
            sessionSubject,
            remoteQuery.data.userId,
            curriculumId,
          ),
          updated,
        )
        await queryClient.invalidateQueries({
          queryKey: privateQueryKeys.curricula(
            sessionSubject,
            remoteQuery.data.userId,
          ),
        })
        return true
      } catch {
        return false
      }
    },
    [
      auth.getAccessToken,
      auth.isAuthenticated,
      persistenceLifetime,
      queryClient,
      remoteQuery.data?.userId,
      sessionSubject,
    ],
  )
  const deleteCurriculumPlan = useCallback(async () => {
    if (!auth.isAuthenticated) return false
    if (!remoteDocument.current?.id) {
      setEntryState('selection')
      await resetLocalPlan()
      return true
    }
    if (!remoteQuery.data?.userId) return false
    try {
      await planningSession.settled()
      if (!(await saveCoordinator.flush())) return false
      await deleteCurriculum(
        remoteQuery.data.userId,
        remoteDocument.current.id,
        auth.getAccessToken,
      )
      if (!persistenceLifetime.active) return false
      queryClient.removeQueries({
        queryKey: privateQueryKeys.curriculum(
          sessionSubject,
          remoteQuery.data.userId,
          remoteDocument.current.id,
        ),
      })
      remoteDocument.current = undefined
      setEntryState('selection')
      setSelectedCurriculumId(undefined)
      await queryClient.invalidateQueries({
        queryKey: privateQueryKeys.curricula(
          sessionSubject,
          remoteQuery.data.userId,
        ),
      })
      return true
    } catch {
      return false
    }
  }, [
    auth.getAccessToken,
    auth.isAuthenticated,
    queryClient,
    remoteQuery.data?.userId,
    resetLocalPlan,
    persistenceLifetime,
    planningSession,
    saveCoordinator,
    sessionSubject,
  ])

  const value = useMemo<CurriculumPlannerContextValue>(
    () => ({
      staticData: staticDataQuery.data,
      snapshot: sessionState.snapshot,
      isLoading:
        !auth.initialized ||
        staticDataQuery.isLoading ||
        sessionState.loading ||
        remoteQuery.isLoading,
      isDispatching: academicPending,
      isAuthenticationReady: auth.initialized,
      isAuthenticated: auth.isAuthenticated,
      saveStatus,
      error: sessionState.error,
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
      studentCourseAttempts: attemptsQuery.data ?? [],
      studentCourseAttemptsLoading: attemptsQuery.isLoading,
      entryState: effectiveEntryState,
      openAnonymousDraft,
      backToSelection,
    }),
    [
      actionError,
      academicPending,
      attemptsQuery.data,
      attemptsQuery.isLoading,
      studentProfileQuery.data,
      activeCurriculumId,
      auth.initialized,
      auth.isAuthenticated,
      backToSelection,
      createCurriculumPlan,
      deleteCurriculumPlan,
      dispatch,
      draftName,
      effectiveEntryState,
      openAnonymousDraft,
      renameCurriculum,
      setCurriculumFavorite,
      resetLocalPlan,
      sessionState.error,
      retry,
      remoteQuery.data?.summaries,
      remoteQuery.isLoading,
      saveDraft,
      saveStatus,
      selectCurriculum,
      sessionState.snapshot,
      sessionState.loading,
      staticDataQuery.data,
      staticDataQuery.isLoading,
    ],
  )

  return (
    <CurriculumPlannerContext.Provider value={value}>
      <PendingPlanningChanges
        pending={saveStatus !== 'idle' || academicPending}
        flush={async () => {
          await planningSession.settled()
          return saveCoordinator.flush()
        }}
        discard={() => {
          planningSession.dispose()
          saveCoordinator.dispose()
        }}
      />
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
