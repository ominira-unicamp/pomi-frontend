import { createFileRoute } from '@tanstack/react-router'

import { MyProfileLayout } from '@/features/social'

export const Route = createFileRoute('/perfil')({ component: MyProfileLayout })
