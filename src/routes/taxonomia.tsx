import { createFileRoute } from '@tanstack/react-router'

import { TagTaxonomyPage } from '@/features/tag-taxonomy'

export const Route = createFileRoute('/taxonomia')({
  component: TagTaxonomyPage,
})
