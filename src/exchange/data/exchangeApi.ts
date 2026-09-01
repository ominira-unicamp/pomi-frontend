import { appApiRequest, dataApiRequest } from '@/api/client'
import { expectApiResponse } from '@/api/errors'

export type ExchangePlace = Readonly<{
  id: number
  name: string
  _paths: Readonly<{ notices: string }>
}>

export type ExchangeNoticeFile = Readonly<{
  id: number
  name: string
  url: string | null
}>

export type ExchangeNotice = Readonly<{
  id: number
  number: string | null
  issuer: string | null
  title: string | null
  place: ExchangePlace | null
  registrationOriginalText: string | null
  registrationStart: string | null
  registrationEnd: string | null
  files: ReadonlyArray<ExchangeNoticeFile>
  _paths: Readonly<{ self: string }>
}>

export type ExchangeNoticeSubscription = Readonly<{
  studentId: number
  enabled: boolean
  placeIds: ReadonlyArray<number>
}>

export type ExchangeNoticeSubscriptionPatch = Readonly<{
  enabled?: boolean
  placeIds?: ReadonlyArray<number>
}>

async function publicJson<T>(path: string): Promise<T> {
  const response = await dataApiRequest(path)
  await expectApiResponse(response)
  return (await response.json()) as T
}

async function studentJson<T>(
  path: string,
  getAccessToken: () => Promise<string>,
  init?: RequestInit,
): Promise<T> {
  const response = await appApiRequest(path, getAccessToken, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  await expectApiResponse(response)
  return (await response.json()) as T
}

export function listExchangeNotices() {
  return publicJson<ReadonlyArray<ExchangeNotice>>('/exchange-notices')
}

export function listExchangePlaces() {
  return publicJson<ReadonlyArray<ExchangePlace>>('/exchange-places')
}

export function getExchangeNoticeSubscription(
  studentId: number,
  getAccessToken: () => Promise<string>,
) {
  return studentJson<ExchangeNoticeSubscription>(
    `/student/${studentId}/exchange-notice-subscription`,
    getAccessToken,
  )
}

export function patchExchangeNoticeSubscription(
  studentId: number,
  patch: ExchangeNoticeSubscriptionPatch,
  getAccessToken: () => Promise<string>,
) {
  return studentJson<ExchangeNoticeSubscription>(
    `/student/${studentId}/exchange-notice-subscription`,
    getAccessToken,
    { method: 'PATCH', body: JSON.stringify(patch) },
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
