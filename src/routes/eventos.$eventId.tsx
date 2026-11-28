import { createFileRoute } from '@tanstack/react-router'
import { readReturnTo } from '@/lib/navigation'
import { EventDetailPage } from '@/features/groups'

export const Route = createFileRoute('/eventos/$eventId')({
  validateSearch: (search: Record<string, unknown>): { returnTo?: string } => ({ returnTo: readReturnTo(search.returnTo) }),
  component: () => {
    const { eventId } = Route.useParams()
    return <EventDetailPage eventId={Number(eventId)} />
  },
})
