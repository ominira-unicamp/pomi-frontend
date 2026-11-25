import { createFileRoute } from '@tanstack/react-router'
import { WelcomePage } from '@/features/identity'

export const Route = createFileRoute('/boas-vindas')({ component: WelcomePage })
