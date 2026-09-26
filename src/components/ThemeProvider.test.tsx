import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ThemeProvider, useTheme } from '@/components/ThemeProvider'

function ThemeProbe() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  return (
    <div>
      <output>{`${theme}:${resolvedTheme}`}</output>
      <button type="button" onClick={() => setTheme('dark')}>
        Escuro
      </button>
    </div>
  )
}

describe('ThemeProvider', () => {
  it('uses the system preference by default', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByText('system:dark')).toBeTruthy()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('persists an explicit theme', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Escuro' }))

    expect(screen.getByText('dark:dark')).toBeTruthy()
    expect(window.localStorage.getItem('pomi-theme')).toBe('dark')
  })
})
