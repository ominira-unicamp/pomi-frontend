import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SidebarContextValue = {
  collapsed: boolean
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  toggle: () => void
}

const sidebarPreferenceKey = 'pomi.sidebar.collapsed'

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      return window.localStorage.getItem(sidebarPreferenceKey) !== 'false'
    } catch {
      return true
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    try {
      window.localStorage.setItem(sidebarPreferenceKey, String(collapsed))
    } catch {}
  }, [collapsed])
  const value = useMemo(
    () => ({
      collapsed,
      mobileOpen,
      setMobileOpen,
      toggle: () => setCollapsed((current) => !current),
    }),
    [collapsed, mobileOpen],
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context)
    throw new Error('useSidebar must be used within SidebarProvider.')
  return context
}

export function Sidebar({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const { collapsed } = useSidebar()
  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        'sticky top-18 hidden h-[calc(100svh-4.5rem)] min-h-0 shrink-0 self-start border-r-2 border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex md:w-64 md:flex-col data-[collapsed=true]:md:w-20',
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

export function SidebarContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex min-h-0 flex-1 flex-col p-3', className)}
      {...props}
    />
  )
}

export function SidebarFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-t border-sidebar-border p-3', className)}
      {...props}
    />
  )
}
