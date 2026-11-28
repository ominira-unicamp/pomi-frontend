import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SemesterPlanningExportDialog } from './SemesterPlanningExportDialog'
import type { SemesterPlanningExportData } from '../model/semesterPlanningExport'

const { toBlob } = vi.hoisted(() => ({ toBlob: vi.fn() }))
vi.mock('html-to-image', () => ({ toBlob }))
vi.mock('@/components/patterns/ResponsiveDialog', () => ({
  ResponsiveDialog: ({ children }: { children: React.ReactNode }) => (
    <div role="dialog">{children}</div>
  ),
}))
const data: SemesterPlanningExportData = {
  name: 'Meu semestre',
  period: { id: 1, year: 2027, yearPeriod: 'FIRST_SEMESTER', startDate: '' },
  courses: [],
  classes: [],
  meetings: [],
}

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (callback: () => void) => {
    callback()
    return 1
  })
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { ready: Promise.resolve() },
  })
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = vi.fn().mockReturnValue('blob:png')
      static revokeObjectURL = vi.fn()
    },
  )
  toBlob.mockReset().mockResolvedValue(new Blob(['png'], { type: 'image/png' }))
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('semester export dialog', () => {
  it('previews the generated image, switches themes and releases URLs on close', async () => {
    const onClose = vi.fn()
    const { unmount } = render(
      <SemesterPlanningExportDialog
        data={data}
        initialTheme="dark"
        onClose={onClose}
      />,
    )
    expect(
      screen
        .getByRole('button', { name: 'Baixar PNG' })
        .hasAttribute('disabled'),
    ).toBe(true)
    await screen.findByRole('img')
    expect(screen.getByLabelText('Tema da imagem')).toHaveProperty(
      'value',
      'dark',
    )
    expect(
      screen.getByRole('link', { name: 'Baixar PNG' }).getAttribute('download'),
    ).toBe('planejamento-2027s1.png')
    fireEvent.change(screen.getByLabelText('Tema da imagem'), {
      target: { value: 'light' },
    })
    await waitFor(() => expect(toBlob).toHaveBeenCalledTimes(2))
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:png')
    await screen.findByRole('img', { name: /tema claro/ })
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onClose).toHaveBeenCalledOnce()
    unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
  })
  it('offers a retry after conversion fails', async () => {
    toBlob.mockRejectedValueOnce(new Error('failed'))
    render(
      <SemesterPlanningExportDialog
        data={data}
        initialTheme="light"
        onClose={vi.fn()}
      />,
    )
    await screen.findByRole('alert')
    expect(screen.queryByRole('link', { name: 'Baixar PNG' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await screen.findByRole('img')
    expect(screen.queryByRole('alert')).toBeNull()
  })
  it('ignores a previous generation that finishes after a theme change', async () => {
    let finishFirst!: (blob: Blob) => void
    toBlob.mockImplementationOnce(
      () =>
        new Promise<Blob>((resolve) => {
          finishFirst = resolve
        }),
    )
    render(
      <SemesterPlanningExportDialog
        data={data}
        initialTheme="light"
        onClose={vi.fn()}
      />,
    )
    await waitFor(() => expect(toBlob).toHaveBeenCalledOnce())
    fireEvent.change(screen.getByLabelText('Tema da imagem'), {
      target: { value: 'dark' },
    })
    await screen.findByRole('img', { name: /tema escuro/ })
    await act(async () => {
      finishFirst(new Blob(['old']))
      await Promise.resolve()
    })
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
    expect(screen.getByRole('img').getAttribute('alt')).toContain('escuro')
  })
})
