import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AuthRequiredState } from '@/components/AuthRequiredState'

describe('AuthRequiredState', () => {
  it('explains the protected destination and starts login', () => {
    const onLogin = vi.fn()
    render(
      <AuthRequiredState
        title="Entre para acessar"
        description="Este recurso requer uma conta."
        onLogin={onLogin}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Entre para acessar' }),
    ).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(onLogin).toHaveBeenCalledOnce()
  })
})
