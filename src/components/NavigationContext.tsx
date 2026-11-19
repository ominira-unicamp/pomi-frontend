import { createContext, forwardRef, useContext } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import type { ComponentProps, ReactNode } from 'react'
import type { NavigationSearch } from '@/lib/navigation'
import {
  isContextualDestination,
  navigationHref,
  parseNavigationSearch,
  readReturnTo,
} from '@/lib/navigation'

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
  if (
    props.to === '/grupos/$groupId/gerenciar/eventos' &&
    origin.split('?')[0] === location.pathname.split('/eventos')[0] + '/eventos'
  ) {
    const target = new URL(origin, 'https://pomi.invalid')
    return (
      <Link
        {...props}
        search={
          (() => parseNavigationSearch(target.searchParams)) as unknown as ComponentProps<
            typeof Link
          >['search']
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
          ...(props.to === '/disciplinas/$courseId' &&
          location.pathname.startsWith('/disciplinas/')
            ? { catalogYear: location.search.catalogYear }
            : {}),
          ...(typeof search === 'function'
            ? search(previous)
            : search === true
              ? previous
              : search),
          returnTo: origin,
        })) as ComponentProps<typeof Link>['search']
      }
    />
  )
}) as typeof Link
