import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState, LoadingState, PageHeader } from '@/components/PageLayout'

describe('page compositions', () => {
  it('exposes the page hierarchy and empty state', () => {
    render(
      <>
        <PageHeader
          eyebrow="Planejamento acadêmico"
          title="Seu planejamento"
          description="Organize seus períodos."
        />
        <EmptyState title="Sem períodos" description="Comece quando quiser." />
      </>,
    )

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Seu planejamento',
    )
    expect(screen.getByRole('heading', { name: 'Sem períodos' })).toBeTruthy()
  })

  it('announces loading state', () => {
    render(<LoadingState label="Carregando currículo" />)
    expect(screen.getByRole('status').textContent).toContain(
      'Carregando currículo',
    )
  })
})
