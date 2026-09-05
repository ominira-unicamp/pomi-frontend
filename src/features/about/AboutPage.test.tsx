import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AboutPage } from '@/features/about/AboutPage'

describe('AboutPage', () => {
  it('explains the independent, open and student-led nature of the project', () => {
    render(<AboutPage />)

    expect(screen.getByRole('heading', { name: 'Sobre nós' })).toBeTruthy()
    expect(screen.getByText(/não possui vínculo/i)).toBeTruthy()
    expect(screen.getByText(/completamente FLOSS/i)).toBeTruthy()
    expect(screen.getByText(/sala 340 do IC3/i)).toBeTruthy()
    expect(screen.getByText(/José Victor Santana Barbosa/)).toBeTruthy()
    expect(screen.getByText(/Gabriel Vinicius dos Santos Soares/)).toBeTruthy()
    expect(
      screen
        .getByRole('link', { name: /documentação da API/i })
        .getAttribute('href'),
    ).toMatch(/\/public-docs$/)
    expect(
      screen.getByRole('link', { name: '@ominira.unicamp' }).getAttribute('href'),
    ).toBe('https://www.instagram.com/ominira.unicamp/')
  })
})
