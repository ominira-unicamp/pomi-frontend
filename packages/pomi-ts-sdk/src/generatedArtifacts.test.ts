import assert from 'node:assert/strict'
import test from 'node:test'
import {
  enumValues as appEnumValues,
  filterCapabilities as appFilterCapabilities,
  operationDefinitions as appOperations,
  operationPaths as appPaths,
  operationProblemTypes as appOperationProblems,
  problemCatalog as appProblems,
  domainModelDefinitions as appDomainModels,
  queryCapabilities as appQueryCapabilities,
  type createStudentAbsencesInput,
  type updateMeBotGrantsInput,
  type listStudentCourseAttemptsOutput,
} from './generated/app/index.js'
import {
  domainModelDefinitions as dataDomainModels,
  filterCapabilities as dataFilterCapabilities,
  operationDefinitions as dataOperations,
  operationPaths as dataPaths,
  type getCatalogProgramOutput,
  type getClassSchedulesOutput,
  type getCoursesOutput,
  type listCatalogCoursesOutput,
  type listCatalogsOutput,
  type listClassesOutput,
  type listCatalogProgramOutput,
  type listClassSchedulesOutput,
  type listCoursesFilter,
  type listCoursesInput,
  type listCoursesOutput,
  type listStudyPeriodsOutput,
  type listUnitsOutput,
} from './generated/data/index.js'
import type {
  BlockSet,
  Catalog,
  CatalogCourse,
  CatalogProgram,
  Class,
  ClassSchedule,
  Course,
  StudyPeriod,
  Unit,
} from './generated/data/domain.js'
import type {
  Category,
  StudentCourseAttempt,
  Tag,
  TagRelatedCourse,
} from './generated/app/domain.js'
import type {
  listCategoriesOutput,
  listCoursesTagsOutput,
  listTagsCoursesOutput,
  listTagsOutput,
} from './generated/app/index.js'
import { sdkManifest } from './generated/manifest.js'

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <
    Value,
  >() => Value extends Right ? 1 : 2
    ? true
    : false
type Assert<Value extends true> = Value
type AssertFalse<Value extends false> = Value
type DomainTypeAssertions = [
  Assert<Equal<listCoursesOutput['data'][number], Course>>,
  Assert<Equal<getCoursesOutput, Course>>,
  Assert<Equal<listClassSchedulesOutput['data'][number], ClassSchedule>>,
  Assert<Equal<getClassSchedulesOutput, ClassSchedule>>,
  Assert<Equal<listUnitsOutput[number], Unit>>,
  Assert<Equal<listCatalogsOutput[number], Catalog>>,
  Assert<Equal<listCatalogCoursesOutput['data'][number], CatalogCourse>>,
  Assert<Equal<listStudyPeriodsOutput[number], StudyPeriod>>,
  Assert<Equal<listClassesOutput['data'][number], Class>>,
  Assert<Equal<listCategoriesOutput[number], Category>>,
  Assert<Equal<listTagsOutput[number], Tag>>,
  Assert<Equal<listCoursesTagsOutput[number], Tag>>,
  Assert<Equal<listTagsCoursesOutput['data'][number], TagRelatedCourse>>,
  Assert<Equal<listCatalogProgramOutput[number], CatalogProgram>>,
  Assert<Equal<getCatalogProgramOutput, CatalogProgram>>,
  Assert<Equal<listStudentCourseAttemptsOutput[number], StudentCourseAttempt>>,
  AssertFalse<'_paths' extends keyof Course ? true : false>,
  AssertFalse<'_paths' extends keyof ClassSchedule ? true : false>,
  AssertFalse<'_paths' extends keyof BlockSet ? true : false>,
]
const domainTypeAssertions = undefined as unknown as DomainTypeAssertions

test('generates separate operational manifests for Data and App', () => {
  assert.equal(Object.keys(dataOperations).length, 53)
  assert.equal(Object.keys(appOperations).length, 70)
  assert.equal(dataOperations.listCourses.target, 'data')
  assert.equal(dataOperations.listCourses.authentication, 'public')
  assert.equal(appOperations.listStudentAbsences.target, 'app')
  assert.equal(appOperations.listStudentAbsences.authentication, 'required')
  assert.equal(sdkManifest.data.operationDefinitions, dataOperations)
  assert.equal(sdkManifest.app.operationDefinitions, appOperations)
  assert.equal(
    Object.values(dataOperations).filter((operation) => operation.sdk).length,
    53,
  )
  assert.equal(
    Object.values(appOperations).filter((operation) => operation.sdk).length,
    65,
  )
  assert.equal(dataOperations.listClasses.sdk?.resource, 'classes')
  assert.equal(dataOperations.listClasses.pagination?.itemsField, 'data')
  assert.equal(
    appOperations.listTagsCourses.pagination?.nextField,
    '_paths.next',
  )
})

test('generates canonical domain models independently from operation envelopes', () => {
  assert.equal(domainTypeAssertions, undefined)
  for (const model of [
    'Course',
    'CatalogProgram',
    'ClassSchedule',
    'Unit',
    'Catalog',
    'CatalogCourse',
    'StudyPeriod',
    'Class',
    'CalendarEvent',
    'CalendarTag',
    'Coordinator',
    'CurriculumSuggestion',
    'DailyMenu',
    'ExchangeNotice',
    'Language',
    'ProfessorDataPortalProfile',
    'Professor',
    'Program',
    'Room',
    'Specialization',
    'CourseEvaluationSummary',
    'CourseProfessorEvaluationSummary',
    'ExchangePlaceListItem',
    'ProfessorEvaluationSummary',
  ]) {
    assert.ok(model in dataDomainModels)
  }
  for (const model of [
    'StudentCourseAttempt',
    'Category',
    'Tag',
    'TagRelatedCourse',
    'FeedbackReportAccepted',
    'StudentAbsence',
    'StudentHistoryImportSummary',
    'Curriculum',
    'StudentFriendship',
    'PeriodPlanning',
    'Student',
    'SharedPeriodPlanning',
    'StudentPublicPerson',
    'BotIdentity',
    'CurrentUser',
    'BotGrant',
    'ProfessorEvaluationEligibility',
    'CurriculumSummary',
    'ExchangeNoticeSubscription',
    'FeedbackReport',
    'PendingProfessorEvaluation',
    'StudentPublicProfile',
    'StudentTagInterest',
    'ProfessorEvaluation',
  ]) {
    assert.ok(model in appDomainModels)
  }
  assert.deepEqual(dataDomainModels.Course, {
    schema: 'CourseEntity',
    transportFields: ['_paths'],
  })
  assert.deepEqual(dataDomainModels.ClassSchedule, {
    schema: 'ClassScheduleEntity',
    transportFields: ['_paths'],
  })
  assert.deepEqual(appDomainModels.StudentCourseAttempt, {
    schema: 'StudentCourseAttempt',
    transportFields: ['_paths'],
  })
})

test('generates request inputs with structured filters and bodies', () => {
  const input: listCoursesInput = {
    page: 1,
    filter: { credits: { gte: 4 }, unit: { code: 'IC' } },
  }
  const filter: listCoursesFilter = { credits: { gte: 4 } }
  const absence: createStudentAbsencesInput = {
    sid: '7',
    body: {
      courseAttemptId: 2,
      classScheduleId: 3,
      date: '2026-08-20',
    },
  }
  const grant: updateMeBotGrantsInput = {
    botAuthUserId: '8',
    body: { capabilities: ['STUDENT_PROFILE_READ'] },
  }

  assert.equal(input.page, 1)
  assert.deepEqual(filter, { credits: { gte: 4 } })
  assert.equal(absence.body.classScheduleId, 3)
  assert.deepEqual(grant.body.capabilities, ['STUDENT_PROFILE_READ'])
})

test('exposes filter capabilities and operation-specific problems', () => {
  assert.deepEqual(
    dataFilterCapabilities.listCourses.fields.find(
      (field) => field.path.join('.') === 'credits',
    )?.operators,
    ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in'],
  )
  assert.equal(
    appFilterCapabilities.listStudentAbsences.fields[0]?.path.join('.'),
    'courseAttemptId',
  )
  assert.ok(
    appOperationProblems.createStudentAbsences.includes(
      'urn:pomi:problem:invalid-student-absence',
    ),
  )
  assert.equal(
    appProblems['urn:pomi:problem:invalid-student-absence'].status,
    422,
  )
  assert.equal(appQueryCapabilities.listStudentAbsences.filter?.version, 1)
  assert.ok(appEnumValues['StudentCourseAttempt.status'].length > 1)
})

test('generates typed path and query builders', () => {
  assert.match(
    dataPaths.listCourses({
      filter: { credits: { gte: 4 } },
    }),
    /filter%5Bcredits%5D%5Bgte%5D=4/,
  )
  assert.equal(
    appPaths.createStudentAbsences({
      sid: '7',
      body: {
        courseAttemptId: 2,
        classScheduleId: 3,
        date: '2026-08-20',
      },
    }),
    '/student/7/absences',
  )
})

test('records 201 and 204 success contracts', () => {
  assert.ok(
    appOperations.createStudentAbsences.responses.some(
      (response) => response.status === 201 && response.success,
    ),
  )
  assert.ok(
    appOperations.updateMeBotGrants.responses.some(
      (response) => response.status === 204 && response.success,
    ),
  )
})
