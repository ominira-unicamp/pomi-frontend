import type {
  SemesterPlannerStaticData,
  SemesterPlanningDocument,
  SemesterPlanningGuide,
} from './semesterPlanner'

export const semesterPlanningFileFormat = 'pomi-semester-planner'
export const semesterPlanningFileVersion = 2

export type SemesterPlanningFileV2 = Readonly<{
  format: typeof semesterPlanningFileFormat
  version: 2
  exportedAt: string
  semesterPlanning: Readonly<{
    name: string
    studyPeriod: Readonly<{ id: number | null; code: string }>
    curriculumId: number | null
    guide: SemesterPlanningGuide
    classes: ReadonlyArray<
      Readonly<{
        classId: number | null
        courseCode: string
        classCode: string
      }>
    >
  }>
}>

export type SemesterPlanningFileV1 = Readonly<{
  format: typeof semesterPlanningFileFormat
  version: 1
  exportedAt: string
  semesterPlanning: Omit<SemesterPlanningFileV2['semesterPlanning'], 'guide'>
}>

export type ResolvedSemesterPlanningImport = Readonly<{
  document: SemesterPlanningDocument
  issues: ReadonlyArray<string>
}>

export function serializeSemesterPlanning(
  document: SemesterPlanningDocument,
  staticData: SemesterPlannerStaticData,
): SemesterPlanningFileV2 | undefined {
  const studyPeriod = staticData.studyPeriods.find(
    (item) => item.id === document.studyPeriodId,
  )
  if (!studyPeriod) return undefined
  return {
    format: semesterPlanningFileFormat,
    version: semesterPlanningFileVersion,
    exportedAt: new Date().toISOString(),
    semesterPlanning: {
      name: document.name,
      studyPeriod: { id: studyPeriod.id, code: studyPeriod.code },
      curriculumId: document.curriculumId,
      guide: document.guide,
      classes: document.classIds.flatMap((classId) => {
        const classItem = staticData.classes.find((item) => item.id === classId)
        return classItem
          ? [
              {
                classId,
                courseCode: classItem.courseCode,
                classCode: classItem.code,
              },
            ]
          : []
      }),
    },
  }
}

export function parseSemesterPlanning(
  value: unknown,
): SemesterPlanningFileV1 | SemesterPlanningFileV2 | undefined {
  if (!value || typeof value !== 'object') return undefined
  const file = value as Record<string, unknown>
  if (
    file.format !== semesterPlanningFileFormat ||
    (file.version !== 1 && file.version !== semesterPlanningFileVersion)
  )
    return undefined
  const planning = file.semesterPlanning
  if (!planning || typeof planning !== 'object') return undefined
  const rawPlanning = planning as Record<string, unknown>
  if (
    !rawPlanning.studyPeriod ||
    typeof rawPlanning.studyPeriod !== 'object' ||
    typeof (rawPlanning.studyPeriod as Record<string, unknown>).code !==
      'string' ||
    !Array.isArray(rawPlanning.classes)
  )
    return undefined
  return value as SemesterPlanningFileV1 | SemesterPlanningFileV2
}

export function resolveSemesterPlanningImport(
  file: SemesterPlanningFileV1 | SemesterPlanningFileV2,
  staticData: SemesterPlannerStaticData,
): ResolvedSemesterPlanningImport | undefined {
  const studyPeriod =
    staticData.studyPeriods.find(
      (item) =>
        item.id === file.semesterPlanning.studyPeriod.id &&
        item.code === file.semesterPlanning.studyPeriod.code,
    ) ??
    staticData.studyPeriods.find(
      (item) => item.code === file.semesterPlanning.studyPeriod.code,
    )
  if (!studyPeriod) return undefined
  const issues: Array<string> = []
  const classIds = file.semesterPlanning.classes.flatMap((reference) => {
    const classItem =
      staticData.classes.find(
        (item) =>
          item.id === reference.classId &&
          item.courseCode === reference.courseCode &&
          item.code === reference.classCode,
      ) ??
      staticData.classes.find(
        (item) =>
          item.courseCode === reference.courseCode &&
          item.code === reference.classCode,
      )
    if (!classItem) {
      issues.push(
        `${reference.courseCode} — turma ${reference.classCode} não está disponível neste período.`,
      )
      return []
    }
    return [classItem.id]
  })
  const guide =
    file.version === 2
      ? file.semesterPlanning.guide
      : ({
          mode: file.semesterPlanning.curriculumId ? 'curriculum' : 'none',
          curriculum: {
            source: file.semesterPlanning.curriculumId ? 'saved' : null,
            curriculumId: file.semesterPlanning.curriculumId,
            suggestionId: null,
            suggestionCatalogProgramId: null,
          },
          program: {
            catalogProgramId: null,
            specializationId: null,
            languageId: null,
          },
          manualCourseIds: [],
        } satisfies SemesterPlanningGuide)
  return {
    document: {
      name:
        file.semesterPlanning.name.trim() || `Planejamento ${studyPeriod.code}`,
      studyPeriodId: studyPeriod.id,
      curriculumId: file.semesterPlanning.curriculumId,
      classIds: [...new Set(classIds)],
      guide,
    },
    issues,
  }
}

export function downloadSemesterPlanning(file: SemesterPlanningFileV2) {
  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `pomi-planejamento-de-semestre-${file.semesterPlanning.studyPeriod.code}.json`
  link.click()
  URL.revokeObjectURL(url)
}
