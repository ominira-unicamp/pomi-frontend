import { createFileRoute } from '@tanstack/react-router'

import { PersonProfilePage } from '@/features/social'

export const Route = createFileRoute('/perfis/$publicId')({
  component: PersonProfileRoute,
})

function PersonProfileRoute() {
  const { publicId } = Route.useParams()
  return <PersonProfilePage publicId={publicId} />
}
