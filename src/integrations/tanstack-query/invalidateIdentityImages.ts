import type { QueryClient } from '@tanstack/react-query'

const identityResources = new Set([
  'social',
  'groups',
  'group-memberships',
  'group-invite-people',
  'shared-period-planning',
  'shared-period-plannings',
  'group-events',
])

export function invalidateIdentityImages(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    predicate: (query) =>
      query.queryKey.some(
        (part) => typeof part === 'string' && identityResources.has(part),
      ),
  })
}
