import { createFileRoute } from '@tanstack/react-router'
import { FriendsPage } from '@/friends/FriendsPage'

export const Route = createFileRoute('/amigos')({ component: FriendsPage })
