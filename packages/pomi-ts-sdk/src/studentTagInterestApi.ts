import { appApiRequest } from './api/client'
import { expectApiResponse } from './api/errors'
import type { Tag } from './tagTaxonomyApi'

async function authenticatedNoContent(
  path: string,
  getAccessToken: () => Promise<string>,
  method: 'PUT' | 'DELETE',
) {
  const response = await appApiRequest(path, getAccessToken, { method })
  await expectApiResponse(response)
}

export function listStudentTagInterests(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return appApiRequest(
    `/student/${studentId}/tag-interests`,
    getAccessToken,
  ).then(async (response) => {
    await expectApiResponse(response)
    return (await response.json()) as ReadonlyArray<Tag>
  })
}

export function putStudentTagInterest(
  studentId: number,
  tagId: number,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedNoContent(
    `/student/${studentId}/tag-interests/${tagId}`,
    getAccessToken,
    'PUT',
  )
}

export function deleteStudentTagInterest(
  studentId: number,
  tagId: number,
  getAccessToken: () => Promise<string>,
) {
  return authenticatedNoContent(
    `/student/${studentId}/tag-interests/${tagId}`,
    getAccessToken,
    'DELETE',
  )
}
