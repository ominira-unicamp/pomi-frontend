import { appApi, dataApi } from './endpoint'
import type { ApiTarget } from './endpoint'
import type { PomiClient } from './client'

export type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>

type ContinuationInput = Readonly<{ path: string }>

const dataContinuationInterface = dataApi.interface('')
const appContinuationInterface = appApi.public.interface('')
const dataContinuationEndpoints = dataContinuationInterface.define({
  next: dataContinuationInterface.get<ApiPage<unknown>, ContinuationInput>('', {
    path: { fromInput: 'path' },
  }),
})
const appContinuationEndpoints = appContinuationInterface.define({
  next: appContinuationInterface.get<ApiPage<unknown>, ContinuationInput>('', {
    path: { fromInput: 'path' },
  }),
})

export async function collectPages<T>(
  client: PomiClient,
  target: ApiTarget,
  firstPage: Promise<ApiPage<T>>,
) {
  const items: Array<T> = []
  const api = client.bind(
    target === 'data' ? dataContinuationEndpoints : appContinuationEndpoints,
  )
  let page = await firstPage
  items.push(...page.data)
  while (page._paths?.next) {
    page = (await api.next({
      path: page._paths.next,
    })) as ApiPage<T>
    items.push(...page.data)
  }
  return items
}
