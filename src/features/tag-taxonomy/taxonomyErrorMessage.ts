import { isApiError } from '@ominira/pomi-sdk'

export function taxonomyErrorMessage(error: unknown) {
  if (isApiError(error)) {
    if (error.status === 401 || error.status === 403)
      return 'Sem permissão para alterar a taxonomia nesta sessão.'
    if (error.status === 409)
      return `Conflito na taxonomia. ${error.problem?.detail ?? 'Verifique nomes repetidos e vínculos que impedem a operação.'}`
    if (error.status === 422)
      return 'Referência inválida. A categoria ou tag pai pode ter sido removida; reabra o item.'
    if (error.status === 404)
      return 'O item não existe mais. Atualize a estrutura antes de continuar.'
  }
  return error instanceof Error
    ? error.message
    : 'Não foi possível salvar a alteração.'
}
