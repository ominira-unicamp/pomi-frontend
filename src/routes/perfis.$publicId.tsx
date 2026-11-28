import { createFileRoute } from '@tanstack/react-router'
import { readReturnTo } from '@/lib/navigation'

import { PersonProfilePage } from '@/features/social'

export const Route = createFileRoute('/perfis/$publicId')({
  validateSearch: (search: Record<string, unknown>): { returnTo?: string } => ({ returnTo: readReturnTo(search.returnTo) }),
  component: PersonProfileRoute,
})

function PersonProfileRoute() {
  const { publicId } = Route.useParams()
  return <PersonProfilePage publicId={publicId} />
}
