import type { FeedbackFeatureKey } from './feedbackReportApi'

export const feedbackFeatureLabels: Record<FeedbackFeatureKey, string> = {
  home: 'Início',
  'course-situation': 'Situação do curso',
  'curriculum-planner': 'Planejamento de currículo',
  'semester-planner': 'Planejamento de horários',
  agenda: 'Agenda e faltas',
  courses: 'Cursos',
  disciplines: 'Disciplinas',
  profile: 'Meu perfil e privacidade',
  social: 'Pessoas e amigos',
  groups: 'Grupos',
  events: 'Eventos',
  tags: 'Tags e interesses',
  exchange: 'Intercâmbio',
  feedback: 'Meus feedbacks',
  'academic-data': 'Dados acadêmicos',
}

export const selectableFeedbackFeatures = [
  'home',
  'course-situation',
  'curriculum-planner',
  'semester-planner',
  'agenda',
  'courses',
  'disciplines',
  'profile',
  'social',
  'groups',
  'events',
  'tags',
  'exchange',
  'feedback',
] as const satisfies ReadonlyArray<FeedbackFeatureKey>
