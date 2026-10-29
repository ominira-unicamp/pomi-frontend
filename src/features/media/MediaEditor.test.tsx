import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MediaEditor } from './MediaEditor'
import { ApiError } from '@/api/errors'

const mocks = vi.hoisted(() => ({
  sessionSubject: 'person-1',
  getAccessToken: vi.fn().mockResolvedValue('token'),
  uploadMedia: vi.fn(),
  removeMedia: vi.fn(),
}))

vi.mock('@/auth/AuthProvider', () => ({
  useOptionalAuth: () => ({
    sessionSubject: mocks.sessionSubject,
    getAccessToken: mocks.getAccessToken,
  }),
}))
vi.mock('./mediaApi', () => ({
  mediaUrl: () => '/media/example/avatarSmall',
  readPrivateMedia: vi.fn(),
  uploadMedia: mocks.uploadMedia,
  removeMedia: mocks.removeMedia,
}))

function editor() {
  return (
    <MediaEditor
      label="Avatar do estudante"
      target={{ kind: 'studentAvatar', studentId: 7 }}
      mediaId={null}
      preset="avatarSmall"
      onChanged={vi.fn()}
    />
  )
}

function renderEditor() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return render(<QueryClientProvider client={client}>{editor()}</QueryClientProvider>)
}

afterEach(() => {
  cleanup()
  mocks.sessionSubject = 'person-1'
  mocks.uploadMedia.mockReset()
  mocks.removeMedia.mockReset()
  vi.unstubAllGlobals()
})

describe('media editor', () => {
  it('revokes local previews on cancel and unmount', async () => {
    const create = vi.fn().mockReturnValueOnce('blob:preview-one').mockReturnValueOnce('blob:preview-two')
    const revoke = vi.fn()
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = create
        static revokeObjectURL = revoke
      },
    )
    const view = renderEditor()
    const input = screen.getByLabelText('Escolher imagem')
    fireEvent.change(input, {
      target: { files: [new File(['one'], 'one.png', { type: 'image/png' })] },
    })
    await screen.findByAltText('Prévia de avatar do estudante')
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => expect(revoke).toHaveBeenCalledWith('blob:preview-one'))
    fireEvent.change(input, {
      target: { files: [new File(['two'], 'two.png', { type: 'image/png' })] },
    })
    await screen.findByAltText('Prévia de avatar do estudante')
    view.unmount()
    expect(revoke).toHaveBeenCalledWith('blob:preview-two')
  })

  it('aborts an upload when the authenticated session changes', async () => {
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = () => 'blob:preview'
        static revokeObjectURL = () => {}
      },
    )
    mocks.uploadMedia.mockImplementation(() => new Promise(() => {}))
    const view = renderEditor()
    fireEvent.change(screen.getByLabelText('Escolher imagem'), {
      target: { files: [new File(['image'], 'avatar.png', { type: 'image/png' })] },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar imagem' }))
    await waitFor(() => expect(mocks.uploadMedia).toHaveBeenCalledTimes(1))
    const signal = mocks.uploadMedia.mock.calls[0]?.[3] as AbortSignal
    expect(signal.aborted).toBe(false)
    act(() => {
      mocks.sessionSubject = 'person-2'
      view.rerender(
        <QueryClientProvider client={new QueryClient()}>
          {editor()}
        </QueryClientProvider>,
      )
    })
    expect(signal.aborted).toBe(true)
    view.unmount()
  })

  it('explains a media validation failure without losing the selected preview', async () => {
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = () => 'blob:preview'
        static revokeObjectURL = () => {}
      },
    )
    mocks.uploadMedia.mockRejectedValue(new ApiError(422))
    renderEditor()
    fireEvent.change(screen.getByLabelText('Escolher imagem'), {
      target: { files: [new File(['image'], 'avatar.png', { type: 'image/png' })] },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar imagem' }))
    expect((await screen.findByRole('alert')).textContent).toContain(
      'não atende aos formatos ou limites permitidos',
    )
    expect(screen.getByAltText('Prévia de avatar do estudante')).toBeTruthy()
  })
})
