import { createFileRoute } from '@tanstack/react-router'

import { PublicPeoplePage } from '@/features/social'

export const Route = createFileRoute('/pessoas')({
  component: PublicPeoplePage,
})
