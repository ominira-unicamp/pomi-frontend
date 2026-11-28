import { appApiUrl, pomiSdk } from '@/api/client'

export type MediaTarget =
  | { kind: 'userAvatar'; userId: number }
  | { kind: 'groupAvatar'; userId: number; groupId: number }

export type MediaPreset = 'avatarSmall' | 'avatarLarge'
type Token = () => Promise<string>

export function mediaUrl(mediaId: string, preset: MediaPreset) {
  return new URL(`/media/${encodeURIComponent(mediaId)}/${preset}`, appApiUrl)
    .href
}

export function readPrivateMedia(
  mediaId: string,
  preset: MediaPreset,
  getAccessToken: Token,
  signal: AbortSignal,
) {
  return pomiSdk.app.media.getImageVariant(mediaId, preset, {
    getAccessToken,
    signal,
  })
}

export function uploadMedia(
  target: MediaTarget,
  file: File,
  getAccessToken: Token,
  signal?: AbortSignal,
) {
  const form = new FormData()
  form.append('images[]', file, file.name)
  const context = { getAccessToken, signal }
  if (target.kind === 'userAvatar') {
    return pomiSdk.app.media.putUserAvatar(target.userId, form, context)
  }
  return pomiSdk.app.media.putGroupAvatar(
    target.userId,
    target.groupId,
    form,
    context,
  )
}

export function removeMedia(target: MediaTarget, getAccessToken: Token) {
  const context = { getAccessToken }
  if (target.kind === 'userAvatar') {
    return pomiSdk.app.media.deleteUserAvatar(target.userId, context)
  }
  return pomiSdk.app.media.deleteGroupAvatar(
    target.userId,
    target.groupId,
    context,
  )
}
