import { appApiUrl, pomiSdk } from '@/api/client'

export type MediaTarget =
  | { kind: 'studentAvatar'; studentId: number }
  | { kind: 'groupAvatar' | 'groupBanner'; studentId: number; groupId: number }

export type MediaPreset = 'avatarSmall' | 'avatarLarge' | 'banner'
type Token = () => Promise<string>

export function mediaUrl(mediaId: string, preset: MediaPreset) {
  return new URL(
    `/media/${encodeURIComponent(mediaId)}/${preset}`,
    appApiUrl,
  ).href
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
  if (target.kind === 'studentAvatar') {
    return pomiSdk.app.media.putStudentAvatar(target.studentId, form, context)
  }
  if (target.kind === 'groupAvatar') {
    return pomiSdk.app.media.putGroupAvatar(
      target.studentId,
      target.groupId,
      form,
      context,
    )
  }
  return pomiSdk.app.media.putGroupBanner(
    target.studentId,
    target.groupId,
    form,
    context,
  )
}

export function removeMedia(target: MediaTarget, getAccessToken: Token) {
  const context = { getAccessToken }
  if (target.kind === 'studentAvatar') {
    return pomiSdk.app.media.deleteStudentAvatar(target.studentId, context)
  }
  if (target.kind === 'groupAvatar') {
    return pomiSdk.app.media.deleteGroupAvatar(
      target.studentId,
      target.groupId,
      context,
    )
  }
  return pomiSdk.app.media.deleteGroupBanner(
    target.studentId,
    target.groupId,
    context,
  )
}
