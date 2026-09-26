import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TagTaxonomyPage } from './TagTaxonomyPage'
import type { ReactNode } from 'react'

const mocks = vi.hoisted(() => ({
  listCategories: vi.fn(),
  listTags: vi.fn(),
  listRelatedCourses: vi.fn(),
  login: vi.fn(),
  auth: {
    initialized: true,
    isAuthenticated: false,
    profile: undefined,
    login: vi.fn(),
    logout: vi.fn(),
    getAccessToken: vi.fn().mockResolvedValue('token'),
    emailVerificationRequired: false,
  },
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => mocks.auth,
}))

vi.mock('./data/tagTaxonomyApi', () => ({
  createCategory: mocks.listCategories,
  createTag: mocks.listTags,
  deleteCategory: mocks.listCategories,
  deleteTag: mocks.listTags,
  listCategories: mocks.listCategories,
  listRelatedCourses: mocks.listRelatedCourses,
  listTags: mocks.listTags,
  updateCategory: mocks.listCategories,
  updateTag: mocks.listTags,
}))

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <TagTaxonomyPage />
    </QueryClientProvider>,
  )
}

describe('TagTaxonomyPage', () => {
  beforeEach(() => {
    mocks.auth.isAuthenticated = false
    mocks.auth.login.mockReset()
    mocks.listCategories
      .mockReset()
      .mockResolvedValue([{ id: 1, name: 'Matemática' }])
    mocks.listTags
      .mockReset()
      .mockResolvedValue([
        { id: 2, name: 'Álgebra', categoryId: 1, parentTagId: null },
      ])
    mocks.listRelatedCourses
      .mockReset()
      .mockResolvedValue([
        { id: 10, code: 'MA141', name: 'Cálculo I', credits: 6 },
      ])
  })

  it('shows the public taxonomy and related courses', async () => {
    renderPage()

    expect(await screen.findByText('Matemática')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Álgebra' }))

    expect(await screen.findByText('Cálculo I')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Contribuir' })).toBeTruthy()
  })

  it('starts login from the public page', async () => {
    renderPage()

    await screen.findByText('Álgebra')
    fireEvent.click(screen.getByRole('button', { name: 'Contribuir' }))

    expect(mocks.auth.login).toHaveBeenCalledWith(window.location.href)
  })

  it('activates contribution actions for authenticated users', async () => {
    mocks.auth.isAuthenticated = true
    renderPage()

    await screen.findByText('Álgebra')
    fireEvent.click(screen.getByRole('button', { name: 'Álgebra' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Contribuir' }))

    expect(screen.getByRole('button', { name: 'Editar tag' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Nova tag filha' })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Desativar contribuição' }),
    ).toBeTruthy()
  })
})
