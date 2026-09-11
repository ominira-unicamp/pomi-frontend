import assert from 'node:assert/strict'
import test from 'node:test'
import {
  enumValues as appEnumValues,
  filterCapabilities as appFilterCapabilities,
  operationDefinitions as appOperations,
  operationPaths as appPaths,
  operationProblemTypes as appOperationProblems,
  problemCatalog as appProblems,
  queryCapabilities as appQueryCapabilities,
  type createStudentAbsencesInput,
  type updateMeBotGrantsInput,
} from './generated/app/index.js'
import {
  filterCapabilities as dataFilterCapabilities,
  operationDefinitions as dataOperations,
  operationPaths as dataPaths,
  type listCoursesFilter,
  type listCoursesInput,
} from './generated/data/index.js'
import { sdkManifest } from './generated/manifest.js'

test('generates separate operational manifests for Data and App', () => {
  assert.equal(Object.keys(dataOperations).length, 53)
  assert.equal(Object.keys(appOperations).length, 70)
  assert.equal(dataOperations.listCourses.target, 'data')
  assert.equal(dataOperations.listCourses.authentication, 'public')
  assert.equal(appOperations.listStudentAbsences.target, 'app')
  assert.equal(appOperations.listStudentAbsences.authentication, 'required')
  assert.equal(sdkManifest.data.operationDefinitions, dataOperations)
  assert.equal(sdkManifest.app.operationDefinitions, appOperations)
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
  assert.equal(
    appQueryCapabilities.listStudentAbsences.filter?.version,
    1,
  )
  assert.ok(appEnumValues['StudentCourseAttempt.status'].length > 1)
})

test('generates typed path and query builders', () => {
  assert.match(dataPaths.listCourses({
    filter: { credits: { gte: 4 } },
  }), /filter%5Bcredits%5D%5Bgte%5D=4/)
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
