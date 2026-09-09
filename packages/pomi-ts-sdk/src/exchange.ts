import { appApi, dataApi } from './endpoint'
import type { PomiClient } from './client'

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

type StudentSubscriptionInput = Readonly<{ studentId: number }>
type PatchSubscriptionInput = StudentSubscriptionInput &
  Readonly<{ patch: ExchangeNoticeSubscriptionPatch }>

const exchangeData = dataApi.interface('')
const exchangeApp = appApi.authenticated.interface('/student/:studentId')

const exchangeEndpoints = exchangeData.define({
  listExchangeNotices:
    exchangeData.get<ReadonlyArray<ExchangeNotice>>('/exchange-notices'),
  listExchangePlaces:
    exchangeData.get<ReadonlyArray<ExchangePlace>>('/exchange-places'),
  getSubscription: exchangeApp.get<
    ExchangeNoticeSubscription,
    StudentSubscriptionInput
  >('/exchange-notice-subscription'),
  patchSubscription: exchangeApp.patch<
    ExchangeNoticeSubscription,
    PatchSubscriptionInput
  >('/exchange-notice-subscription', { body: ({ patch }) => patch }),
})

export function createExchangeApi(client: PomiClient) {
  const api = client.bind(exchangeEndpoints)

  function listExchangeNotices() {
    return api.listExchangeNotices({})
  }

  function listExchangePlaces() {
    return api.listExchangePlaces({})
  }

  function getExchangeNoticeSubscription(
    studentId: number,
    getAccessToken: () => Promise<string>,
  ) {
    return api.getSubscription({ studentId }, { getAccessToken })
  }

  function patchExchangeNoticeSubscription(
    studentId: number,
    patch: ExchangeNoticeSubscriptionPatch,
    getAccessToken: () => Promise<string>,
  ) {
    return api.patchSubscription({ studentId, patch }, { getAccessToken })
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
