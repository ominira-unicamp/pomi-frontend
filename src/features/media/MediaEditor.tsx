import { useMutation } from '@tanstack/react-query'
import { useEffect, useId, useRef, useState } from 'react'

import { MediaImage } from './MediaImage'
import { removeMedia, uploadMedia } from './mediaApi'
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
}: {
  label: string
  target: MediaTarget
  mediaId: string | null | undefined
  preset: MediaPreset
  access?: 'public' | 'private'
  onChanged: () => void
}) {
  const auth = useOptionalAuth()
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadController = useRef<AbortController | null>(null)
  const [file, setFile] = useState<File>()
  const [preview, setPreview] = useState<string>()
  const [error, setError] = useState<string>()

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
      onChanged()
    },
    onSettled: () => {
      uploadController.current = null
    },
  })
  const remove = useMutation({
    mutationFn: () => removeMedia(target, auth.getAccessToken),
    onSuccess: onChanged,
  })
  const busy = upload.isPending || remove.isPending
  const imageSize = preset === 'banner' ? 'h-20 w-40' : 'size-20'
  const fallback = (
    <span
      className={`grid ${imageSize} place-items-center rounded-md border-2 border-dashed border-border bg-muted text-xs font-bold text-muted-foreground`}
    >
      Sem imagem
    </span>
  )

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-extrabold">{label}</h3>
      <div className="flex flex-wrap items-center gap-4">
        {preview ? (
          <img
            src={preview}
            alt={`Prévia de ${label.toLowerCase()}`}
            className={`${imageSize} rounded-md object-cover`}
          />
        ) : (
          <MediaImage
            mediaId={mediaId}
            preset={preset}
            access={access}
            alt={label}
            className={`${imageSize} rounded-md object-cover`}
            fallback={fallback}
          />
        )}
        <div className="min-w-0 space-y-2">
          <label htmlFor={inputId} className="block text-sm font-bold">
            Escolher imagem
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            className="block w-full max-w-72 text-sm"
            onChange={(event) => {
              const selected = event.target.files?.[0]
              setError(undefined)
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
            <Button
              size="sm"
              disabled={!file || busy}
              onClick={() => file && upload.mutate(file)}
            >
              Enviar imagem
            </Button>
            {file && (
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => setFile(undefined)}
              >
                Cancelar
              </Button>
            )}
            {mediaId && (
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => remove.mutate()}
              >
                Remover imagem
              </Button>
            )}
          </div>
        </div>
      </div>
      {(error || upload.isError || remove.isError) && (
        <p role="alert" className="text-sm text-destructive">
          {error ?? mediaErrorMessage(upload.error ?? remove.error)}
        </p>
      )}
    </div>
  )
}
