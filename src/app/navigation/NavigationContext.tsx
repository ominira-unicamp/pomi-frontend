import { createContext, forwardRef, useContext } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import type { ComponentProps, ReactNode } from 'react'
import type { NavigationSearch } from '@/lib/navigation'
import { eventManagementReturnTo } from '@/features/groups/groupNavigation'
import { courseContextSearch } from '@/catalog/model/courseNavigation'
import { isContextualDestination, navigationHref, parseNavigationSearch, readReturnTo } from '@/lib/navigation'

const NavigationContext = createContext<{
  pathname: string
  search: NavigationSearch
}>({ pathname: '', search: {} })

export function NavigationContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const location = useRouterState({
    select: (state) => ({
      pathname: state.location.pathname,
      search: state.location.search,
    }),
  })
  return (
    <NavigationContext.Provider value={location}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigationContext() {
  return useContext(NavigationContext)
}

export const ContextLink = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof Link>
>(function ContextLink({ search, ...props }, ref) {
  const location = useNavigationContext()
  const inherited = readReturnTo(location.search.returnTo, location.pathname)
  const origin =
    inherited ??
    readReturnTo(navigationHref(location.pathname, location.search))
  if (!origin) return <Link {...props} search={search} ref={ref} />
  const eventReturnTo = eventManagementReturnTo(
    props.to,
    location.pathname,
    origin,
  )
  if (eventReturnTo) {
    const target = new URL(eventReturnTo, 'https://pomi.invalid')
    return (
      <Link
        {...props}
        search={
          (() =>
            parseNavigationSearch(
              target.searchParams,
            )) as unknown as ComponentProps<typeof Link>['search']
        }
        ref={ref}
      />
    )
  }
  if (!isContextualDestination(props.to))
    return <Link {...props} search={search} ref={ref} />
  return (
    <Link
      {...props}
      ref={ref}
      search={
        ((previous: NavigationSearch) => ({
          ...courseContextSearch(props.to, location.pathname, location.search),
          ...(typeof search === 'function'
            ? search(previous)
            : search === true
              ? previous
              : search),
          returnTo: origin,
        })) as unknown as ComponentProps<typeof Link>['search']
      }
    />
  )
}) as typeof Link
