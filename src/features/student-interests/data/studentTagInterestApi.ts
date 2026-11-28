import type { UserInterest } from '@ominira/pomi-sdk/generated/app'
import { pomiSdk } from '@/api/client'

export type UserInterestTag = UserInterest

type GetAccessToken = () => Promise<string>

export function listUserInterests(
  userId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.userInterests.listAll(userId, {}, { getAccessToken })
}

export function putUserInterest(
  userId: number,
  tagId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.userInterests.update(userId, tagId, {
    getAccessToken,
  })
}

export function deleteUserInterest(
  userId: number,
  tagId: number,
  getAccessToken: GetAccessToken,
) {
  return pomiSdk.app.userInterests.delete(userId, tagId, {
    getAccessToken,
  })
}
