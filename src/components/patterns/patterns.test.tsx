import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ActionBar } from '@/components/patterns/ActionBar'
import { Badge } from '@/components/patterns/Badge'
import { DataList, DataRow } from '@/components/patterns/DataList'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/patterns/Field'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import {
  Section,
  SectionContent,
  SectionTitle,
} from '@/components/patterns/Section'
import { Input } from '@/components/ui/input'

describe('shared interface patterns', () => {
  it('associates a field label, description and error with its control', () => {
    render(
      <Field>
        <FieldLabel htmlFor="grade">Nota</FieldLabel>
        <Input id="grade" aria-describedby="grade-description grade-error" />
        <FieldDescription id="grade-description">
          De zero a dez.
        </FieldDescription>
        <FieldError id="grade-error">Nota inválida.</FieldError>
      </Field>,
    )

    expect(screen.getByLabelText('Nota')).toBeTruthy()
    expect(screen.getByRole('alert').textContent).toContain('Nota inválida')
  })

  it('applies semantic roles to operation feedback', () => {
    const view = render(<InlineMessage variant="error">Falhou</InlineMessage>)
    expect(screen.getByRole('alert').textContent).toContain('Falhou')

    view.rerender(<InlineMessage variant="success">Salvo</InlineMessage>)
    expect(screen.getByRole('status').textContent).toContain('Salvo')
  })

  it('composes badges, sections, actions and data rows', () => {
    render(
      <Section variant="bordered">
        <SectionTitle>Histórico</SectionTitle>
        <SectionContent>
          <DataList>
            <DataRow>
              <span>MC102</span>
              <Badge variant="success">Aprovada</Badge>
            </DataRow>
          </DataList>
          <ActionBar>
            <button>Editar</button>
          </ActionBar>
        </SectionContent>
      </Section>,
    )

    expect(screen.getByRole('heading', { name: 'Histórico' })).toBeTruthy()
    expect(screen.getByText('Aprovada')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeTruthy()
  })
})
