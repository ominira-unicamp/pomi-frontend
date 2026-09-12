import type {
  createStudentPeriodPlanningsInput,
  updateStudentPeriodPlanningsInput,
} from './generated/app/operations.js'
import type {
  Class as GeneratedClass,
  ClassSchedule as GeneratedClassSchedule,
  Course as GeneratedCourse,
  ProfessorEvaluationSummary as GeneratedProfessorEvaluationSummary,
  StudyPeriod as GeneratedStudyPeriod,
} from './generated/data/domain.js'
import type { PeriodPlanning as GeneratedPlanning } from './generated/app/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type SemesterApiStudyPeriod = GeneratedStudyPeriod
export type SemesterApiCourse = GeneratedCourse
export type SemesterApiClass = GeneratedClass
export type SemesterApiMeeting = GeneratedClassSchedule
export type ProfessorEvaluationSummary = GeneratedProfessorEvaluationSummary

export type SemesterPlanningVisibility = 'PRIVATE' | 'FRIENDS' | 'PUBLIC'

export type SemesterPlanningGuideInput = Readonly<{
  mode: 'curriculum' | 'program' | 'none'
  curriculum: Readonly<{
    source: 'saved' | 'suggestion' | null
    curriculumId: number | null
    suggestionId: number | null
    suggestionCatalogProgramId: number | null
  }>
  program: Readonly<{
    catalogProgramId: number | null
    specializationId: number | null
    languageId: number | null
  }>
  manualCourseIds: ReadonlyArray<number>
}>

type GeneratedPlanningClass = GeneratedPlanning['classes'][number]
type GeneratedPlanningGuide = GeneratedPlanning['guide']
export type PersistedSemesterPlanning = Readonly<{
  id: GeneratedPlanning['id']
  name: GeneratedPlanning['name']
  createdAt: GeneratedPlanning['createdAt']
  updatedAt: GeneratedPlanning['updatedAt']
  studyPeriodId: GeneratedPlanning['studyPeriodId']
  studyPeriodYear: GeneratedPlanning['studyPeriodYear']
  studyPeriodYearPeriod: GeneratedPlanning['studyPeriodYearPeriod']
  curriculumId: GeneratedPlanning['curriculumId']
  visibility: GeneratedPlanning['visibility']
  classes: ReadonlyArray<
    Readonly<
      Pick<
        GeneratedPlanningClass,
        'id' | 'code' | 'courseCode' | 'courseCredits'
      >
    >
  >
  guide: Readonly<{
    mode: GeneratedPlanningGuide['mode']
    curriculumSource: GeneratedPlanningGuide['curriculumSource']
    curriculumId: GeneratedPlanningGuide['curriculumId']
    suggestionId: GeneratedPlanningGuide['suggestionId']
    suggestionCatalogProgramId: NonNullable<
      GeneratedPlanningGuide['suggestionCatalogProgramId']
    > | null
    catalogProgramId: GeneratedPlanningGuide['catalogProgramId']
    specializationId: GeneratedPlanningGuide['specializationId']
    languageId: GeneratedPlanningGuide['languageId']
    manualCourseIds: GeneratedPlanningGuide['manualCourseIds']
  }>
}>

type SemesterPlanningDocumentInput = Readonly<{
  name: string
  studyPeriodId: number
  curriculumId: number | null
  classIds: ReadonlyArray<number>
  guide: SemesterPlanningGuideInput
}>

function guideToApi(guide: SemesterPlanningGuideInput) {
  return {
    mode: guide.mode.toUpperCase() as 'CURRICULUM' | 'PROGRAM' | 'NONE',
    curriculumSource: guide.curriculum.source
      ? (guide.curriculum.source.toUpperCase() as 'SAVED' | 'SUGGESTION')
      : null,
    curriculumId: guide.curriculum.curriculumId,
    suggestionId: guide.curriculum.suggestionId,
    suggestionCatalogProgramId: guide.curriculum.suggestionCatalogProgramId,
    catalogProgramId: guide.program.catalogProgramId,
    specializationId: guide.program.specializationId,
    languageId: guide.program.languageId,
    manualCourseIds: [...new Set(guide.manualCourseIds)],
  }
}

export function createSemesterPlanningApi(client: PomiSdkClient) {
  function listStudyPeriods() {
    return client.data.studyPeriods.list({})
  }

  function listCourses() {
    return client.data.courses.listAll({ page: 1, pageSize: 1000 })
  }

  function listClasses(studyPeriodId: number) {
    return client.data.classes.listAll({
      page: 1,
      pageSize: 1000,
      filter: { studyPeriodId },
    })
  }

  function listMeetings(studyPeriodId: number) {
    return client.data.classSchedules.listAll({
      page: 1,
      pageSize: 1000,
      filter: { studyPeriod: { id: studyPeriodId } },
    })
  }

  function listProfessorEvaluationSummaries() {
    return client.data.professorsEvaluationSummaries.listAll({
      page: 1,
      pageSize: 100,
    })
  }

  function listSemesterPlannings(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.periodPlannings.list(
      String(studentId),
      {},
      {
        getAccessToken,
      },
    ) as Promise<ReadonlyArray<PersistedSemesterPlanning>>
  }

  function getSemesterPlanning(
    studentId: number,
    planId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.periodPlannings.get(String(studentId), String(planId), {
      getAccessToken,
    }) as Promise<PersistedSemesterPlanning>
  }

  function createSemesterPlanning(
    studentId: number,
    document: SemesterPlanningDocumentInput,
    getAccessToken: () => Promise<string>,
  ) {
    const body: createStudentPeriodPlanningsInput['body'] = {
      name: document.name,
      studyPeriodId: document.studyPeriodId,
      curriculumId: document.curriculumId,
      classes: [...document.classIds],
      guide: guideToApi(document.guide),
    }
    return client.app.periodPlannings.create(String(studentId), body, {
      getAccessToken,
    }) as Promise<PersistedSemesterPlanning>
  }

  function patchSemesterPlanning(
    studentId: number,
    planId: number,
    document: Omit<SemesterPlanningDocumentInput, 'studyPeriodId'>,
    getAccessToken: () => Promise<string>,
  ) {
    const body: updateStudentPeriodPlanningsInput['body'] = {
      name: document.name,
      curriculumId: document.curriculumId,
      classes: { set: [...document.classIds] },
      guide: guideToApi(document.guide),
    }
    return client.app.periodPlannings.update(
      String(studentId),
      String(planId),
      body,
      {
        getAccessToken,
      },
    ) as Promise<PersistedSemesterPlanning>
  }

  function updateSemesterPlanningVisibility(
    studentId: number,
    planId: number,
    visibility: SemesterPlanningVisibility,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.periodPlannings.update(
      String(studentId),
      String(planId),
      { visibility },
      { getAccessToken },
    ) as Promise<PersistedSemesterPlanning>
  }

  async function deleteSemesterPlanning(
    studentId: number,
    planId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.periodPlannings.delete(String(studentId), String(planId), {
      getAccessToken,
    })
  }

  return {
    listStudyPeriods,
    listCourses,
    listClasses,
    listMeetings,
    listProfessorEvaluationSummaries,
    listSemesterPlannings,
    getSemesterPlanning,
    createSemesterPlanning,
    patchSemesterPlanning,
    updateSemesterPlanningVisibility,
    deleteSemesterPlanning,
  }
}
