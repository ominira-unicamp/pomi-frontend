import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { afterEach, expect, it, vi } from 'vitest'
import { PendingPlanningChanges } from './PendingPlanningChanges'

const histories: Array<ReturnType<typeof createBrowserHistory>> = []
afterEach(() => {
  histories.splice(0).forEach((history) => history.destroy())
})
function renderPlanning(
  flush = vi.fn(() => Promise.resolve(true)),
  discard = vi.fn(),
) {
  window.history.replaceState(null, '', '/')
  const history = createBrowserHistory({ window })
  histories.push(history)
  const root = createRootRoute({ component: Outlet })
  const editing = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: () => (
      <>
        <PendingPlanningChanges pending flush={flush} discard={discard} />
        <Link to="/sobre">Sair do plano</Link>
      </>
    ),
  })
  const destination = createRoute({
    getParentRoute: () => root,
    path: '/sobre',
    component: () => <h1>Destino</h1>,
  })
  const router = createRouter({
    routeTree: root.addChildren([editing, destination]),
    history,
  })
  render(<RouterProvider router={router} />)
  return { router, flush, discard }
}
it('keeps the current session when the user chooses to continue editing', async () => {
  const { router, flush, discard } = renderPlanning()
  fireEvent.click(await screen.findByRole('link', { name: 'Sair do plano' }))
  fireEvent.click(
    await screen.findByRole('button', { name: 'Continuar editando' }),
  )
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  expect(router.state.location.pathname).toBe('/')
  expect(flush).not.toHaveBeenCalled()
  expect(discard).not.toHaveBeenCalled()
})
it('stays on failure and navigates only after a successful retry', async () => {
  const flush = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true)
  const { router } = renderPlanning(flush)
  fireEvent.click(await screen.findByRole('link', { name: 'Sair do plano' }))
  fireEvent.click(await screen.findByRole('button', { name: 'Salvar e sair' }))
  expect(await screen.findByRole('alert')).toBeTruthy()
  expect(router.state.location.pathname).toBe('/')
  fireEvent.click(screen.getByRole('button', { name: 'Salvar e sair' }))
  expect(await screen.findByRole('heading', { name: 'Destino' })).toBeTruthy()
  expect(flush).toHaveBeenCalledTimes(2)
})
it('discards unsent work when leaving without waiting', async () => {
  const { discard, flush } = renderPlanning()
  fireEvent.click(await screen.findByRole('link', { name: 'Sair do plano' }))
  fireEvent.click(
    await screen.findByRole('button', { name: 'Sair sem esperar' }),
  )
  expect(await screen.findByRole('heading', { name: 'Destino' })).toBeTruthy()
  expect(discard).toHaveBeenCalledOnce()
  expect(flush).not.toHaveBeenCalled()
})
