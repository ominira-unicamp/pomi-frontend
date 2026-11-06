import { createFileRoute } from '@tanstack/react-router'
import { EventDetailPage } from '@/features/groups'

export const Route = createFileRoute('/eventos/$eventId')({
  component: () => {
    const { eventId } = Route.useParams()
    return <EventDetailPage eventId={Number(eventId)} />
  },
})
