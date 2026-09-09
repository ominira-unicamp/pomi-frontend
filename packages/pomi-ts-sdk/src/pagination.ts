import { defineEndpoint, pathFromInput } from './endpoint'
import type { ApiTarget } from './endpoint'
import type { PomiClient } from './client'

export type ApiPage<T> = Readonly<{
  data: ReadonlyArray<T>
  _paths?: Readonly<{ next: string | null }>
}>

type ContinuationInput = Readonly<{ path: string }>

const dataContinuationEndpoint = defineEndpoint<
  ContinuationInput,
  ApiPage<unknown>
>({
  target: 'data',
  method: 'GET',
  path: pathFromInput<ContinuationInput>('path'),
  authentication: 'public',
  response: { kind: 'json' },
})

const appContinuationEndpoint = defineEndpoint<
  ContinuationInput,
  ApiPage<unknown>
>({
  target: 'app',
  method: 'GET',
  path: pathFromInput<ContinuationInput>('path'),
  authentication: 'public',
  response: { kind: 'json' },
})

export async function collectPages<T>(
  client: PomiClient,
  target: ApiTarget,
  firstPage: Promise<ApiPage<T>>,
) {
  const items: Array<T> = []
  let page = await firstPage
  items.push(...page.data)
  while (page._paths?.next) {
    const endpoint =
      target === 'data' ? dataContinuationEndpoint : appContinuationEndpoint
    page = (await client.execute(endpoint, {
      path: page._paths.next,
    })) as ApiPage<T>
    items.push(...page.data)
  }
  return items
}
