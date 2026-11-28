import { createFileRoute } from '@tanstack/react-router'
import { WelcomePage } from '@/workflows/onboarding'

export const Route = createFileRoute('/boas-vindas')({ component: WelcomePage })
