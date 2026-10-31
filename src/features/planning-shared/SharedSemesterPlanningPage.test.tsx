import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { SharedSemesterPlanningPage } from './SharedSemesterPlanningPage'
import type { ReactNode } from 'react'

import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const mocks = vi.hoisted(() => ({ getPublic: vi.fn() }))
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))
vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({ initialized: true, isAuthenticated: false }),
}))
vi.mock('@/features/student/hooks/useStudentProfile', () => ({
  useCurrentStudent: () => ({ isLoading: false }),
}))
vi.mock('./data/sharedPeriodPlanningApi', () => ({
  getPublicSharedPeriodPlanning: mocks.getPublic,
  getSharedPeriodPlanningForStudent: vi.fn(),
  copySharedPeriodPlanning: vi.fn(),
}))

it('shows the public author avatar and removes the identity when the author becomes private', async () => {
  const planning = {
    shareId: 'share',
    name: 'Plano de Ana',
    visibility: 'PUBLIC',
    studyPeriodId: 1,
    studyPeriodYear: 2026,
    studyPeriodYearPeriod: 'FIRST_SEMESTER',
    classes: [],
    owner: {
      publicId: 'ana',
      displayName: 'Ana',
      avatarMediaId: 'author-avatar',
    },
  }
  mocks.getPublic.mockResolvedValue(planning)
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const view = render(
    <QueryClientProvider client={client}>
      <SharedSemesterPlanningPage shareId="share" />
    </QueryClientProvider>,
  )
  await screen.findByText('Ana')
  expect(
    view.container.querySelector(
      'img[src$="/media/author-avatar/avatarSmall"]',
    ),
  ).toBeTruthy()
  act(() => {
    client.setQueryData(
      privateQueryKeys.sharedPeriodPlanning('anonymous-session', 'share'),
      { ...planning, owner: null },
    )
  })
  await waitFor(() =>
    expect(
      view.container.querySelector(
        'img[src$="/media/author-avatar/avatarSmall"]',
      ),
    ).toBeNull(),
  )
  expect(screen.queryByText('Ana')).toBeNull()
  expect(screen.getByText('Estudante do POMI')).toBeTruthy()
})
