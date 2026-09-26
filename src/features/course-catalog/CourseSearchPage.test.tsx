import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CourseSearchPage } from './CourseSearchPage'
import type { ReactNode } from 'react'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

vi.mock('@/features/course-catalog/data/courseCatalogApi', () => ({
  listUnits: vi
    .fn()
    .mockResolvedValue([{ id: 1, code: 'IC', name: 'Computação' }]),
  listCatalogs: vi.fn().mockResolvedValue([{ id: 1, year: 2026 }]),
  listCategories: vi.fn().mockResolvedValue([]),
  listTags: vi.fn().mockResolvedValue([]),
  listCourses: vi.fn().mockResolvedValue({ data: [], total: 0 }),
}))

describe('CourseSearchPage filters', () => {
  it('opens from both the filters button and the add-filter action on desktop', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList)
    const onSearchChange = vi.fn()
    render(
      <QueryClientProvider client={new QueryClient()}>
        <CourseSearchPage
          search={{ page: 1 }}
          onSearchChange={onSearchChange}
        />
      </QueryClientProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Filtros' }))
    expect(screen.getByPlaceholderText('Buscar filtro...')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /^Fechar$/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Mais filtros' }))
    expect(screen.getByPlaceholderText('Buscar filtro...')).toBeTruthy()
  })
})
