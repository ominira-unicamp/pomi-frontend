import type {
  ExchangeNoticeFile as GeneratedExchangeNoticeFile,
  ExchangeNotice as GeneratedExchangeNotice,
  ExchangePlaceListItem,
} from './generated/data/domain.js'
import type { ExchangeNoticeSubscription as GeneratedExchangeNoticeSubscription } from './generated/app/domain.js'
import type { updateStudentExchangeNoticeSubscriptionInput } from './generated/app/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type ExchangePlace = ExchangePlaceListItem
export type ExchangeNotice = GeneratedExchangeNotice
export type ExchangeNoticeFile = GeneratedExchangeNoticeFile
export type ExchangeNoticeSubscription = GeneratedExchangeNoticeSubscription

export type ExchangeNoticeSubscriptionPatch = Readonly<
  Omit<updateStudentExchangeNoticeSubscriptionInput['body'], 'placeIds'> & {
    placeIds?: ReadonlyArray<number>
  }
>

export function createExchangeApi(client: PomiSdkClient) {
  function listExchangeNotices() {
    return client.data.exchangeNotices.list({})
  }

  function listExchangePlaces() {
    return client.data.exchangePlaces.list({})
  }

  function getExchangeNoticeSubscription(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentExchangeNoticeSubscription.list(
      studentId,
      {},
      {
        getAccessToken,
      },
    )
  }

  function patchExchangeNoticeSubscription(
    studentId: number,
    patch: ExchangeNoticeSubscriptionPatch,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.studentExchangeNoticeSubscription.update(
      studentId,
      {
        ...patch,
        placeIds: patch.placeIds ? [...patch.placeIds] : undefined,
      },
      { getAccessToken },
    )
  }

  function samePlaceIds(
    left: ReadonlyArray<number>,
    right: ReadonlyArray<number>,
  ) {
    if (left.length !== right.length) return false
    const sortedLeft = [...left].sort((a, b) => a - b)
    const sortedRight = [...right].sort((a, b) => a - b)
    return sortedLeft.every((value, index) => value === sortedRight[index])
  }

  function buildExchangeSubscriptionPatch(
    draft: Pick<ExchangeNoticeSubscription, 'enabled' | 'placeIds'>,
    persisted: Pick<ExchangeNoticeSubscription, 'enabled' | 'placeIds'>,
  ): ExchangeNoticeSubscriptionPatch | undefined {
    const patch: { enabled?: boolean; placeIds?: ReadonlyArray<number> } = {}
    if (draft.enabled !== persisted.enabled) patch.enabled = draft.enabled
    if (!samePlaceIds(draft.placeIds, persisted.placeIds)) {
      patch.placeIds = draft.placeIds
    }
    return Object.keys(patch).length > 0 ? patch : undefined
  }

  return {
    listExchangeNotices,
    listExchangePlaces,
    getExchangeNoticeSubscription,
    patchExchangeNoticeSubscription,
    buildExchangeSubscriptionPatch,
  }
}
