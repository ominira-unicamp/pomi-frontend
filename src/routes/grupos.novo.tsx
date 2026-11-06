import { createFileRoute } from '@tanstack/react-router'
import { CreateGroupPage } from '@/features/groups'

export const Route = createFileRoute('/grupos/novo')({
  component: CreateGroupPage,
})
