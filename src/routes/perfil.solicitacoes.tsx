import { createFileRoute } from '@tanstack/react-router'

import { FriendshipsPage } from '@/features/social'

export const Route = createFileRoute('/perfil/solicitacoes')({
  component: FriendRequestsTab,
})

function FriendRequestsTab() {
  return <FriendshipsPage view="requests" />
}
