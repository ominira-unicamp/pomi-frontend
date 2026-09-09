import { expectApiResponse } from './errors'
import type { Tag } from './tagTaxonomy'
import type { PomiClient } from './client'

export function createStudentInterestsApi(client: PomiClient) {
  async function authenticatedNoContent(
    path: string,
    getAccessToken: () => Promise<string>,
    method: 'PUT' | 'DELETE',
  ) {
    const response = await client.appApiRequest(path, getAccessToken, {
      method,
    })
    await expectApiResponse(response)
  }

  function listStudentTagInterests(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client
      .appApiRequest(`/student/${studentId}/tag-interests`, getAccessToken)
      .then(async (response) => {
        await expectApiResponse(response)
        return (await response.json()) as ReadonlyArray<Tag>
      })
  }

  function putStudentTagInterest(
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

  function deleteStudentTagInterest(
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

  return {
    listStudentTagInterests,
    putStudentTagInterest,
    deleteStudentTagInterest,
  }
}
