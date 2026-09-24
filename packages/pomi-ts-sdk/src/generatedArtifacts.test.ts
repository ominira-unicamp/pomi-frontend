import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
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
  type replaceBotGrantInput,
  type listStudentCourseAttemptsOutput,
} from './generated/app/index.js'
import {
  domainModelDefinitions as dataDomainModels,
  filterCapabilities as dataFilterCapabilities,
  sortCapabilities as dataSortCapabilities,
  operationDefinitions as dataOperations,
  operationPaths as dataPaths,
  type getCatalogProgramsOutput,
  type getClassSchedulesOutput,
  type getCoursesOutput,
  type listCatalogCoursesOutput,
  type listCatalogCoursesInput,
  type listCatalogsOutput,
  type listClassesOutput,
  type listCatalogProgramsOutput,
  type listClassSchedulesOutput,
  type listCoauthorsOutput,
  type listCoursesFilter,
  type listCoursesInput,
  type listCoursesOutput,
  type listStudyPeriodsOutput,
  type listProfessorDataPortalProfilesOutput,
  type listUnitsOutput,
} from './generated/data/index.js'
import type {
  CourseBlockSet as BlockSet,
  Catalog,
  CatalogCourse,
  CatalogProgram,
  Class,
  ClassSchedule,
  Coauthor,
  Course,
  ProfessorDataPortalProfileSummary,
  StudyPeriod,
  Unit,
} from './generated/data/domain.js'
import type {
  Category,
  SharedPeriodPlanningPage,
  StudentCourseAttempt,
  StudentPublicPerson,
  Tag,
  TagRelatedCourse,
} from './generated/app/domain.js'
import type {
  listCategoriesOutput,
  listCourseTagsOutput,
  listPublicSharedPeriodPlanningsOutput,
  listStudentPeopleOutput,
  listTagCoursesOutput,
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
  Assert<Equal<listUnitsOutput['data'][number], Unit>>,
  Assert<Equal<listCatalogsOutput['data'][number], Catalog>>,
  Assert<Equal<listCatalogCoursesOutput['data'][number], CatalogCourse>>,
  Assert<Equal<listStudyPeriodsOutput['data'][number], StudyPeriod>>,
  Assert<Equal<listClassesOutput['data'][number], Class>>,
  Assert<Equal<listCoauthorsOutput['data'][number], Coauthor>>,
  Assert<
    Equal<
      listProfessorDataPortalProfilesOutput['data'][number],
      ProfessorDataPortalProfileSummary
    >
  >,
  Assert<Equal<listCategoriesOutput['data'][number], Category>>,
  Assert<Equal<listTagsOutput['data'][number], Tag>>,
  Assert<Equal<listCourseTagsOutput['data'][number], Tag>>,
  Assert<Equal<listTagCoursesOutput['data'][number], TagRelatedCourse>>,
  Assert<Equal<listCatalogProgramsOutput['data'][number], CatalogProgram>>,
  Assert<Equal<getCatalogProgramsOutput, CatalogProgram>>,
  Assert<
    Equal<listStudentCourseAttemptsOutput['data'][number], StudentCourseAttempt>
  >,
  Assert<
    Equal<
      listPublicSharedPeriodPlanningsOutput['data'][number],
      SharedPeriodPlanningPage['data'][number]
    >
  >,
  Assert<Equal<listStudentPeopleOutput['data'][number], StudentPublicPerson>>,
  AssertFalse<'_paths' extends keyof Course ? true : false>,
  AssertFalse<'_paths' extends keyof ClassSchedule ? true : false>,
  AssertFalse<'_paths' extends keyof BlockSet ? true : false>,
]
type SortTermOf<Input> = Input extends { sort?: infer Sort }
  ? NonNullable<Sort> extends ReadonlyArray<infer Term>
    ? Term
    : never
  : never
type SortingTypeAssertions = [
  Assert<
    Equal<
      SortTermOf<listCatalogCoursesInput>['field'],
      'catalogYear' | 'code' | 'name' | 'credits'
    >
  >,
  Assert<
    Equal<SortTermOf<listCatalogCoursesInput>['direction'], 'asc' | 'desc'>
  >,
  AssertFalse<
    [] extends NonNullable<listCatalogCoursesInput['sort']> ? true : false
  >,
  AssertFalse<
    {
      field: 'unknown'
      direction: 'asc'
    } extends SortTermOf<listCatalogCoursesInput>
      ? true
      : false
  >,
]
const domainTypeAssertions = undefined as unknown as DomainTypeAssertions
const sortingTypeAssertions = undefined as unknown as SortingTypeAssertions

test('generates separate operational manifests for Data and App', () => {
  assert.equal(Object.keys(dataOperations).length, 53)
  assert.equal(Object.keys(appOperations).length, 71)
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
    71,
  )
  assert.equal(dataOperations.listClasses.sdk?.resource, 'classes')
  assert.equal(dataOperations.listClasses.pagination?.defaultMode, 'page')
  assert.equal(appOperations.listTagCourses.pagination?.defaultMode, 'page')
  assert.equal(
    appOperations.listPublicSharedPeriodPlannings.pagination?.defaultMode,
    'page',
  )
})

test('generates type-checked resources and explicit operation bindings', () => {
  for (const target of ['app', 'data']) {
    const resources = readFileSync(
      new URL(`./generated/${target}/resources.ts`, import.meta.url),
      'utf8',
    )
    const bindings = readFileSync(
      new URL(`./generated/${target}/bindings.ts`, import.meta.url),
      'utf8',
    )
    assert.doesNotMatch(resources, /as unknown as/)
    assert.doesNotMatch(bindings, /as unknown as|Object\.fromEntries/)
    assert.match(bindings, /export function bindOperations/)
  }
})

test('generates canonical domain models independently from operation envelopes', () => {
  assert.equal(domainTypeAssertions, undefined)
  assert.equal(sortingTypeAssertions, undefined)
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
    transportFields: [],
    identityFields: ['id'],
    readOnlyFields: [],
    relations: {},
  })
  assert.deepEqual(dataDomainModels.ClassSchedule, {
    schema: 'ClassScheduleEntity',
    transportFields: [],
    identityFields: ['id'],
    readOnlyFields: [],
    relations: {
      roomId: { resource: 'rooms', cardinality: 'one' },
      classId: { resource: 'classes', cardinality: 'one' },
      unitId: { resource: 'units', cardinality: 'one', nullable: true },
      courseId: { resource: 'courses', cardinality: 'one' },
      studyPeriodId: { resource: 'studyPeriods', cardinality: 'one' },
    },
  })
  assert.deepEqual(appDomainModels.StudentCourseAttempt, {
    schema: 'StudentCourseAttempt',
    transportFields: [],
    identityFields: ['id'],
    readOnlyFields: [],
    relations: {
      course: { resource: 'courses', cardinality: 'one' },
      studyPeriod: {
        resource: 'studyPeriods',
        cardinality: 'one',
        nullable: true,
      },
      class: { resource: 'classes', cardinality: 'one', nullable: true },
    },
  })
})

test('generates request inputs with structured filters and bodies', () => {
  const input: listCoursesInput = {
    page: 1,
    filter: { credits: { gte: 4 }, unit: { code: 'IC' } },
  }
  const filter: listCoursesFilter = { credits: { gte: 4 } }
  const absence: createStudentAbsencesInput = {
    sid: 7,
    body: {
      courseAttemptId: 2,
      classScheduleId: 3,
      date: '2026-08-20',
    },
  }
  const grant: replaceBotGrantInput = {
    botAuthUserId: 8,
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
  assert.ok(appEnumValues.StudentCourseAttemptStatus.length > 1)
  assert.deepEqual(dataSortCapabilities.listCatalogCourses, {
    version: 1,
    fields: ['catalogYear', 'code', 'name', 'credits'],
    default: 'catalogYear:desc,code:asc',
  })
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
      sid: 7,
      body: {
        courseAttemptId: 2,
        classScheduleId: 3,
        date: '2026-08-20',
      },
    }),
    '/student/7/absences',
  )
  const sortedPath = dataPaths.listCatalogCourses({
    sort: [
      { field: 'credits', direction: 'desc' },
      { field: 'code', direction: 'asc' },
    ],
  })
  assert.equal(
    new URL(sortedPath, 'https://pomi.test').searchParams.get('sort'),
    'credits:desc,code:asc',
  )
})

test('records 201 and 204 success contracts', () => {
  assert.ok(
    appOperations.createStudentAbsences.responses.some(
      (response) => response.status === 201 && response.success,
    ),
  )
  assert.ok(
    appOperations.replaceBotGrant.responses.some(
      (response) => response.status === 204 && response.success,
    ),
  )
})
