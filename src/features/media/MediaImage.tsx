import { useEffect, useState } from 'react'

import { mediaUrl, readPrivateMedia } from './mediaApi'
import type { MediaPreset } from './mediaApi'
import type { ReactNode } from 'react'
import { useOptionalAuth } from '@/auth/AuthProvider'

export function MediaImage({
  mediaId,
  preset,
  access = 'public',
  alt,
  className,
  fallback,
}: {
  mediaId: string | null | undefined
  preset: MediaPreset
  access?: 'public' | 'private'
  alt: string
  className?: string
  fallback: ReactNode
}) {
  const auth = useOptionalAuth()
  const requestKey = `${auth.sessionSubject ?? ''}:${mediaId ?? ''}:${preset}:${access}`
  const [privateUrl, setPrivateUrl] = useState<{ key: string; url: string }>()
  const [failedKey, setFailedKey] = useState<string>()
  const [failedImage, setFailedImage] = useState<{ key: string; src: string }>()

  useEffect(() => {
    setFailedKey(undefined)
    setFailedImage(undefined)
  }, [requestKey])

  useEffect(() => {
    if (!mediaId || access !== 'private' || !auth.sessionSubject) return
    const controller = new AbortController()
    let objectUrl: string | undefined
    void readPrivateMedia(
      mediaId,
      preset,
      auth.getAccessToken,
      controller.signal,
    )
      .then((blob) => {
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        setFailedKey(undefined)
        setPrivateUrl({ key: requestKey, url: objectUrl })
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailedKey(requestKey)
      })
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [
    access,
    auth.getAccessToken,
    auth.sessionSubject,
    mediaId,
    preset,
    requestKey,
  ])

  const src =
    access === 'public'
      ? mediaId
        ? mediaUrl(mediaId, preset)
        : undefined
      : privateUrl?.key === requestKey
        ? privateUrl.url
        : undefined
  if (
    !src ||
    failedKey === requestKey ||
    (failedImage?.key === requestKey && failedImage.src === src)
  )
    return <>{fallback}</>
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedImage({ key: requestKey, src })}
    />
  )
}
