import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

import type {
  CurriculumPlanner,
  CurriculumPlannerCommand,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStateStore,
  CurriculumPlannerStaticData,
  PlannerError,
  PlannerRevision,
} from '@/lib/curriculumPlanner'
import { createApiCurriculumPlannerStaticDataSource } from '@/lib/curriculumPlannerApi'
import {
  createInMemoryCurriculumPlanner,
  createLocalStorageCurriculumPlannerStateStore,
} from '@/lib/inMemoryCurriculumPlanner'

const staticDataKey = ['curriculum-planner', 'static-data'] as const
const snapshotKey = ['curriculum-planner', 'snapshot'] as const
const storageKey = 'pomi.curriculum-planner.v1'

class PlannerResultError extends Error {
  constructor(readonly plannerError: PlannerError) {
    super(plannerError.code)
  }
}

async function unwrap<T>(operation: Promise<Readonly<{ ok: true; value: T }> | Readonly<{ ok: false; error: PlannerError }>>) {
  const result = await operation
  if (!result.ok) throw new PlannerResultError(result.error)
  return result.value
}

export type CurriculumPlannerContextValue = Readonly<{
  staticData?: CurriculumPlannerStaticData
  snapshot?: CurriculumPlannerSnapshot
  isLoading: boolean
  isDispatching: boolean
  error?: PlannerError
  dispatch: (command: CurriculumPlannerCommand) => Promise<boolean>
  retry: () => Promise<void>
  resetLocalPlan: () => Promise<void>
}>

const CurriculumPlannerContext = createContext<CurriculumPlannerContextValue | undefined>(undefined)

function createDefaultPlanner(store: CurriculumPlannerStateStore) {
  return createInMemoryCurriculumPlanner({
    staticDataSource: createApiCurriculumPlannerStaticDataSource(),
    initialState: {
      revision: crypto.randomUUID() as PlannerRevision,
      selection: {},
      plan: { periods: [] },
      academicRecord: { completedCourses: [] },
    },
    store,
  })
}

export function CurriculumPlannerProvider({
  children,
  planner: injectedPlanner,
}: {
  children: ReactNode
  planner?: CurriculumPlanner
}) {
  const queryClient = useQueryClient()
  const [generation, setGeneration] = useState(0)
  const store = useMemo(
    () => createLocalStorageCurriculumPlannerStateStore({ key: storageKey }),
    [],
  )
  const planner = useMemo(
    () => injectedPlanner ?? createDefaultPlanner(store),
    [generation, injectedPlanner, store],
  )

  const staticDataQuery = useQuery({
    queryKey: [...staticDataKey, generation],
    queryFn: () => unwrap(planner.getStaticData()),
    retry: false,
  })
  const snapshotQuery = useQuery({
    queryKey: [...snapshotKey, generation],
    queryFn: () => unwrap(planner.getSnapshot()),
    retry: false,
  })

  const mutation = useMutation({
    mutationFn: async (command: CurriculumPlannerCommand) => {
      const snapshot = queryClient.getQueryData<CurriculumPlannerSnapshot>([
        ...snapshotKey,
        generation,
      ])
      if (!snapshot) throw new Error('Curriculum planner snapshot is unavailable')
      await unwrap(
        planner.dispatch(command, { expectedRevision: snapshot.revision }),
      )
      return unwrap(planner.getSnapshot())
    },
    onSuccess: (snapshot) => {
      queryClient.setQueryData([...snapshotKey, generation], snapshot)
    },
    onError: (error) => {
      if (
        error instanceof PlannerResultError &&
        error.plannerError.code === 'conflict'
      ) {
        void queryClient.invalidateQueries({
          queryKey: [...snapshotKey, generation],
        })
      }
    },
  })

  const dispatch = useCallback(
    async (command: CurriculumPlannerCommand) => {
      try {
        await mutation.mutateAsync(command)
        return true
      } catch {
        return false
      }
    },
    [mutation],
  )

  const retry = useCallback(async () => {
    await Promise.all([staticDataQuery.refetch(), snapshotQuery.refetch()])
  }, [snapshotQuery, staticDataQuery])

  const resetLocalPlan = useCallback(async () => {
    await store.clear()
    queryClient.removeQueries({ queryKey: staticDataKey })
    queryClient.removeQueries({ queryKey: snapshotKey })
    setGeneration((current) => current + 1)
  }, [queryClient, store])

  const resultError =
    staticDataQuery.error instanceof PlannerResultError
      ? staticDataQuery.error.plannerError
      : snapshotQuery.error instanceof PlannerResultError
        ? snapshotQuery.error.plannerError
        : mutation.error instanceof PlannerResultError
          ? mutation.error.plannerError
          : undefined

  const value = useMemo<CurriculumPlannerContextValue>(
    () => ({
      staticData: staticDataQuery.data,
      snapshot: snapshotQuery.data,
      isLoading: staticDataQuery.isLoading || snapshotQuery.isLoading,
      isDispatching: mutation.isPending,
      error: resultError,
      dispatch,
      retry,
      resetLocalPlan,
    }),
    [
      dispatch,
      mutation.isPending,
      resetLocalPlan,
      resultError,
      retry,
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
  if (!context) {
    throw new Error(
      'useCurriculumPlanner must be used within CurriculumPlannerProvider.',
    )
  }
  return context
}
