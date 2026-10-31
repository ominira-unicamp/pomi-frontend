import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useId, useRef, useState } from 'react'

import { MediaImage } from './MediaImage'
import { removeMedia, uploadMedia } from './mediaApi'
import { invalidateIdentityImages } from './invalidateMedia'
import type { MediaPreset, MediaTarget } from './mediaApi'
import { isApiError } from '@/api/errors'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxFileBytes = 5 * 1024 * 1024

function mediaErrorMessage(error: unknown) {
  if (isApiError(error)) {
    if (error.status === 413) return 'A imagem excede o limite de tamanho.'
    if (error.status === 422)
      return 'A imagem não atende aos formatos ou limites permitidos.'
    if (error.status === 429)
      return 'Limite de envios atingido. Aguarde antes de tentar novamente.'
    if (error.status === 409)
      return 'A imagem mudou. Atualize a página e tente novamente.'
    if (error.status === 503)
      return 'O serviço de imagens está indisponível no momento.'
  }
  return 'Não foi possível atualizar a imagem. Tente novamente.'
}

export function MediaEditor({
  label,
  target,
  mediaId,
  preset,
  access = 'public',
  onChanged,
  variant = 'default',
  onPendingChange,
}: {
  label: string
  target: MediaTarget
  mediaId: string | null | undefined
  preset: MediaPreset
  access?: 'public' | 'private'
  onChanged: () => void
  variant?: 'default' | 'profile'
  onPendingChange?: (pending: boolean) => void
}) {
  const profile = variant === 'profile'
  const auth = useOptionalAuth()
  const queryClient = useQueryClient()
  const changed = () => {
    void invalidateIdentityImages(queryClient)
    onChanged()
  }
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadController = useRef<AbortController | null>(null)
  const [file, setFile] = useState<File>()
  const [preview, setPreview] = useState<string>()
  const [error, setError] = useState<string>()
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!file) {
      setPreview(undefined)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    setFile(undefined)
    setError(undefined)
    setFeedback('')
    return () => {
      uploadController.current?.abort()
      uploadController.current = null
    }
  }, [auth.sessionSubject])

  const upload = useMutation({
    mutationFn: (selected: File) => {
      const controller = new AbortController()
      uploadController.current = controller
      return uploadMedia(
        target,
        selected,
        auth.getAccessToken,
        controller.signal,
      )
    },
    onSuccess: () => {
      setFile(undefined)
      setFeedback(profile ? 'Foto atualizada.' : 'Imagem atualizada.')
      changed()
    },
    onSettled: () => {
      uploadController.current = null
    },
  })
  const remove = useMutation({
    mutationFn: () => removeMedia(target, auth.getAccessToken),
    onSuccess: () => {
      setFeedback(profile ? 'Foto removida.' : 'Imagem removida.')
      changed()
    },
  })
  const busy = upload.isPending || remove.isPending
  useEffect(() => {
    onPendingChange?.(Boolean(file) || busy)
  }, [file, busy, onPendingChange])
  const imageSize = 'size-20'
  const shape = profile ? 'rounded-full' : 'rounded-md'
  const fallback = (
    <span
      className={`grid ${imageSize} place-items-center ${shape} border-2 border-dashed border-border bg-muted text-xs font-bold text-muted-foreground`}
    >
      Sem imagem
    </span>
  )

  return (
    <div className="space-y-3">
      {!profile && <h3 className="text-sm font-extrabold">{label}</h3>}
      <div className="flex flex-wrap items-center gap-4">
        {preview ? (
          <img
            src={preview}
            alt={`Prévia de ${label.toLowerCase()}`}
            className={`${imageSize} ${shape} object-cover object-center`}
          />
        ) : (
          <MediaImage
            mediaId={mediaId}
            preset={preset}
            access={access}
            alt={label}
            className={`${imageSize} ${shape} object-cover object-center`}
            fallback={fallback}
          />
        )}
        <div className="min-w-0 space-y-2">
          {profile && <h3 className="text-sm font-extrabold">{label}</h3>}
          <label
            htmlFor={inputId}
            className={profile ? 'sr-only' : 'block text-sm font-bold'}
          >
            Escolher imagem
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            className={profile ? 'sr-only' : 'block w-full max-w-72 text-sm'}
            tabIndex={profile ? -1 : undefined}
            onChange={(event) => {
              const selected = event.target.files?.[0]
              setError(undefined)
              setFeedback('')
              upload.reset()
              remove.reset()
              if (!selected) return
              if (!allowedTypes.has(selected.type)) {
                setFile(undefined)
                setError('Escolha uma imagem JPEG, PNG ou WebP.')
              } else if (selected.size > maxFileBytes) {
                setFile(undefined)
                setError('A imagem deve ter no máximo 5 MiB.')
              } else {
                setFile(selected)
              }
              if (inputRef.current) inputRef.current.value = ''
            }}
          />
          <div className="flex flex-wrap gap-2">
            {profile && (
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
              >
                Alterar foto
              </Button>
            )}
            {(!profile || file) && (
              <Button
                size="sm"
                disabled={!file || busy}
                onClick={() => file && upload.mutate(file)}
              >
                {upload.isPending
                  ? 'Enviando...'
                  : profile
                    ? 'Enviar foto'
                    : 'Enviar imagem'}
              </Button>
            )}
            {file && (
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setFile(undefined)
                  upload.reset()
                  setError(undefined)
                }}
              >
                {profile ? 'Cancelar seleção' : 'Cancelar'}
              </Button>
            )}
            {mediaId && (
              <Button
                size="sm"
                variant={profile ? 'ghost' : 'outline'}
                disabled={busy || Boolean(file)}
                onClick={() => {
                  upload.reset()
                  setFeedback('')
                  remove.mutate()
                }}
              >
                {remove.isPending
                  ? 'Removendo...'
                  : profile
                    ? 'Remover foto'
                    : 'Remover imagem'}
              </Button>
            )}
          </div>
        </div>
      </div>
      {profile && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          JPEG, PNG ou WebP, até 5 MiB. Corte central quadrado. A foto é salva
          ao enviar, separadamente de{' '}
          {target.kind === 'groupAvatar' ? 'nome e descrição' : 'nome e bio'}.
        </p>
      )}
      {profile && (busy || feedback) && (
        <p role="status" className="text-xs text-muted-foreground">
          {busy
            ? upload.isPending
              ? 'Enviando imagem...'
              : 'Removendo imagem...'
            : feedback}
        </p>
      )}
      {(error || upload.isError || remove.isError) && (
        <p role="alert" className="text-sm text-destructive">
          {error ?? mediaErrorMessage(upload.error ?? remove.error)}
        </p>
      )}
    </div>
  )
}
