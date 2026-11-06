import { createFileRoute } from '@tanstack/react-router'
import { MyGroupsPage } from '@/features/groups'

export const Route = createFileRoute('/meus-grupos/')({
  component: MyGroupsPage,
})
