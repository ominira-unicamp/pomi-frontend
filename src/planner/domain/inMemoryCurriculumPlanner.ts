import type {
  AcademicRecord,
  CurriculumBlocks,
  CurriculumDefinition,
  CurriculumPlanner,
  CurriculumPlannerCommand,
  CurriculumPlannerSnapshot,
  CurriculumPlannerState,
  CurriculumPlannerStateStore,
  CurriculumPlannerStaticData,
  CurriculumPlannerStaticDataSource,
  PlannerError,
  PlannerResult,
  PlannerRevision,
  PlanningPeriod,
  PlanningPeriodId,
  PlanningPeriodPosition,
} from './curriculumPlanner'

export type InMemoryCurriculumPlannerOptions = Readonly<{
  staticDataSource: CurriculumPlannerStaticDataSource
  initialState: CurriculumPlannerState
  store?: CurriculumPlannerStateStore
  generateId?: () => string
}>

export type LocalStorageCurriculumPlannerStateStoreOptions = Readonly<{
  key: string
  storage?: Storage
}>

type MutableState = {
  revision: PlannerRevision
  selection: CurriculumPlannerState['selection']
  plan: CurriculumPlannerState['plan']
  academicRecord: AcademicRecord
}

const ok = <T>(value: T): PlannerResult<T> => ({ ok: true, value })
const fail = <T = never>(error: PlannerError): PlannerResult<T> => ({
  ok: false,
  error,
})

const unavailable = () => fail({ code: 'unavailable', retryable: true })
const unexpected = () => fail({ code: 'unexpected', retryable: false })

function clone<T>(value: T): T {
  return structuredClone(value)
}

function notFound(
  entity: PlannerError extends never ? never : string,
  id: string,
) {
  return fail({
    code: 'notFound',
    retryable: false,
    details: {
      entity: entity as Extract<
        PlannerError,
        { code: 'notFound' }
      >['details']['entity'],
      id,
    },
  })
}

function invalidInput(
  field: string,
  reason: 'required' | 'outOfRange' | 'incompatible',
) {
  return fail({
    code: 'invalidInput',
    retryable: false,
    details: { field, reason },
  })
}

function activeCatalog(
  selection: CurriculumPlannerState['selection'],
  staticData: CurriculumPlannerStaticData,
) {
  return staticData.catalogPrograms.find(
    (catalogProgram) => catalogProgram.id === selection.catalogProgramId,
  )
}

function definitionFromState(
  state: MutableState,
  staticData: CurriculumPlannerStaticData,
): CurriculumDefinition | undefined {
  const catalogProgram = activeCatalog(state.selection, staticData)
  if (!catalogProgram) return undefined
  const blocks: Array<CurriculumBlocks> = [catalogProgram.baseBlocks]
  const specialization = catalogProgram.specializations.find(
    (item) => item.id === state.selection.specializationId,
  )
  const language = catalogProgram.languages.find(
    (item) => item.id === state.selection.languageId,
  )
  if (specialization) blocks.push(specialization.blocks)
  if (language) blocks.push(language.blocks)
  return {
    catalogProgramId: catalogProgram.id,
    title: catalogProgram.title,
    requirements: blocks.flatMap((block) => [
      ...block.mandatory,
      ...block.electives,
    ]),
  }
}

function asSnapshot(
  state: MutableState,
  staticData: CurriculumPlannerStaticData,
): CurriculumPlannerSnapshot {
  const curriculum = definitionFromState(state, staticData)
  return {
    ...clone(state),
    ...(curriculum ? { curriculum } : {}),
  }
}

function indexForPosition(
  periods: ReadonlyArray<PlanningPeriod>,
  position: PlanningPeriodPosition,
) {
  if (position.type === 'start') return ok(0)
  if (position.type === 'end') return ok(periods.length)
  const index = periods.findIndex((period) => period.id === position.periodId)
  return index === -1
    ? notFound('planningPeriod', position.periodId)
    : ok(index + 1)
}

function findPeriod(state: MutableState, id: PlanningPeriodId) {
  const index = state.plan.periods.findIndex((period) => period.id === id)
  return index === -1 ? undefined : index
}

function executeCommand(
  state: MutableState,
  command: CurriculumPlannerCommand,
  staticData: CurriculumPlannerStaticData,
  generateId: () => string,
): PlannerResult<MutableState> {
  const next = clone(state)
  const catalogProgram = activeCatalog(next.selection, staticData)
  switch (command.type) {
    case 'selectCatalogProgram': {
      if (
        command.catalogProgramId !== null &&
        !staticData.catalogPrograms.some(
          (item) => item.id === command.catalogProgramId,
        )
      ) {
        return fail({
          code: 'invalidSelection',
          retryable: false,
          details: { field: 'catalogProgramId', id: command.catalogProgramId },
        })
      }
      const selected = command.catalogProgramId ?? undefined
      next.selection = { catalogProgramId: selected }
      if (selected) {
        const selectedProgram = staticData.catalogPrograms.find(
          (item) => item.id === selected,
        )!
        if (
          state.selection.specializationId &&
          selectedProgram.specializations.some(
            (item) => item.id === state.selection.specializationId,
          )
        )
          next.selection = {
            ...next.selection,
            specializationId: state.selection.specializationId,
          }
        if (
          state.selection.languageId &&
          selectedProgram.languages.some(
            (item) => item.id === state.selection.languageId,
          )
        )
          next.selection = {
            ...next.selection,
            languageId: state.selection.languageId,
          }
      }
      return ok(next)
    }
    case 'selectSpecialization': {
      if (command.specializationId === null) {
        next.selection = { ...next.selection, specializationId: undefined }
        return ok(next)
      }
      if (
        !catalogProgram ||
        !catalogProgram.specializations.some(
          (item) => item.id === command.specializationId,
        )
      ) {
        return fail({
          code: 'invalidSelection',
          retryable: false,
          details: { field: 'specializationId', id: command.specializationId },
        })
      }
      next.selection = {
        ...next.selection,
        specializationId: command.specializationId,
      }
      return ok(next)
    }
    case 'selectLanguage': {
      if (command.languageId === null) {
        next.selection = { ...next.selection, languageId: undefined }
        return ok(next)
      }
      if (
        !catalogProgram ||
        !catalogProgram.languages.some((item) => item.id === command.languageId)
      ) {
        return fail({
          code: 'invalidSelection',
          retryable: false,
          details: { field: 'languageId', id: command.languageId },
        })
      }
      next.selection = { ...next.selection, languageId: command.languageId }
      return ok(next)
    }
    case 'importPlanning': {
      const imported = command.data
      if (!isCurriculumPlannerImport(imported))
        return invalidInput('import', 'incompatible')
      const selected = imported.selection.catalogProgramId
        ? staticData.catalogPrograms.find(
            (item) => item.id === imported.selection.catalogProgramId,
          )
        : undefined
      if (
        (imported.selection.catalogProgramId && !selected) ||
        (imported.selection.specializationId &&
          (!selected ||
            !selected.specializations.some(
              (item) => item.id === imported.selection.specializationId,
            ))) ||
        (imported.selection.languageId &&
          (!selected ||
            !selected.languages.some(
              (item) => item.id === imported.selection.languageId,
            )))
      )
        return invalidInput('import', 'incompatible')
      const courseIds = new Set(staticData.courses.map((course) => course.id))
      const importedIds = [
        ...imported.completedCourses,
        ...imported.periods.flatMap((period) => [
          ...period.courses,
          ...(period.completedCourses ?? []),
        ]),
      ]
      if (
        importedIds.some((courseId) => !courseIds.has(courseId)) ||
        new Set(importedIds).size !== importedIds.length
      )
        return invalidInput('import', 'incompatible')
      const periods = imported.periods.map((period) => ({
        id: generateId() as PlanningPeriodId,
        items: period.courses.map((courseId) => ({
          type: 'course' as const,
          courseId,
        })),
      }))
      next.selection = { ...imported.selection }
      next.plan = {
        planningStart: imported.planningStart,
        periods,
      }
      next.academicRecord = {
        completedCourses: [
          ...imported.completedCourses.map((courseId) => ({ courseId })),
          ...imported.periods.flatMap((period) =>
            (period.completedCourses ?? []).map((courseId) => ({ courseId })),
          ),
        ],
      }
      return ok(next)
    }
    case 'addPlanningPeriod': {
      const index = indexForPosition(next.plan.periods, command.position)
      if (!index.ok) return index
      const period: PlanningPeriod = {
        id: generateId() as PlanningPeriodId,
        items: [],
      }
      const periods = [...next.plan.periods]
      periods.splice(index.value, 0, period)
      next.plan = { ...next.plan, periods }
      return ok(next)
    }
    case 'movePlanningPeriod': {
      const index = findPeriod(next, command.periodId)
      if (index === undefined)
        return notFound('planningPeriod', command.periodId)
      if (
        command.position.type === 'after' &&
        command.position.periodId === command.periodId
      )
        return ok(next)
      const periods = [...next.plan.periods]
      const [period] = periods.splice(index, 1)
      const target = indexForPosition(periods, command.position)
      if (!target.ok) return target
      periods.splice(target.value, 0, period)
      next.plan = { ...next.plan, periods }
      return ok(next)
    }
    case 'removePlanningPeriod': {
      const index = findPeriod(next, command.periodId)
      if (index === undefined)
        return notFound('planningPeriod', command.periodId)
      next.plan = {
        ...next.plan,
        currentPeriodId:
          next.plan.currentPeriodId === command.periodId
            ? undefined
            : next.plan.currentPeriodId,
        periods: next.plan.periods.filter(
          (period) => period.id !== command.periodId,
        ),
      }
      return ok(next)
    }
    case 'setCurrentPlanningPeriod': {
      if (
        command.periodId !== null &&
        findPeriod(next, command.periodId) === undefined
      )
        return notFound('planningPeriod', command.periodId)
      next.plan = {
        ...next.plan,
        currentPeriodId: command.periodId ?? undefined,
      }
      return ok(next)
    }
    case 'setPlanningStart': {
      if (
        !Number.isInteger(command.year) ||
        command.year < 1900 ||
        command.year > 9999 ||
        !Number.isInteger(command.semesterNumber) ||
        command.semesterNumber < 1
      )
        return invalidInput('year', 'outOfRange')
      next.plan = {
        ...next.plan,
        planningStart: {
          year: command.year,
          semester: command.semester,
          semesterNumber: command.semesterNumber,
        },
      }
      return ok(next)
    }
    case 'addCourseToPeriod': {
      if (!staticData.courses.some((course) => course.id === command.courseId))
        return notFound('course', command.courseId)
      const index = findPeriod(next, command.periodId)
      if (index === undefined)
        return notFound('planningPeriod', command.periodId)
      if (
        next.plan.periods.some((period) =>
          period.items.some((item) => item.courseId === command.courseId),
        )
      ) {
        return fail({
          code: 'duplicateCourse',
          retryable: false,
          details: { courseId: command.courseId },
        })
      }
      const periods = [...next.plan.periods]
      periods[index] = {
        ...periods[index],
        items: [
          ...periods[index].items,
          { type: 'course', courseId: command.courseId },
        ],
      }
      next.plan = { ...next.plan, periods }
      return ok(next)
    }
    case 'moveCourseToPeriod': {
      const targetIndex = findPeriod(next, command.periodId)
      if (targetIndex === undefined)
        return notFound('planningPeriod', command.periodId)
      const sourceIndex = next.plan.periods.findIndex((period) =>
        period.items.some((item) => item.courseId === command.courseId),
      )
      if (sourceIndex === -1) return notFound('course', command.courseId)
      if (sourceIndex === targetIndex) return ok(next)
      const periods = [...next.plan.periods]
      periods.forEach((period, index) => {
        periods[index] = {
          ...period,
          items: period.items.filter(
            (item) => item.courseId !== command.courseId,
          ),
        }
      })
      periods[targetIndex] = {
        ...periods[targetIndex],
        items: [
          ...periods[targetIndex].items,
          { type: 'course', courseId: command.courseId },
        ],
      }
      next.plan = { ...next.plan, periods }
      return ok(next)
    }
    case 'removeCourseFromPlan': {
      const sourceIndex = next.plan.periods.findIndex((period) =>
        period.items.some((item) => item.courseId === command.courseId),
      )
      if (sourceIndex === -1) return notFound('course', command.courseId)
      const periods = [...next.plan.periods]
      periods[sourceIndex] = {
        ...periods[sourceIndex],
        items: periods[sourceIndex].items.filter(
          (item) => item.courseId !== command.courseId,
        ),
      }
      next.plan = { ...next.plan, periods }
      return ok(next)
    }
    case 'markCourseCompleted': {
      if (!staticData.courses.some((course) => course.id === command.courseId))
        return notFound('course', command.courseId)
      const completedCourses = [...next.academicRecord.completedCourses]
      const index = completedCourses.findIndex(
        (course) => course.courseId === command.courseId,
      )
      const completed = { courseId: command.courseId }
      if (index === -1) completedCourses.push(completed)
      else completedCourses[index] = completed
      next.academicRecord = { completedCourses }
      return ok(next)
    }
    case 'unmarkCourseCompleted': {
      const completedCourses = next.academicRecord.completedCourses.filter(
        (course) => course.courseId !== command.courseId,
      )
      next.academicRecord = { completedCourses }
      return ok(next)
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCurriculumPlannerImport(value: unknown): boolean {
  if (!isRecord(value) || !isRecord(value.selection)) return false
  const selection = value.selection
  if (
    !['catalogProgramId', 'specializationId', 'languageId'].every((field) => {
      const id = selection[field]
      return id === undefined || typeof id === 'string'
    }) ||
    !Array.isArray(value.periods) ||
    !Array.isArray(value.completedCourses) ||
    !value.completedCourses.every((courseId) => typeof courseId === 'string')
  )
    return false
  if (value.planningStart !== undefined) {
    const planningStart = value.planningStart
    if (
      !isRecord(planningStart) ||
      typeof planningStart.year !== 'number' ||
      !Number.isInteger(planningStart.year) ||
      planningStart.year < 1900 ||
      planningStart.year > 9999 ||
      (planningStart.semester !== 1 && planningStart.semester !== 2) ||
      (planningStart.semesterNumber !== undefined &&
        (typeof planningStart.semesterNumber !== 'number' ||
          !Number.isInteger(planningStart.semesterNumber) ||
          planningStart.semesterNumber < 1))
    )
      return false
  }
  return value.periods.every(
    (period) =>
      isRecord(period) &&
      Array.isArray(period.courses) &&
      period.courses.every((courseId) => typeof courseId === 'string') &&
      (period.completedCourses === undefined ||
        (Array.isArray(period.completedCourses) &&
          period.completedCourses.every(
            (courseId) => typeof courseId === 'string',
          ))),
  )
}

function isState(value: unknown): value is CurriculumPlannerState {
  if (
    !isRecord(value) ||
    typeof value.revision !== 'string' ||
    !isRecord(value.selection) ||
    !isRecord(value.plan) ||
    !Array.isArray(value.plan.periods) ||
    !isRecord(value.academicRecord) ||
    !Array.isArray(value.academicRecord.completedCourses)
  )
    return false
  if (value.plan.planningStart !== undefined) {
    const planningStart = value.plan.planningStart
    if (
      !isRecord(planningStart) ||
      typeof planningStart.year !== 'number' ||
      !Number.isInteger(planningStart.year) ||
      planningStart.year < 1900 ||
      planningStart.year > 9999 ||
      (planningStart.semester !== 1 && planningStart.semester !== 2) ||
      (planningStart.semesterNumber !== undefined &&
        (typeof planningStart.semesterNumber !== 'number' ||
          !Number.isInteger(planningStart.semesterNumber) ||
          planningStart.semesterNumber < 1))
    )
      return false
  }
  return value.plan.periods.every(
    (period) =>
      isRecord(period) &&
      typeof period.id === 'string' &&
      Array.isArray(period.items) &&
      period.items.every(
        (item) =>
          isRecord(item) &&
          item.type === 'course' &&
          typeof item.courseId === 'string',
      ),
  )
}

function decodeStoredState(value: unknown): CurriculumPlannerState | undefined {
  if (value === null) return undefined
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.state))
    throw new Error('Invalid stored curriculum planner state')
  const state = clone(value.state)
  if (isRecord(state.plan) && Array.isArray(state.plan.periods)) {
    state.plan = {
      ...state.plan,
      periods: state.plan.periods.map((period) =>
        isRecord(period) && Array.isArray(period.items)
          ? (() => {
              const { label: _label, ...periodWithoutLabel } = period
              return {
                ...periodWithoutLabel,
                items: period.items.filter(
                  (item) =>
                    isRecord(item) &&
                    item.type === 'course' &&
                    typeof item.courseId === 'string',
                ),
              }
            })()
          : period,
      ),
    }
  }
  if (!isState(state))
    throw new Error('Invalid stored curriculum planner state')
  return normalizeState(state)
}

function normalizeState(state: CurriculumPlannerState): CurriculumPlannerState {
  const completedIds = new Set<string>()
  const completedCourses = state.academicRecord.completedCourses.filter(
    (course) => {
      if (completedIds.has(course.courseId)) return false
      completedIds.add(course.courseId)
      return true
    },
  )
  const plannedIds = new Set<string>()
  const periods = state.plan.periods.map((period) => ({
    ...period,
    items: period.items.filter((item) => {
      if (plannedIds.has(item.courseId)) return false
      plannedIds.add(item.courseId)
      return true
    }),
  }))
  return {
    ...state,
    plan: { ...state.plan, periods },
    academicRecord: {
      completedCourses: completedCourses.map((course) => ({
        courseId: course.courseId,
      })),
    },
  }
}

export function createLocalStorageCurriculumPlannerStateStore({
  key,
  storage = window.localStorage,
}: LocalStorageCurriculumPlannerStateStoreOptions): CurriculumPlannerStateStore {
  return {
    read() {
      const raw = storage.getItem(key)
      return Promise.resolve(raw === null ? null : JSON.parse(raw))
    },
    write(state) {
      storage.setItem(key, JSON.stringify(state))
      return Promise.resolve()
    },
    clear() {
      storage.removeItem(key)
      return Promise.resolve()
    },
  }
}

export function createInMemoryCurriculumPlanner({
  staticDataSource,
  initialState,
  store,
  generateId = () => crypto.randomUUID(),
}: InMemoryCurriculumPlannerOptions): CurriculumPlanner {
  let staticDataPromise:
    | Promise<PlannerResult<CurriculumPlannerStaticData>>
    | undefined
  let statePromise: Promise<PlannerResult<MutableState>> | undefined
  let queue = Promise.resolve()

  const loadStaticData = () => {
    if (!staticDataPromise) {
      const loading = staticDataSource
        .load()
        .then((result) => (result.ok ? ok(clone(result.value)) : result))
        .catch(unavailable)
      staticDataPromise = loading
      void loading.then((result) => {
        if (!result.ok && staticDataPromise === loading)
          staticDataPromise = undefined
      })
    }
    return staticDataPromise
  }

  const loadState = () => {
    statePromise ??= (async () => {
      if (!store) return ok(clone(normalizeState(initialState)) as MutableState)
      let raw: unknown | null
      try {
        raw = await store.read()
      } catch {
        return unavailable()
      }
      try {
        const stored = decodeStoredState(raw)
        return ok(clone(stored ?? initialState) as MutableState)
      } catch {
        return unexpected()
      }
    })()
    return statePromise
  }

  const enqueue = <T>(work: () => Promise<T>) => {
    const result = queue.then(work, work)
    queue = result.then(
      () => undefined,
      () => undefined,
    )
    return result
  }

  return {
    getStaticData: async () => {
      const result = await loadStaticData()
      return result.ok ? ok(clone(result.value)) : result
    },
    getSnapshot: () =>
      enqueue(async () => {
        const [staticResult, stateResult] = await Promise.all([
          loadStaticData(),
          loadState(),
        ])
        if (!staticResult.ok) return staticResult
        if (!stateResult.ok) return stateResult
        return ok(clone(asSnapshot(stateResult.value, staticResult.value)))
      }),
    dispatch: (command, context) =>
      enqueue(async () => {
        const [staticResult, stateResult] = await Promise.all([
          loadStaticData(),
          loadState(),
        ])
        if (!staticResult.ok) return staticResult
        if (!stateResult.ok) return stateResult
        const current = stateResult.value
        if (context.expectedRevision !== current.revision)
          return fail({
            code: 'conflict',
            retryable: true,
            details: {
              expectedRevision: context.expectedRevision,
              currentRevision: current.revision,
            },
          })
        const nextResult = executeCommand(
          current,
          command,
          staticResult.value,
          generateId,
        )
        if (!nextResult.ok) return nextResult
        const next = nextResult.value
        if (
          JSON.stringify({ ...next, revision: undefined }) ===
          JSON.stringify({ ...current, revision: undefined })
        )
          return ok(undefined)
        next.revision = generateId() as PlannerRevision
        if (store) {
          try {
            await store.write({ version: 1, state: clone(next) })
          } catch {
            return unavailable()
          }
        }
        statePromise = Promise.resolve(ok(next))
        return ok(undefined)
      }),
  }
}
