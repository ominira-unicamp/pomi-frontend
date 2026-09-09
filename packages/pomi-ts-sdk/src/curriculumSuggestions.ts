import { dataApi } from './endpoint'
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

type ListCurriculumSuggestionsInput = Readonly<{ catalogProgramId: number }>

const curriculumSuggestionsInterface = dataApi.interface(
  '/curriculum-suggestions',
)
const listCurriculumSuggestionsEndpoint = curriculumSuggestionsInterface.get<
  ReadonlyArray<CurriculumSuggestionApi>,
  ListCurriculumSuggestionsInput
>('', {
  query: ({ catalogProgramId }) => ({ catalogProgramId }),
  decode: (value) => {
    if (!Array.isArray(value)) throw new TypeError('Expected suggestions')
    return value as ReadonlyArray<CurriculumSuggestionApi>
  },
})

export function createCurriculumSuggestionsApi(client: PomiClient) {
  const api = client.bind({
    listCurriculumSuggestions: listCurriculumSuggestionsEndpoint,
  })
  async function listCurriculumSuggestions(catalogProgramId: number) {
    return api.listCurriculumSuggestions({
      catalogProgramId,
    })
  }

  return { listCurriculumSuggestions }
}
