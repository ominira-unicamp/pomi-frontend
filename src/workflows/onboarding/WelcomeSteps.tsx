import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { PublicProfile } from '@/social-profile/data/userSocialApi'
import { useCurrentUser } from '@/features/identity/index'
import { isApiError } from '@/api/errors'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { createCurriculumCatalogDataSource } from '@/catalog/data/curriculumCatalogApi'
import { CourseProfilePanel } from '@/features/student/components/CourseProfilePanel'
import { createStudentProfile, getStudentAcademicProfile, patchStudentProfile } from '@/academic-record/data/studentApi'
import { getPublicProfile, updatePublicProfile } from '@/social-profile/data/userSocialApi'
import { MediaEditor } from '@/media/MediaEditor'
import { invalidateIdentityImages } from '@/integrations/tanstack-query/invalidateIdentityImages'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { LoadingState } from '@/components/PageLayout'
import { Section } from '@/components/patterns/Section'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/patterns/Field'

export type StepProps = {
  userId: number
  onContinue: () => void
  onDirtyChange: (dirty: boolean) => void
  onSavingChange: (saving: boolean) => void
}
const catalogSource = createCurriculumCatalogDataSource()

export function AcademicWelcomeStep({
  userId,
  onContinue,
  onDirtyChange,
  onSavingChange,
}: StepProps) {
  const auth = useOptionalAuth()
  const current = useCurrentUser()
  const client = useQueryClient()
  const studentId = current.data?.studentId
  const admin = current.data?.roles.includes('ADMIN')
  const dacRa = /^([a-z])(\d{6})@dac\.unicamp\.br$/i.exec(
    String(auth.profile?.email ?? ''),
  )?.[2]
  const eligible = admin || (current.data?.roles.includes('STUDENT') && !!dacRa)
  const [ra, setRa] = useState(dacRa ?? '')
  const [name, setName] = useState('')
  const [identityDirty, setIdentityDirty] = useState(false)
  const [courseDirty, setCourseDirty] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const profileKey = privateQueryKeys.studentAcademicProfile(
    auth.sessionSubject ?? 'unknown-session',
    userId,
  )
  const profile = useQuery({
    queryKey: [...profileKey, studentId ?? 'none'],
    queryFn: () => getStudentAcademicProfile(userId, auth.getAccessToken),
    enabled: typeof studentId === 'number',
  })
  const catalog = useQuery({
    queryKey: ['public', 'welcome-catalog'],
    queryFn: async () => {
      const result = await catalogSource.load()
      if (!result.ok) throw new Error('Catálogo indisponível.')
      return result.value
    },
    enabled: !!eligible || typeof studentId === 'number',
    staleTime: Infinity,
  })
  useEffect(() => {
    onDirtyChange(identityDirty || courseDirty)
  }, [identityDirty, courseDirty, onDirtyChange])
  useEffect(() => {
    onSavingChange(saving)
  }, [saving, onSavingChange])
  if (!studentId && !eligible)
    return (
      <p>
        O vínculo acadêmico exige uma conta de estudante com e-mail DAC
        correspondente ao RA. Você pode continuar e importar seu histórico sem
        esse vínculo.
      </p>
    )
  if (catalog.isError || profile.isError)
    return (
      <div role="alert">
        <p>Não foi possível carregar os dados acadêmicos.</p>
        <Button
          onClick={() => {
            void catalog.refetch()
            if (studentId) void profile.refetch()
          }}
        >
          Tentar novamente
        </Button>
      </div>
    )
  if (catalog.isPending || (studentId && profile.isPending))
    return <LoadingState label="Carregando dados acadêmicos" />
  return (
    <div className="space-y-4">
      <p>
        Informe seu curso e ingresso para preencher novos planejamentos. Seu
        histórico é configurado separadamente.
      </p>
      {!studentId && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="welcome-ra">RA</FieldLabel>
            <Input
              id="welcome-ra"
              disabled={saving}
              inputMode="numeric"
              maxLength={6}
              value={ra}
              readOnly={!admin}
              onChange={(e) => {
                setRa(e.target.value)
                setIdentityDirty(true)
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="welcome-academic-name">
              Nome acadêmico
            </FieldLabel>
            <Input
              id="welcome-academic-name"
              disabled={saving}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setIdentityDirty(true)
              }}
            />
          </Field>
        </div>
      )}
      {error && <InlineMessage variant="error">{error}</InlineMessage>}
      <CourseProfilePanel
        key={studentId ?? 'new'}
        profile={profile.data}
        catalogPrograms={catalog.data.catalogPrograms}
        allowUnchanged
        saveLabel="Salvar e continuar"
        onDirtyChange={setCourseDirty}
        onSavingChange={setSaving}
        onSave={async (values) => {
          setError('')
          try {
            if (studentId)
              await patchStudentProfile(userId, values, auth.getAccessToken)
            else {
              if (!/^\d{6}$/.test(ra) || !name.trim())
                throw new Error(
                  'Informe um RA de seis dígitos e seu nome acadêmico.',
                )
              await createStudentProfile(
                userId,
                { ...values, ra, name: name.trim() },
                auth.getAccessToken,
              )
            }
          } catch (cause) {
            const message =
              isApiError(cause) && cause.status === 403
                ? 'Esta conta não tem autorização para criar o vínculo com esse RA.'
                : isApiError(cause) && cause.status === 409
                  ? 'Este RA já está vinculado ou a conta já possui um vínculo. Confira os dados e tente novamente.'
                  : cause instanceof Error
                    ? cause.message
                    : 'Não foi possível salvar o vínculo. Verifique o RA, a disponibilidade do vínculo e a autorização da conta.'
            setError(message)
            throw cause
          }
          setIdentityDirty(false)
          setCourseDirty(false)
          onDirtyChange(false)
          onContinue()
          void client.invalidateQueries({ queryKey: profileKey })
          void client.invalidateQueries({
            queryKey: privateQueryKeys.currentUser(
              auth.sessionSubject ?? 'unknown-session',
            ),
          })
        }}
      />
    </div>
  )
}

export function useWelcomeProfile(userId: number) {
  const auth = useOptionalAuth()
  return useQuery({
    queryKey: privateQueryKeys.userSocialProfile(
      auth.sessionSubject ?? 'unknown-session',
      userId,
    ),
    queryFn: () => getPublicProfile(userId, auth.getAccessToken),
  })
}

export function PublicWelcomeStep({
  userId,
  onContinue,
  onDirtyChange,
  onSavingChange,
}: StepProps) {
  const auth = useOptionalAuth()
  const client = useQueryClient()
  const profile = useWelcomeProfile(userId)
  const [draft, setDraft] = useState<{ displayName: string; bio: string }>()
  const [photoPending, setPhotoPending] = useState(false)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const value = draft ?? {
    displayName: profile.data?.displayName ?? '',
    bio: profile.data?.bio ?? '',
  }
  const dirty =
    !!draft &&
    (value.displayName !== profile.data?.displayName ||
      value.bio !== (profile.data.bio ?? ''))
  useEffect(() => {
    onDirtyChange(dirty || photoPending)
  }, [dirty, photoPending, onDirtyChange])
  useEffect(() => {
    onSavingChange(saving || photoBusy)
  }, [saving, photoBusy, onSavingChange])
  if (!profile.data)
    return (
      <ProfileLoading
        error={profile.isError}
        retry={() => void profile.refetch()}
      />
    )
  const valid =
    !!value.displayName.trim() &&
    value.displayName.trim().length <= 80 &&
    value.bio.length <= 280
  return (
    <div className="space-y-5">
      <p>
        Escolha como se apresentar à comunidade. Preencher o perfil não o torna
        público.
      </p>
      <MediaEditor
        label="Foto do perfil"
        variant="profile"
        target={{ kind: 'userAvatar', userId }}
        mediaId={profile.data.avatarMediaId}
        preset="avatarLarge"
        access="private"
        onPendingChange={setPhotoPending}
        onBusyChange={setPhotoBusy}
        onChanged={() => void profile.refetch()}
      />
      <p className="text-sm text-muted-foreground">
        A foto é salva separadamente pelos controles acima.
      </p>
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()
          if (!valid || saving || photoPending) return
          setSaving(true)
          setError('')
          try {
            const updated = dirty
              ? await updatePublicProfile(
                  userId,
                  {
                    displayName: value.displayName.trim(),
                    bio: value.bio.trim() || null,
                  },
                  auth.getAccessToken,
                )
              : profile.data
            client.setQueryData(
              privateQueryKeys.userSocialProfile(
                auth.sessionSubject ?? 'unknown-session',
                userId,
              ),
              updated,
            )
            void invalidateIdentityImages(client)
            setDraft(undefined)
            onDirtyChange(false)
            onContinue()
          } catch {
            setError(
              'Não foi possível salvar o perfil. Suas alterações foram mantidas.',
            )
          } finally {
            setSaving(false)
          }
        }}
      >
        <Field>
          <FieldLabel htmlFor="welcome-display-name">
            Nome de exibição
          </FieldLabel>
          <Input
            id="welcome-display-name"
            disabled={saving}
            maxLength={80}
            value={value.displayName}
            onChange={(e) =>
              setDraft({ ...value, displayName: e.target.value })
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="welcome-bio">Bio (opcional)</FieldLabel>
          <Textarea
            id="welcome-bio"
            disabled={saving}
            maxLength={280}
            value={value.bio}
            onChange={(e) => setDraft({ ...value, bio: e.target.value })}
          />
        </Field>
        <Section variant="subtle" aria-label="Prévia do perfil">
          <p className="font-bold">{value.displayName || 'Seu nome'}</p>
          <p className="whitespace-pre-wrap break-words">
            {value.bio || 'Sua apresentação aparecerá aqui.'}
          </p>
        </Section>
        {error && <InlineMessage variant="error">{error}</InlineMessage>}
        <Button type="submit" disabled={!valid || saving || photoPending}>
          {saving ? 'Salvando…' : 'Salvar e continuar'}
        </Button>
      </form>
    </div>
  )
}

export function PrivacyWelcomeStep({
  userId,
  onContinue,
  onDirtyChange,
  onSavingChange,
}: StepProps) {
  const auth = useOptionalAuth()
  const client = useQueryClient()
  const profile = useWelcomeProfile(userId)
  const [draft, setDraft] =
    useState<Pick<PublicProfile, 'enabled' | 'currentCoursesVisibility'>>()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const value = draft ?? profile.data
  const dirty =
    !!draft &&
    (draft.enabled !== profile.data?.enabled ||
      draft.currentCoursesVisibility !== profile.data.currentCoursesVisibility)
  useEffect(() => {
    onDirtyChange(dirty)
  }, [dirty, onDirtyChange])
  useEffect(() => {
    onSavingChange(saving)
  }, [saving, onSavingChange])
  if (!value)
    return (
      <ProfileLoading
        error={profile.isError}
        retry={() => void profile.refetch()}
      />
    )
  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault()
        if (saving) return
        setSaving(true)
        setError('')
        try {
          if (dirty) {
            const updated = await updatePublicProfile(
              userId,
              {
                enabled: value.enabled,
                currentCoursesVisibility: value.currentCoursesVisibility,
              },
              auth.getAccessToken,
            )
            client.setQueryData(
              privateQueryKeys.userSocialProfile(
                auth.sessionSubject ?? 'unknown-session',
                userId,
              ),
              updated,
            )
          }
          setDraft(undefined)
          onDirtyChange(false)
          onContinue()
        } catch {
          setError('Não foi possível salvar sua privacidade. Tente novamente.')
        } finally {
          setSaving(false)
        }
      }}
    >
      <label className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-3">
        <Checkbox
          className="mt-0.5"
          disabled={saving}
          checked={value.enabled}
          onCheckedChange={(checked) =>
            setDraft({ ...value, enabled: checked === true })
          }
        />
        <span>
          Ativar meu perfil público
          <span className="block text-sm text-muted-foreground">
            Usuários autenticados poderão encontrar e consultar seu perfil.
            Desativado, seu perfil fica oculto.
          </span>
        </span>
      </label>
      <fieldset className="space-y-3">
        <legend className="mb-3 font-semibold">
          Quem pode ver suas disciplinas, turmas, horários e salas?
        </legend>
        {(
          [
            ['PRIVATE', 'Somente eu'],
            ['FRIENDS', 'Meus amigos'],
            ['PUBLIC', 'Usuários autenticados'],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="grid min-h-6 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-3"
          >
            <input
              type="radio"
              disabled={saving}
              className="pomi-focus m-0 size-4 justify-self-center accent-primary"
              name="welcome-courses-visibility"
              value={key}
              checked={value.currentCoursesVisibility === key}
              onChange={() =>
                setDraft({ ...value, currentCoursesVisibility: key })
              }
            />
            {label}
          </label>
        ))}
      </fieldset>
      <p className="text-sm text-muted-foreground">
        Curso, modalidade e ingresso acompanham a visibilidade do perfil.
      </p>
      {error && <InlineMessage variant="error">{error}</InlineMessage>}
      <Button type="submit" disabled={saving}>
        {saving ? 'Salvando…' : 'Salvar e continuar'}
      </Button>
    </form>
  )
}

function ProfileLoading({
  error,
  retry,
}: {
  error: boolean
  retry: () => void
}) {
  return error ? (
    <div role="alert">
      <p>Não foi possível carregar seu perfil.</p>
      <Button onClick={retry}>Tentar novamente</Button>
    </div>
  ) : (
    <LoadingState label="Carregando seu perfil" />
  )
}
