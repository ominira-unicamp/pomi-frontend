import { useQuery } from '@tanstack/react-query'
import type { ManagedGroupEvent } from '@ominira/pomi-sdk/generated/app'
import { ContextLink as Link, useNavigationContext } from '@/app/navigation/NavigationContext'
import { parseNavigationSearch, readReturnTo } from '@/lib/navigation'
import { groupApi } from '@/features/groups/data/groupApi'
import { eventPeriod } from '@/features/groups/eventTiming'
import { useGroupManagement } from '@/features/groups/GroupManagementLayout'
import { useOptionalAuth } from '@/auth/AuthProvider'

export const statusLabel = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  CANCELLED: 'Cancelado',
} as const

export const eventsPath = '/grupos/$groupId/gerenciar/eventos'

export function eventTime(event: ManagedGroupEvent, now: number) {
  const period = eventPeriod(event, now)
  const time = event.startsAt ? new Date(event.startsAt).getTime() : 0
  if (period === 'undated')
    return { order: 1, label: 'Sem data definida', time }
  if (period === 'ongoing') return { order: 0, label: 'Em andamento', time }
  return period === 'upcoming'
    ? { order: 0, label: 'Futuro', time }
    : { order: 2, label: 'Passado', time }
}

export function EventBack({ groupId }: { groupId: number }) {
  const location = useNavigationContext()
  const origin = readReturnTo(location.search.returnTo, location.pathname)
  const target = origin ? new URL(origin, 'https://pomi.invalid') : undefined
  return (
    <Link
      to={target?.pathname ?? eventsPath}
      params={{ groupId: String(groupId) }}
      search={target ? parseNavigationSearch(target.searchParams) : undefined}
      className="pomi-focus text-sm font-bold text-primary hover:underline"
    >
      ← Eventos do grupo
    </Link>
  )
}

export function useManagedEvents() {
  const { group, userId, own } = useGroupManagement()
  const auth = useOptionalAuth()
  const allowed = own.permissions.some((permission) =>
    permission.startsWith('EVENT_'),
  )
  const query = useQuery({
    queryKey: [
      'private',
      auth.sessionSubject,
      'user',
      userId,
      'groups',
      group.id,
      'events',
    ],
    queryFn: () =>
      groupApi.managedEvents(userId, group.id, auth.getAccessToken),
    enabled: allowed,
    retry: false,
  })
  return { query, allowed }
}
