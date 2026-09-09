import { appApi } from './endpoint'
import type { Tag } from './tagTaxonomy'
import type { PomiClient } from './client'

type StudentInput = Readonly<{ studentId: number }>
type StudentTagInput = StudentInput & Readonly<{ tagId: number }>

const studentInterestsInterface = appApi.authenticated.interface(
  '/student/:studentId/tag-interests',
)
const studentInterestsEndpoints = studentInterestsInterface.define({
  list: studentInterestsInterface.get<ReadonlyArray<Tag>, StudentInput>(),
  put: studentInterestsInterface.put<void, StudentTagInput>('/:tagId'),
  remove: studentInterestsInterface.remove<StudentTagInput>('/:tagId'),
})

export function createStudentInterestsApi(client: PomiClient) {
  const api = client.bind(studentInterestsEndpoints)

  function listStudentTagInterests(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.list({ studentId }, { getAccessToken })
  }

  function putStudentTagInterest(
    studentId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.put({ studentId, tagId }, { getAccessToken })
  }

  function deleteStudentTagInterest(
    studentId: number,
    tagId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.remove({ studentId, tagId }, { getAccessToken })
  }

  return {
    listStudentTagInterests,
    putStudentTagInterest,
    deleteStudentTagInterest,
  }
}
