import { createFileRoute } from '@tanstack/react-router'

import { ProfilePage } from '@/features/social'

export const Route = createFileRoute('/perfil/')({ component: ProfilePage })
