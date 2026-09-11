import type { listCurriculumSuggestionsOutput } from './generated/data/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type CurriculumSuggestionApi = Readonly<
  listCurriculumSuggestionsOutput[number]
>
export type CurriculumSuggestionApiType = CurriculumSuggestionApi['type']

export function createCurriculumSuggestionsApi(client: PomiSdkClient) {
  function listCurriculumSuggestions(catalogProgramId: number) {
    return client.data.listCurriculumSuggestions({
      filter: { catalogProgramId },
    })
  }

  return { listCurriculumSuggestions }
}
