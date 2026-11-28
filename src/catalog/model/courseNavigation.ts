import type { NavigationSearch } from '@/lib/navigation'

export function courseContextSearch(
  destination: string | undefined,
  pathname: string,
  search: NavigationSearch,
): NavigationSearch {
  return destination === '/disciplinas/$courseId' &&
    pathname.startsWith('/disciplinas/')
    ? { catalogYear: search.catalogYear }
    : {}
}
