import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ThemeProvider } from '@/components/ThemeProvider'
import { DesignSystemPage } from '@/routes/[_]design-system'

describe('DesignSystemPage', () => {
  it('renders the shared UI contract', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="design-system-test-theme">
        <DesignSystemPage />
      </ThemeProvider>,
    )

    expect(
      screen.getByRole('heading', { name: 'Design system POMI' }),
    ).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Ações e campos' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Composições' })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Selecionar locais' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: 'Sobreposições e navegação' }),
    ).toBeTruthy()
    expect(screen.getByText('Tema claro')).toBeTruthy()
    expect(screen.getByText('Tema escuro')).toBeTruthy()
  })
})
