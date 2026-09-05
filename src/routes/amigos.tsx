import { createFileRoute } from '@tanstack/react-router'
import { FriendsPage } from '@/features/friends'

export const Route = createFileRoute('/amigos')({ component: FriendsPage })
