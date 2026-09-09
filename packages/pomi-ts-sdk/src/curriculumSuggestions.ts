import { expectApiResponse } from './errors'
import type { PomiClient } from './client'

export type CurriculumSuggestionApiType =
  | 'GENERAL'
  | 'SPECIALIZATION'
  | 'PRE_OPTION'

export type CurriculumSuggestionApi = Readonly<{
  id: number
  catalogProgramId: number
  code: string
  name: string
  type: CurriculumSuggestionApiType
  specialization: Readonly<{ id: number; code: string; name: string }> | null
  semesters: ReadonlyArray<
    Readonly<{
      semester: number
      electiveCredits: number
      courses: ReadonlyArray<
        Readonly<{ id: number; code: string; name: string; credits: number }>
      >
    }>
  >
}>

export function createCurriculumSuggestionsApi(client: PomiClient) {
  async function listCurriculumSuggestions(catalogProgramId: number) {
    const query = new URLSearchParams({
      catalogProgramId: String(catalogProgramId),
    })
    const response = await client.dataApiRequest(
      `/curriculum-suggestions?${query}`,
    )
    await expectApiResponse(response)
    const value: unknown = await response.json()
    if (!Array.isArray(value)) throw new TypeError('Expected suggestions')
    return value as ReadonlyArray<CurriculumSuggestionApi>
  }

  return { listCurriculumSuggestions }
}
