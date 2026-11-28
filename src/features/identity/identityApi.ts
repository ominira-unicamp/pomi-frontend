import type { CurrentUser } from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

export type { CurrentUser }

export function getCurrentUser(getAccessToken: () => Promise<string>) {
  return pomiSdk.app.currentUser.get({ getAccessToken })
}

export async function requireCurrentUserId(
  getAccessToken: () => Promise<string>,
) {
  const current = await getCurrentUser(getAccessToken)
  if (current.kind !== 'HUMAN' || typeof current.userId !== 'number')
    throw new Error('Esta operação exige uma conta de usuário.')
  return current.userId
}
