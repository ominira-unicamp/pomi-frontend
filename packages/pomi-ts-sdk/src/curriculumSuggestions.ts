import type { CurriculumSuggestion } from './generated/data/domain.js'
import type { PomiSdkClient } from './generatedClient.js'

export type CurriculumSuggestionApi = CurriculumSuggestion
export type CurriculumSuggestionApiType = CurriculumSuggestionApi['type']

export function createCurriculumSuggestionsApi(client: PomiSdkClient) {
  function listCurriculumSuggestions(catalogProgramId: number) {
    return client.data.curriculumSuggestions.list({
      filter: { catalogProgramId },
    })
  }

  return { listCurriculumSuggestions }
}
