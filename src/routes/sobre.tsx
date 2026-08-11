import { createFileRoute } from '@tanstack/react-router'

import { AboutPage } from '@/about/AboutPage'

export const Route = createFileRoute('/sobre')({
  component: AboutPage,
})
