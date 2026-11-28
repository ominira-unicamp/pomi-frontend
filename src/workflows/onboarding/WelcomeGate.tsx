import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useCurrentUser } from '@/features/identity/index'
import { useOptionalAuth } from '@/auth/AuthProvider'

export function WelcomeGate() {
  const auth = useOptionalAuth()
  const current = useCurrentUser()
  const location = useRouterState({
    select: (state) => ({
      href: state.location.href,
      pathname: state.location.pathname,
    }),
  })
  useEffect(() => {
    if (
      auth.isAuthenticated &&
      current.data?.welcomePending &&
      location.pathname.replace(/\/$/, '') !== '/boas-vindas'
    ) {
      window.location.replace(
        '/boas-vindas?returnTo=' + encodeURIComponent(location.href),
      )
    }
  }, [
    auth.isAuthenticated,
    current.data?.welcomePending,
    location.href,
    location.pathname,
  ])
  return null
}
