import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/meus-grupos')({ component: Outlet })
