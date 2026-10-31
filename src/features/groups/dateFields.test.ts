import { describe, expect, it } from 'vitest'
import {
  displayLocalDateTime,
  parseLocalDateTime,
  preserveUnchangedInstant,
} from './dateFields'

describe('datas locais dos grupos', () => {
  it('preserva o instante original ao reabrir e salvar sem alterar os campos', () => {
    const original = '2026-10-20T03:00:37.000Z'
    const shown = displayLocalDateTime(original)
    expect(preserveUnchangedInstant(shown.date, shown.time, original)).toEqual({
      value: original,
      error: null,
    })
  })

  it('converte a meia-noite local em instante e reabre com os mesmos campos', () => {
    const parsed = parseLocalDateTime('20/10/2026', '00:00')
    expect(parsed.error).toBeNull()
    expect(displayLocalDateTime(parsed.value)).toEqual({
      date: '20/10/2026',
      time: '00:00',
    })
  })

  it('aceita período opcional e rejeita datas impossíveis ou incompletas', () => {
    expect(parseLocalDateTime('', '')).toEqual({ value: null, error: null })
    expect(parseLocalDateTime('31/02/2026', '12:00').error).toBeTruthy()
    expect(parseLocalDateTime('20/10/2026', '').error).toBeTruthy()
  })
})
