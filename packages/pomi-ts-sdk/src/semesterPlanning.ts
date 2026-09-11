import { collectPages } from './generatedPagination.js'
import type {
  createStudentPeriodPlanningsInput,
  getStudentPeriodPlanningsOutput,
  updateStudentPeriodPlanningsInput,
} from './generated/app/operations.js'
import type {
  listClassSchedulesOutput,
  listClassesOutput,
  listCoursesOutput,
  listProfessorsEvaluationSummariesOutput,
  listStudyPeriodsOutput,
} from './generated/data/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type SemesterApiStudyPeriod = Readonly<
  Pick<
    listStudyPeriodsOutput[number],
    'id' | 'year' | 'yearPeriod' | 'startDate'
  >
>
export type SemesterApiCourse = Readonly<
  Pick<listCoursesOutput['data'][number], 'id' | 'code' | 'name' | 'credits'>
>
export type SemesterApiClass = Readonly<
  Pick<
    listClassesOutput['data'][number],
    'id' | 'code' | 'courseId' | 'courseCode' | 'professors'
  >
>
export type SemesterApiMeeting = Readonly<
  Pick<
    listClassSchedulesOutput['data'][number],
    'id' | 'classId' | 'dayOfWeek' | 'start' | 'end' | 'roomCode'
  >
>
export type ProfessorEvaluationSummary = Readonly<
  listProfessorsEvaluationSummariesOutput['data'][number]
>

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

type GeneratedPlanning = getStudentPeriodPlanningsOutput
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
    return client.data.listStudyPeriods({})
  }

  function listCourses() {
    return client.data.courses.listAll({ page: 1, pageSize: 1000 })
  }

  function listClasses(studyPeriodId: number) {
    return collectPages(
      client,
      'data',
      client.data.listClasses({
        page: 1,
        pageSize: 1000,
        filter: { studyPeriodId },
      }),
    )
  }

  function listMeetings(studyPeriodId: number) {
    return collectPages(
      client,
      'data',
      client.data.listClassSchedules({
        page: 1,
        pageSize: 1000,
        filter: { studyPeriod: { id: studyPeriodId } },
      }),
    )
  }

  function listProfessorEvaluationSummaries() {
    return collectPages(
      client,
      'data',
      client.data.listProfessorsEvaluationSummaries({
        page: 1,
        pageSize: 100,
      }),
    )
  }

  function listSemesterPlannings(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.periodPlannings.list(
      studentId,
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
    return client.app.periodPlannings.get(studentId, planId, {
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
    return client.app.periodPlannings.create(studentId, body, {
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
    return client.app.periodPlannings.update(studentId, planId, body, {
      getAccessToken,
    }) as Promise<PersistedSemesterPlanning>
  }

  function updateSemesterPlanningVisibility(
    studentId: number,
    planId: number,
    visibility: SemesterPlanningVisibility,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.periodPlannings.update(
      studentId,
      planId,
      { visibility },
      { getAccessToken },
    ) as Promise<PersistedSemesterPlanning>
  }

  async function deleteSemesterPlanning(
    studentId: number,
    planId: number,
    getAccessToken: () => Promise<string>,
  ) {
    await client.app.periodPlannings.delete(studentId, planId, {
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
