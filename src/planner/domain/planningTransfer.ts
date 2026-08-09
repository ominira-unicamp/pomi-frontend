import type {
  CatalogProgramId,
  Course,
  CourseId,
  CurriculumPlannerImport,
  CurriculumPlannerSnapshot,
  CurriculumPlannerStaticData,
  LanguageId,
  SpecializationId,
} from './curriculumPlanner'

export const planningFileFormat = 'pomi-curriculum-planner'
export const planningFileVersion = 1
export const planningFileMaxBytes = 2 * 1024 * 1024

type SelectionV1 = Readonly<{
  catalogProgramId: number | null
  catalogSpecializationId: number | null
  catalogLanguageId: number | null
  catalogYear: number | null
  programCode: string | null
  programName: string | null
  specializationCode: string | null
  specializationName: string | null
  languageName: string | null
}>

type PeriodV1 = Readonly<{ id: number | null; position: number }>

type CourseV1 = Readonly<{
  courseId: number | null
  periodId: number | null
  periodPosition: number | null
  code: string
  name: string
  credits: number
}>

export type PlanningFileV1 = Readonly<{
  format: typeof planningFileFormat
  version: typeof planningFileVersion
  exportedAt: string
  curriculum: Readonly<{
    name?: string
    selection: SelectionV1
    planningStart: CurriculumPlannerSnapshot['plan']['planningStart'] | null
    currentPeriodId: number | null
    currentPeriodPosition: number | null
    periods: ReadonlyArray<PeriodV1>
    courses: ReadonlyArray<CourseV1>
  }>
}>

export type PlanningImportIssue = Readonly<{
  type: 'course' | 'selection' | 'period' | 'fallback' | 'duplicate'
  message: string
}>

export type ResolvedPlanningImport = Readonly<{
  data: CurriculumPlannerImport
  name?: string
  issues: ReadonlyArray<PlanningImportIssue>
}>

function numericId(value: string | undefined) {
  if (value === undefined) return null
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

function normalized(value: string) {
  return value.trim().normalize('NFC').toLocaleUpperCase('pt-BR')
}

export function serializePlanning(
  snapshot: CurriculumPlannerSnapshot,
  staticData: CurriculumPlannerStaticData,
  options: Readonly<{ exportedAt?: Date; name?: string }> = {},
): PlanningFileV1 {
  const catalogProgram = staticData.catalogPrograms.find(
    (item) => item.id === snapshot.selection.catalogProgramId,
  )
  const specialization = catalogProgram?.specializations.find(
    (item) => item.id === snapshot.selection.specializationId,
  )
  const language = catalogProgram?.languages.find(
    (item) => item.id === snapshot.selection.languageId,
  )
  const positions = new Map(
    snapshot.plan.periods.map((period, index) => [period.id, index + 1]),
  )
  const periodIds = new Map(
    snapshot.plan.periods.map((period) => [period.id, numericId(period.id)]),
  )
  const allocations = new Map<CourseId, number | null>()
  snapshot.plan.periods.forEach((period, index) => {
    period.items.forEach((item) => allocations.set(item.courseId, index + 1))
  })
  for (const courseId of snapshot.plan.unallocatedCourseIds ?? [])
    if (!allocations.has(courseId)) allocations.set(courseId, null)
  const courses = [...allocations.entries()]
    .map(([courseId, periodPosition]) => {
      const course = staticData.courses.find((item) => item.id === courseId)
      if (!course) return undefined
      const period = periodPosition
        ? snapshot.plan.periods[periodPosition - 1]
        : undefined
      return {
        courseId: numericId(course.id),
        periodId: period ? periodIds.get(period.id) ?? null : null,
        periodPosition,
        code: course.code,
        name: course.name,
        credits: course.credits,
      }
    })
    .filter((course): course is CourseV1 => Boolean(course))
    .sort((left, right) => left.code.localeCompare(right.code))
  return {
    format: planningFileFormat,
    version: planningFileVersion,
    exportedAt: (options.exportedAt ?? new Date()).toISOString(),
    curriculum: {
      ...(options.name?.trim() ? { name: options.name.trim() } : {}),
      selection: {
        catalogProgramId: numericId(catalogProgram?.id),
        catalogSpecializationId: numericId(specialization?.id),
        catalogLanguageId: numericId(language?.id),
        catalogYear: catalogProgram?.catalog.year ?? null,
        programCode: catalogProgram?.program.code ?? null,
        programName: catalogProgram?.program.name ?? null,
        specializationCode: specialization?.code ?? null,
        specializationName: specialization?.name ?? null,
        languageName: language?.name ?? null,
      },
      planningStart: snapshot.plan.planningStart ?? null,
      currentPeriodId: snapshot.plan.currentPeriodId
        ? numericId(snapshot.plan.currentPeriodId)
        : null,
      currentPeriodPosition: snapshot.plan.currentPeriodId
        ? positions.get(snapshot.plan.currentPeriodId) ?? null
        : null,
      periods: snapshot.plan.periods.map((period, index) => ({
        id: numericId(period.id),
        position: index + 1,
      })),
      courses,
    },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNullableInteger(value: unknown) {
  return value === null || (typeof value === 'number' && Number.isInteger(value))
}

function isNullablePositiveInteger(value: unknown) {
  return value === null ||
    (typeof value === 'number' && Number.isInteger(value) && value > 0)
}

function isNullableString(value: unknown) {
  return value === null || typeof value === 'string'
}

export function parsePlanning(value: unknown): PlanningFileV1 | undefined {
  if (!isRecord(value) || value.format !== planningFileFormat || value.version !== 1)
    return undefined
  if (
    typeof value.exportedAt !== 'string' ||
    Number.isNaN(Date.parse(value.exportedAt)) ||
    !isRecord(value.curriculum)
  )
    return undefined
  const curriculum = value.curriculum
  const selection = curriculum.selection
  if (!isRecord(selection) || !Array.isArray(curriculum.periods) || !Array.isArray(curriculum.courses))
    return undefined
  if (curriculum.periods.length > 100 || curriculum.courses.length > 5000)
    return undefined
  const selectionFields = [
    'catalogProgramId',
    'catalogSpecializationId',
    'catalogLanguageId',
    'catalogYear',
  ]
  if (!selectionFields.every((field) => isNullableInteger(selection[field])))
    return undefined
  const selectionStrings = [
    'programCode',
    'programName',
    'specializationCode',
    'specializationName',
    'languageName',
  ]
  if (!selectionStrings.every((field) => isNullableString(selection[field])))
    return undefined
  if (
    !isNullableInteger(curriculum.currentPeriodId) ||
    !isNullablePositiveInteger(curriculum.currentPeriodPosition) ||
    !curriculum.periods.every(
      (period) =>
        isRecord(period) &&
        isNullableInteger(period.id) &&
        typeof period.position === 'number' &&
        Number.isInteger(period.position) &&
        period.position > 0,
    ) ||
    !curriculum.courses.every(
      (course) =>
        isRecord(course) &&
        isNullableInteger(course.courseId) &&
        isNullableInteger(course.periodId) &&
        isNullablePositiveInteger(course.periodPosition) &&
        typeof course.code === 'string' &&
        course.code.length <= 32 &&
        typeof course.name === 'string' &&
        course.name.length <= 200 &&
        typeof course.credits === 'number' &&
        Number.isInteger(course.credits) &&
        course.credits >= 0,
    )
  )
    return undefined
  if (curriculum.name !== undefined && (typeof curriculum.name !== 'string' || curriculum.name.length > 120))
    return undefined
  if (curriculum.planningStart !== null) {
    const start = curriculum.planningStart
    if (
      !isRecord(start) ||
      typeof start.year !== 'number' ||
      !Number.isInteger(start.year) ||
      (start.semester !== 1 && start.semester !== 2) ||
      typeof start.semesterNumber !== 'number' ||
      !Number.isInteger(start.semesterNumber) ||
      start.semesterNumber < 1
    )
      return undefined
  }
  return value as PlanningFileV1
}

function resolveCourse(reference: CourseV1, courses: ReadonlyArray<Course>) {
  const byCode = courses.find(
    (course) => normalized(course.code) === normalized(reference.code),
  )
  if (byCode) return { course: byCode, fallback: false }
  const byId = reference.courseId === null
    ? undefined
    : courses.find((course) => numericId(course.id) === reference.courseId)
  if (
    byId &&
    normalized(byId.name) === normalized(reference.name) &&
    byId.credits === reference.credits
  )
    return { course: byId, fallback: true }
  return undefined
}

export function resolvePlanningImport(
  file: PlanningFileV1,
  staticData: CurriculumPlannerStaticData,
): ResolvedPlanningImport {
  const issues: Array<PlanningImportIssue> = []
  const selection = file.curriculum.selection
  const semanticProgram = staticData.catalogPrograms.find(
    (item) =>
      item.catalog.year === selection.catalogYear &&
      selection.programCode !== null &&
      normalized(item.program.code) === normalized(selection.programCode),
  )
  const idProgram = selection.catalogProgramId === null
    ? undefined
    : staticData.catalogPrograms.find(
        (item) =>
          numericId(item.id) === selection.catalogProgramId &&
          (selection.catalogYear === null ||
            item.catalog.year === selection.catalogYear) &&
          (selection.programName === null ||
            normalized(item.program.name) === normalized(selection.programName)),
      )
  const program = semanticProgram ?? idProgram
  const resolvedSelection: {
    catalogProgramId?: CatalogProgramId
    specializationId?: SpecializationId
    languageId?: LanguageId
  } = {}
  if (program) {
    resolvedSelection.catalogProgramId = program.id
    if (!semanticProgram && idProgram)
      issues.push({ type: 'fallback', message: 'Catálogo e programa foram resolvidos pelo ID de origem.' })
    const specialization = program.specializations.find(
      (item) =>
        selection.specializationCode !== null &&
        normalized(item.code) === normalized(selection.specializationCode),
    ) ?? program.specializations.find(
      (item) =>
        numericId(item.id) === selection.catalogSpecializationId &&
        selection.specializationName !== null &&
        normalized(item.name) === normalized(selection.specializationName),
    )
    if (specialization) resolvedSelection.specializationId = specialization.id
    else if (selection.specializationCode !== null)
      issues.push({ type: 'selection', message: `Habilitação ${selection.specializationCode} não encontrada.` })
    const language = program.languages.find(
      (item) =>
        selection.languageName !== null &&
        normalized(item.name) === normalized(selection.languageName),
    ) ?? program.languages.find(
      (item) => numericId(item.id) === selection.catalogLanguageId,
    )
    if (language) resolvedSelection.languageId = language.id
    else if (selection.languageName !== null)
      issues.push({ type: 'selection', message: `Língua ${selection.languageName} não encontrada.` })
  } else if (selection.catalogYear !== null || selection.programCode !== null) {
    issues.push({ type: 'selection', message: 'Catálogo e programa do arquivo não foram encontrados.' })
  }
  const periodPositions = [...new Set(file.curriculum.periods.map((period) => period.position))]
    .sort((left, right) => left - right)
  if (periodPositions.length !== file.curriculum.periods.length)
    issues.push({ type: 'duplicate', message: 'Períodos repetidos foram consolidados pela posição.' })
  const coursesByPosition = new Map<number, Array<CourseId>>()
  const unallocated: Array<CourseId> = []
  const placed = new Set<CourseId>()
  for (const reference of file.curriculum.courses) {
    const resolved = resolveCourse(reference, staticData.courses)
    if (!resolved) {
      issues.push({ type: 'course', message: `Disciplina ${reference.code} não encontrada.` })
      continue
    }
    if (placed.has(resolved.course.id)) {
      issues.push({ type: 'duplicate', message: `Disciplina ${reference.code} repetida foi mantida apenas uma vez.` })
      continue
    }
    if (resolved.fallback)
      issues.push({ type: 'fallback', message: `Disciplina ${reference.code} foi resolvida pelo ID de origem.` })
    if (reference.periodPosition !== null && reference.periodId !== null) {
      const referencedPeriod = file.curriculum.periods.find(
        (period) => period.position === reference.periodPosition,
      )
      if (referencedPeriod?.id !== null && referencedPeriod?.id !== reference.periodId)
        issues.push({ type: 'period', message: `Disciplina ${reference.code} possui ID e posição de período inconsistentes; a posição foi usada.` })
    }
    if (reference.periodPosition === null) unallocated.push(resolved.course.id)
    else if (periodPositions.includes(reference.periodPosition)) {
      const items = coursesByPosition.get(reference.periodPosition) ?? []
      items.push(resolved.course.id)
      coursesByPosition.set(reference.periodPosition, items)
    } else {
      issues.push({ type: 'period', message: `Disciplina ${reference.code} referencia um período inexistente e foi ignorada.` })
      continue
    }
    placed.add(resolved.course.id)
  }
  const currentPeriodPosition = file.curriculum.currentPeriodPosition
  if (
    currentPeriodPosition !== null &&
    file.curriculum.currentPeriodId !== null
  ) {
    const currentPeriod = file.curriculum.periods.find(
      (period) => period.position === currentPeriodPosition,
    )
    if (currentPeriod?.id !== null && currentPeriod?.id !== file.curriculum.currentPeriodId)
      issues.push({ type: 'period', message: 'O ID e a posição do semestre atual são inconsistentes; a posição foi usada.' })
  }
  if (currentPeriodPosition !== null && !periodPositions.includes(currentPeriodPosition))
    issues.push({ type: 'period', message: 'O semestre atual do arquivo não existe e foi desmarcado.' })
  return {
    ...(file.curriculum.name?.trim() ? { name: file.curriculum.name.trim() } : {}),
    issues,
    data: {
      selection: resolvedSelection,
      planningStart: file.curriculum.planningStart ?? undefined,
      currentPeriodPosition:
        currentPeriodPosition !== null && periodPositions.includes(currentPeriodPosition)
          ? periodPositions.indexOf(currentPeriodPosition) + 1
          : undefined,
      periods: periodPositions.map((position) => ({
        courses: coursesByPosition.get(position) ?? [],
      })),
      unallocatedCourses: unallocated,
    },
  }
}

export function downloadPlanning(
  snapshot: CurriculumPlannerSnapshot,
  staticData: CurriculumPlannerStaticData,
  name?: string,
) {
  const blob = new Blob(
    [JSON.stringify(serializePlanning(snapshot, staticData, { name }), null, 2)],
    { type: 'application/json' },
  )
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'curriculo-pomi.json'
  link.click()
  URL.revokeObjectURL(url)
}
