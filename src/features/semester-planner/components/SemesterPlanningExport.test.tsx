import { createRef } from 'react'
import { render, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SemesterPlanningExport } from './SemesterPlanningExport'
import type { SemesterPlanningExportData } from '../model/semesterPlanningExport'

const data: SemesterPlanningExportData = {
  name: 'Novo planejamento de semestre',
  period: { id: 1, year: 2027, yearPeriod: 'FIRST_SEMESTER', startDate: '' },
  courses: [
    { id: 1, code: 'MC949', name: 'Visão Computacional', credits: 4 },
    { id: 2, code: 'MC030', name: 'Projeto Final de Graduação', credits: 12 },
  ],
  classes: [1, 2].map((id) => ({
    id,
    courseId: id,
    courseCode: id === 1 ? 'MC949' : 'MC030',
    code: 'A',
    professors:
      id === 1
        ? [
            { id: 1, name: 'Ana Silva' },
            { id: 2, name: 'Carlos Souza' },
          ]
        : [],
  })),
  meetings: [
    {
      id: 1,
      classId: 1,
      dayOfWeek: 'MONDAY',
      start: '16:00',
      end: '18:00',
      roomCode: 'CC51',
    },
  ],
}

describe('semester export composition', () => {
  it('lists all selected classes together with professors and unscheduled status', () => {
    const { container } = render(
      <SemesterPlanningExport
        data={data}
        theme="light"
        captureRef={createRef()}
      />,
    )
    const sections = container.querySelectorAll('section')
    expect(container.querySelector('h1')?.textContent).toBe(
      '2027 · 1º semestre',
    )
    expect(container.textContent).toContain(
      '2 disciplinas · 16 créditos',
    )
    expect(within(sections[0]).getByText('Visão Computacional')).toBeTruthy()
    expect(sections).toHaveLength(1)
    expect(
      within(sections[0]).queryByText('Disciplinas selecionadas'),
    ).toBeNull()
    expect(
      within(sections[0]).getByText('Projeto Final de Graduação'),
    ).toBeTruthy()
    expect(
      within(sections[0]).getByText('Professores: Ana Silva, Carlos Souza'),
    ).toBeTruthy()
    expect(
      within(sections[0]).getByText('Professor não informado'),
    ).toBeTruthy()
    expect(sections[0].textContent).not.toContain('Sem horário cadastrado')
    expect(sections[0].textContent).not.toContain('16:00')
    const block = container.querySelector('.semester-export-block')!
    const swatch = sections[0].querySelector('.semester-export-swatch')!
    expect(block.classList.contains('semester-export-color-1')).toBe(true)
    expect(swatch.classList.contains('semester-export-color-1')).toBe(true)
    expect((block as HTMLElement).style.height).toBe('164px')
  })
  it('keeps meeting details in the list when a short block has limited space', () => {
    const shortData = {
      ...data,
      name: 'Meu semestre',
      meetings: [{ ...data.meetings[0], end: '16:30' }],
    }
    const { container } = render(
      <SemesterPlanningExport
        data={shortData}
        theme="dark"
        captureRef={createRef()}
      />,
    )
    expect(container.querySelector('h1')?.textContent).toBe('Meu semestre')
    expect(
      container.querySelector('.semester-export-meeting')?.textContent,
    ).toContain('Seg · 16:00–16:30 · CC51')
  })
})
