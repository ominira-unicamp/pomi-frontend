import type {
  ExchangeNoticeFile,
  ExchangePlaceListItem,
  ExchangeNotice as GeneratedExchangeNotice,
} from '@ominira/pomi-sdk/generated/data'
import type {
  ExchangeNoticeSubscription,
  updateExchangeNoticeSubscriptionInput,
} from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

type WithoutPaths<T> = T extends ReadonlyArray<infer Item>
  ? ReadonlyArray<WithoutPaths<Item>>
  : T extends object
    ? {
        readonly [Key in keyof T as Key extends '_paths'
          ? never
          : Key]: WithoutPaths<T[Key]>
      }
    : T

export type ExchangeNotice = WithoutPaths<GeneratedExchangeNotice>
export type ExchangePlace = WithoutPaths<ExchangePlaceListItem>
export type { ExchangeNoticeFile, ExchangeNoticeSubscription }
export type ExchangeNoticeSubscriptionPatch = Readonly<
  Omit<updateExchangeNoticeSubscriptionInput['body'], 'placeIds'> & {
    placeIds?: ReadonlyArray<number>
  }
>

type GetAccessToken = () => Promise<string>

export const listExchangeNotices = () =>
  pomiSdk.data.exchangeNotices.listAll({})
export const listExchangePlaces = () =>
  pomiSdk.data.exchangePlaces.listAll({})
export const getExchangeNoticeSubscription = (
  studentId: number,
  getAccessToken: GetAccessToken,
) =>
  pomiSdk.app.exchangeNoticeSubscriptions.get(studentId, { getAccessToken })
export const patchExchangeNoticeSubscription = (
  studentId: number,
  patch: ExchangeNoticeSubscriptionPatch,
  getAccessToken: GetAccessToken,
) =>
  pomiSdk.app.exchangeNoticeSubscriptions.update(
    studentId,
    {
      ...patch,
      placeIds: patch.placeIds ? [...patch.placeIds] : undefined,
    },
    { getAccessToken },
  )

function samePlaceIds(
  left: ReadonlyArray<number>,
  right: ReadonlyArray<number>,
) {
  if (left.length !== right.length) return false
  const sortedLeft = [...left].sort((a, b) => a - b)
  const sortedRight = [...right].sort((a, b) => a - b)
  return sortedLeft.every((value, index) => value === sortedRight[index])
}

export function buildExchangeSubscriptionPatch(
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
