import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AdminAccess } from '@/features/administration'

export const Route = createFileRoute('/admin')({ component: AdminLayout })

function AdminLayout() {
  return (
    <AdminAccess>
      <Outlet />
    </AdminAccess>
  )
}
