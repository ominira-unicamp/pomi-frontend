import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { EventsPage } from '@/features/groups'

type Period = 'upcoming' | 'past' | 'undated'

export const Route = createFileRoute('/eventos/')({
  validateSearch: (search: Record<string, unknown>): { period?: Period } => ({
    period:
      search.period === 'past' || search.period === 'undated'
        ? search.period
        : undefined,
  }),
  component: EventsIndexRoute,
})

function EventsIndexRoute() {
  const navigate = useNavigate()
  const { period } = Route.useSearch()
  return (
    <EventsPage
      period={period ?? 'upcoming'}
      onPeriodChange={(value) =>
        void navigate({
          to: '/eventos',
          search: { period: value === 'upcoming' ? undefined : value },
        })
      }
    />
  )
}
