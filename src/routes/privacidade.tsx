import { createFileRoute } from '@tanstack/react-router'

import { PrivacyPolicyPage } from '@/features/privacy'

export const Route = createFileRoute('/privacidade')({
  component: PrivacyPolicyPage,
})
