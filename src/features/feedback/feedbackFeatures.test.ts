import { describe, expect, it } from 'vitest'

import { feedbackFeatureKeys } from './feedbackReportApi'
import {
  feedbackFeatureLabels,
  selectableFeedbackFeatures,
} from './feedbackFeatures'

describe('feedback areas', () => {
  it('offers the current areas using keys accepted by the API', () => {
    expect(
      selectableFeedbackFeatures.map((key) => feedbackFeatureLabels[key]),
    ).toEqual([
      'Início',
      'Situação do curso',
      'Planejamento de currículo',
      'Planejamento de horários',
      'Agenda e faltas',
      'Cursos',
      'Disciplinas',
      'Meu perfil e privacidade',
      'Pessoas e amigos',
      'Grupos',
      'Eventos',
      'Tags e interesses',
      'Intercâmbio',
      'Meus feedbacks',
    ])
    for (const key of selectableFeedbackFeatures) {
      expect(feedbackFeatureKeys).toContain(key)
    }
  })

  it('keeps legacy academic data readable without offering it for new reports', () => {
    expect(feedbackFeatureKeys).toContain('academic-data')
    expect(feedbackFeatureLabels['academic-data']).toBe('Dados acadêmicos')
    expect(selectableFeedbackFeatures).not.toContain('academic-data')
  })
})
