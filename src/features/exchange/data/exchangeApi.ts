import { pomiApi } from '@/api/client'

export type {
  ExchangeNotice,
  ExchangeNoticeFile,
  ExchangeNoticeSubscription,
  ExchangeNoticeSubscriptionPatch,
  ExchangePlace,
} from '@pomi/pomi-ts-sdk/exchange'

export const {
  listExchangeNotices,
  listExchangePlaces,
  getExchangeNoticeSubscription,
  patchExchangeNoticeSubscription,
  buildExchangeSubscriptionPatch,
} = pomiApi.exchange
