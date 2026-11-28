import type { QueryClient } from '@tanstack/react-query'

export const taxonomyKeys = {
  categories: ['public', 'tag-taxonomy', 'categories'] as const,
  tags: ['public', 'tag-taxonomy', 'tags'] as const,
}

export function invalidateTagConsumers(client: QueryClient) {
  return Promise.all([
    client.invalidateQueries({ queryKey: ['public', 'tag-taxonomy'] }),
    client.invalidateQueries({ queryKey: ['public', 'course-catalog'] }),
    client.invalidateQueries({ queryKey: ['public', 'group-tags'] }),
    client.invalidateQueries({ queryKey: ['public', 'groups'] }),
    client.invalidateQueries({ queryKey: ['public', 'group-events'] }),
    client.invalidateQueries({ queryKey: ['private'] }),
  ])
}
