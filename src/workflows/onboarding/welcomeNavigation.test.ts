import { expect, it } from 'vitest'
import { welcomeReturnTo } from '@/workflows/onboarding/welcomeNavigation'

it('preserves internal destinations including query and fragment', () => {
  expect(welcomeReturnTo('/perfil?tab=a#contato', 'https://pomi.app')).toBe(
    '/perfil?tab=a#contato',
  )
})
it.each([
  null,
  'https://external.test',
  '//external.test',
  '/boas-vindas',
  '/boas-vindas/',
  '/\\external.test',
])('rejects unsafe or recursive return %s', (value) => {
  expect(welcomeReturnTo(value, 'https://pomi.app')).toBe('/')
})
