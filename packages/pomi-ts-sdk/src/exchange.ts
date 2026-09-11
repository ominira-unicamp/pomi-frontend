import type {
  listExchangeNoticesOutput,
  listExchangePlacesOutput,
} from './generated/data/operations.js'
import type {
  listStudentExchangeNoticeSubscriptionOutput,
  updateStudentExchangeNoticeSubscriptionInput,
} from './generated/app/operations.js'
import type { PomiSdkClient } from './generatedClient.js'

export type ExchangePlace = Readonly<listExchangePlacesOutput[number]>
export type ExchangeNotice = Readonly<listExchangeNoticesOutput[number]>
export type ExchangeNoticeFile = ExchangeNotice['files'][number]
export type ExchangeNoticeSubscription = Readonly<
  Omit<listStudentExchangeNoticeSubscriptionOutput, 'placeIds'> & {
    placeIds: ReadonlyArray<number>
  }
>

export type ExchangeNoticeSubscriptionPatch = Readonly<
  Omit<updateStudentExchangeNoticeSubscriptionInput['body'], 'placeIds'> & {
    placeIds?: ReadonlyArray<number>
  }
>

export function createExchangeApi(client: PomiSdkClient) {
  function listExchangeNotices() {
    return client.data.listExchangeNotices({})
  }

  function listExchangePlaces() {
    return client.data.listExchangePlaces({})
  }

  function getExchangeNoticeSubscription(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.listStudentExchangeNoticeSubscription(
      { sid: String(studentId) },
      { getAccessToken },
    )
  }

  function patchExchangeNoticeSubscription(
    studentId: number,
    patch: ExchangeNoticeSubscriptionPatch,
    getAccessToken: () => Promise<string>,
  ) {
    return client.app.updateStudentExchangeNoticeSubscription(
      {
        sid: String(studentId),
        body: {
          ...patch,
          placeIds: patch.placeIds ? [...patch.placeIds] : undefined,
        },
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
