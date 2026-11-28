import { createFileRoute } from '@tanstack/react-router'

import { FriendshipsPage } from '@/features/social'

export const Route = createFileRoute('/perfil/amigos')({
  component: FriendsTab,
})

function FriendsTab() {
  return <FriendshipsPage view="friends" />
}
