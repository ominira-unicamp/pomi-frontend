import { pomiApi } from '@/api/client'

export type {
  ExchangeNotice,
  ExchangeNoticeFile,
  ExchangeNoticeSubscription,
  ExchangeNoticeSubscriptionPatch,
  ExchangePlace,
} from '@ominira/pomi-sdk/exchange'

export const {
  listExchangeNotices,
  listExchangePlaces,
  getExchangeNoticeSubscription,
  patchExchangeNoticeSubscription,
  buildExchangeSubscriptionPatch,
} = pomiApi.exchange
