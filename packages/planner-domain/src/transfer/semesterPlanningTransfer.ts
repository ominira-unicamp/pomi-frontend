import type {
  SemesterPlannerStaticData,
  SemesterPlanningDocument,
  SemesterPlanningGuide,
} from '../semester/semesterPlanner'

function periodCode(period: {
  year: number
  yearPeriod: 'FIRST_SEMESTER' | 'SECOND_SEMESTER' | 'SUMMER' | 'WINTER'
}) {
  return `${period.year}${({
    FIRST_SEMESTER: 's1',
    SECOND_SEMESTER: 's2',
    SUMMER: 'v',
    WINTER: 'i',
  } as const)[period.yearPeriod]}`
}

export const semesterPlanningFileFormat = 'pomi-semester-planner'
export const semesterPlanningFileVersion = 2

export type SemesterPlanningFileV2 = Readonly<{
  format: typeof semesterPlanningFileFormat
  version: 2
  exportedAt: string
  semesterPlanning: Readonly<{
    name: string
    studyPeriod: Readonly<{
      id: number | null
      year: number
      yearPeriod: 'FIRST_SEMESTER' | 'SECOND_SEMESTER' | 'SUMMER' | 'WINTER'
    }>
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
      studyPeriod: {
        id: studyPeriod.id,
        year: studyPeriod.year,
        yearPeriod: studyPeriod.yearPeriod,
      },
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
    typeof (rawPlanning.studyPeriod as Record<string, unknown>).year !==
      'number' ||
    typeof (rawPlanning.studyPeriod as Record<string, unknown>).yearPeriod !==
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
        item.year === file.semesterPlanning.studyPeriod.year &&
        item.yearPeriod === file.semesterPlanning.studyPeriod.yearPeriod,
    ) ??
    staticData.studyPeriods.find(
      (item) =>
        item.year === file.semesterPlanning.studyPeriod.year &&
        item.yearPeriod === file.semesterPlanning.studyPeriod.yearPeriod,
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
        file.semesterPlanning.name.trim() ||
        `Planejamento ${periodCode(studyPeriod)}`,
      studyPeriodId: studyPeriod.id,
      curriculumId: file.semesterPlanning.curriculumId,
      classIds: [...new Set(classIds)],
      guide,
    },
    issues,
  }
}
