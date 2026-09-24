import type { ApiTarget } from './runtime/operation.js'

type Page<T> = Readonly<{
  data: ReadonlyArray<T>
  links: Readonly<{ next: string | null }>
}>

type PageClient = Readonly<{
  requestPath<T>(target: ApiTarget, path: string): Promise<T>
}>

export async function collectPages<T>(
  client: PageClient,
  target: ApiTarget,
  firstPage: Promise<Page<T>>,
) {
  const collected: T[] = []
  let page = await firstPage
  collected.push(...page.data)
  while (page.links.next) {
    page = await client.requestPath<Page<T>>(target, page.links.next)
    collected.push(...page.data)
  }
  return collected
}
