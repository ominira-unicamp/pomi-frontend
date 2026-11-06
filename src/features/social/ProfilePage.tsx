import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useBlocker } from '@tanstack/react-router'
import { Eye, EyeOff, Tags, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type {
  PublicProfile,
  PublicProfileUpdate,
} from '@/features/friends/studentSocialApi'
import { invalidateIdentityImages } from '@/features/media/invalidateMedia'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  LoadingState,
  PageContainer,
} from '@/components/PageLayout'
import { AutocompleteSelect } from '@/components/AutocompleteSelect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  deleteStudentTagInterest,
  listStudentTagInterests,
  putStudentTagInterest,
} from '@/features/student-interests/data/studentTagInterestApi'
import { listTags } from '@/features/tag-taxonomy/data/tagTaxonomyApi'
import {
  getPublicProfile,
  updatePublicProfile,
} from '@/features/friends/studentSocialApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { MediaEditor } from '@/features/media/MediaEditor'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

type IdentityDraft = { scope: string; displayName: string; bio: string | null }

const courseVisibilityHelp = {
  PRIVATE:
    'Somente você pode ver suas disciplinas, turmas, horários e salas de aula.',
  FRIENDS:
    'Seus amigos podem ver suas disciplinas, turmas, horários e salas de aula.',
  PUBLIC:
    'Estudantes autenticados podem ver suas disciplinas, turmas, horários e salas de aula.',
}

export function ProfilePage() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const queryClient = useQueryClient()
  const { studentId, studentQuery } = useStudentProfile()
  const scope = `${sessionSubject}:${studentId}`
  const [draft, setDraft] = useState<IdentityDraft>()
  const [photoPending, setPhotoPending] = useState(false)
  const [newInterestId, setNewInterestId] = useState('')
  const [interestFeedback, setInterestFeedback] = useState('')
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false)
  const profileKey = privateQueryKeys.studentSocialProfile(
    sessionSubject,
    studentId,
  )
  const profileQuery = useQuery({
    queryKey: profileKey,
    queryFn: () => getPublicProfile(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const interestsKey = privateQueryKeys.studentTagInterests(
    sessionSubject,
    studentId,
  )
  const interestsQuery = useQuery({
    queryKey: interestsKey,
    queryFn: () => listStudentTagInterests(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    staleTime: 60 * 1000,
  })
  const tagsQuery = useQuery({
    queryKey: ['public', 'tag-taxonomy', 'tags'],
    queryFn: listTags,
    staleTime: 5 * 60 * 1000,
  })
  const profile = profileQuery.data
  const activeDraft = draft?.scope === scope ? draft : undefined
  const displayName = activeDraft?.displayName ?? profile?.displayName ?? ''
  const bio = activeDraft ? activeDraft.bio : (profile?.bio ?? null)
  const changed = Boolean(
    profile && (displayName !== profile.displayName || bio !== profile.bio),
  )
  const valid =
    displayName.trim().length > 0 &&
    displayName.trim().length <= 80 &&
    (bio?.length ?? 0) <= 280
  useBlocker({
    disabled: !changed && !photoPending,
    enableBeforeUnload: changed || photoPending,
    shouldBlockFn: () =>
      !window.confirm(
        'Descartar alterações não salvas do perfil ou a seleção de foto?',
      ),
  })
  const refreshProfile = (value: PublicProfile) => {
    queryClient.setQueryData(profileKey, value)
    void invalidateIdentityImages(queryClient)
  }
  const save = useMutation({
    mutationFn: (body: Pick<PublicProfileUpdate, 'displayName' | 'bio'>) =>
      updatePublicProfile(studentId!, body, auth.getAccessToken),
    onMutate: () => queryClient.cancelQueries({ queryKey: profileKey }),
    onSuccess: (value) => {
      setDraft(undefined)
      refreshProfile(value)
    },
  })
  const privacy = useMutation({
    mutationFn: (
      body: Pick<PublicProfileUpdate, 'enabled' | 'currentCoursesVisibility'>,
    ) => updatePublicProfile(studentId!, body, auth.getAccessToken),
    onMutate: () => queryClient.cancelQueries({ queryKey: profileKey }),
    onSuccess: (value) => {
      refreshProfile(value)
      setVisibilityDialogOpen(false)
    },
  })
  const refreshInterests = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: interestsKey }),
      queryClient.invalidateQueries({
        queryKey: privateQueryKeys.studentSocial(sessionSubject, studentId),
      }),
    ])
  }
  const removeInterest = useMutation({
    mutationFn: (tagId: number) =>
      deleteStudentTagInterest(studentId!, tagId, auth.getAccessToken),
    onSuccess: async () => {
      setInterestFeedback('Interesse removido.')
      await refreshInterests()
    },
  })
  const addInterest = useMutation({
    mutationFn: (tagId: number) =>
      putStudentTagInterest(studentId!, tagId, auth.getAccessToken),
    onSuccess: async () => {
      setNewInterestId('')
      setInterestFeedback('Interesse adicionado.')
      await refreshInterests()
    },
  })
  if (studentQuery.isLoading || (studentId && profileQuery.isPending))
    return (
      <PageContainer>
        <LoadingState label="Carregando seu perfil" />
      </PageContainer>
    )
  if (!studentId)
    return (
      <PageContainer>
        <EmptyState
          title="Perfil acadêmico necessário"
          description="Conclua seu cadastro de estudante antes de configurar seu perfil público."
        />
      </PageContainer>
    )
  if (!profile)
    return (
      <EmptyState
        title="Não foi possível carregar seu perfil"
        description="Tente carregar suas informações novamente."
        action={{
          label: 'Tentar novamente',
          onClick: () => void profileQuery.refetch(),
        }}
      />
    )
  const saving = save.isPending || privacy.isPending
  const editingInterests = addInterest.isPending || removeInterest.isPending
  const selectedInterestIds = new Set(
    interestsQuery.data?.map((interest) => interest.id),
  )
  const availableTags = (tagsQuery.data ?? [])
    .filter((tag) => !selectedInterestIds.has(tag.id))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  const courseVisibility =
    privacy.isPending && privacy.variables.currentCoursesVisibility
      ? privacy.variables.currentCoursesVisibility
      : profile.currentCoursesVisibility
  const chooseInterest = (value: string) => {
    setNewInterestId(value)
    if (
      !value ||
      editingInterests ||
      !availableTags.some((tag) => tag.id === Number(value))
    )
      return
    setInterestFeedback('')
    removeInterest.reset()
    addInterest.mutate(Number(value))
  }
  return (
    <div className="space-y-6">
      {profileQuery.isError && (
        <p role="alert" className="text-sm text-destructive">
          Não foi possível atualizar os dados do perfil. Seu rascunho foi
          mantido.{' '}
          <button
            type="button"
            className="pomi-focus rounded-sm underline"
            onClick={() => void profileQuery.refetch()}
          >
            Tentar novamente
          </button>
        </p>
      )}
      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Card
          variant="flat"
          className="min-w-0 border border-border/35 bg-card/60"
        >
          <CardHeader className="p-5 pb-4">
            <CardTitle>Identidade pública</CardTitle>
            <p className="text-sm text-muted-foreground">
              Como você se apresenta à comunidade.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 px-5 pb-5 pt-0">
            <MediaEditor
              label="Foto do perfil"
              variant="profile"
              target={{ kind: 'studentAvatar', studentId }}
              mediaId={profile.avatarMediaId}
              preset="avatarLarge"
              access="private"
              onPendingChange={setPhotoPending}
              onChanged={() =>
                void queryClient.invalidateQueries({ queryKey: profileKey })
              }
            />
            <form
              className="space-y-4 border-t border-border/25 pt-4"
              onSubmit={(event) => {
                event.preventDefault()
                if (changed && valid && !saving)
                  save.mutate({
                    displayName: displayName.trim(),
                    bio: bio?.trim() || null,
                  })
              }}
            >
              <fieldset disabled={saving} className="min-w-0 space-y-4">
                <label className="grid gap-1.5 text-sm font-bold">
                  Nome público
                  <Input
                    required
                    maxLength={80}
                    autoComplete="nickname"
                    value={displayName}
                    onChange={(event) => {
                      save.reset()
                      setDraft({ scope, displayName: event.target.value, bio })
                    }}
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-bold">
                  Bio
                  <textarea
                    rows={3}
                    className="pomi-focus min-h-20 w-full resize-y rounded-md border-2 border-input bg-background p-3 font-medium"
                    maxLength={280}
                    value={bio ?? ''}
                    onChange={(event) => {
                      save.reset()
                      setDraft({
                        scope,
                        displayName,
                        bio: event.target.value || null,
                      })
                    }}
                  />
                  <span className="text-xs font-normal text-muted-foreground">
                    {bio?.length ?? 0}/280 caracteres
                  </span>
                </label>
              </fieldset>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p role="status" className="text-xs text-muted-foreground">
                  {save.isPending
                    ? 'Salvando nome e bio...'
                    : changed
                      ? 'Nome e bio têm alterações não salvas.'
                      : save.isSuccess
                        ? 'Nome e bio salvos.'
                        : 'Salvar alterações atualiza somente nome e bio.'}
                </p>
                <Button type="submit" disabled={saving || !changed || !valid}>
                  {save.isPending ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
              {changed && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={saving}
                  onClick={() => {
                    setDraft(undefined)
                    save.reset()
                  }}
                >
                  Descartar alterações
                </Button>
              )}
              {save.isError && (
                <p role="alert" className="text-sm text-destructive">
                  Não foi possível salvar nome e bio. Suas alterações foram
                  mantidas; tente novamente.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
        <Card
          variant="flat"
          className="min-w-0 border border-border/35 bg-card/60"
        >
          <CardHeader className="p-5 pb-4">
            <CardTitle>Privacidade</CardTitle>
            <p className="text-sm text-muted-foreground">
              As mudanças são salvas separadamente de nome e bio.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 px-5 pb-5 pt-0">
            <div>
              <p className="flex items-center gap-2 font-bold">
                {profile.enabled ? (
                  <Eye aria-hidden="true" className="size-4" />
                ) : (
                  <EyeOff aria-hidden="true" className="size-4" />
                )}
                {profile.enabled ? 'Perfil público' : 'Perfil não público'}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {profile.enabled
                  ? 'Estudantes autenticados podem encontrar seu perfil e ver sua foto, nome, bio e vínculo acadêmico.'
                  : 'Seu perfil não aparece na lista de pessoas e não pode ser aberto por outros estudantes. Você continua com acesso às suas informações.'}
              </p>
              <Button
                className="mt-3 max-w-full whitespace-normal"
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={() => {
                  privacy.reset()
                  setVisibilityDialogOpen(true)
                }}
              >
                {profile.enabled
                  ? 'Desativar perfil público'
                  : 'Tornar perfil público'}
              </Button>
            </div>
            <div className="space-y-2 border-t border-border/25 pt-4">
              <label className="grid gap-1.5 text-sm font-bold">
                Compartilhar disciplinas cursando
                <select
                  aria-describedby="course-visibility-help"
                  className="pomi-focus h-10 min-w-0 w-full rounded-md border-2 border-input bg-background px-3 font-medium"
                  value={courseVisibility}
                  disabled={saving}
                  onChange={(event) =>
                    privacy.mutate({
                      currentCoursesVisibility: event.target
                        .value as PublicProfile['currentCoursesVisibility'],
                    })
                  }
                >
                  <option value="PRIVATE">Privado</option>
                  <option value="FRIENDS">Amigos</option>
                  <option value="PUBLIC">Público</option>
                </select>
              </label>
              <p
                id="course-visibility-help"
                className="text-xs leading-relaxed text-muted-foreground"
              >
                {courseVisibilityHelp[courseVisibility]}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Curso, modalidade e ano de ingresso seguem a visibilidade do
                perfil e não são alterados por este controle.
              </p>
              {!profile.enabled && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  A preferência é mantida para quando o perfil voltar a ser
                  público. Com o perfil desativado, ela não libera seus horários
                  para outras pessoas.
                </p>
              )}
            </div>
            <p role="status" className="text-xs text-muted-foreground">
              {privacy.isPending
                ? 'Salvando privacidade...'
                : privacy.isSuccess
                  ? 'Privacidade atualizada.'
                  : 'O público das disciplinas é salvo ao selecionar. A visibilidade do perfil pede confirmação.'}
            </p>
            {privacy.isError && !visibilityDialogOpen && (
              <p role="alert" className="text-sm text-destructive">
                Não foi possível atualizar a privacidade. A configuração
                anterior foi mantida.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <Card
        variant="flat"
        className="min-w-0 border border-border/35 bg-card/60"
      >
        <CardHeader className="p-5 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <Tags aria-hidden="true" className="size-5" /> Interesses
            </CardTitle>
            <Link
              to="/taxonomia"
              className="pomi-focus rounded-sm text-sm font-bold text-primary hover:underline"
            >
              Explorar assuntos
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Adições e remoções são salvas imediatamente.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5 pt-0">
          {interestsQuery.isPending ? (
            <p role="status" className="text-sm text-muted-foreground">
              Carregando interesses...
            </p>
          ) : interestsQuery.isError ? (
            <div>
              <p role="alert" className="text-sm text-destructive">
                Não foi possível carregar seus interesses.
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void interestsQuery.refetch()}
              >
                Tentar novamente
              </Button>
            </div>
          ) : interestsQuery.data.length ? (
            <ul className="flex flex-wrap gap-2">
              {interestsQuery.data.map((interest) => (
                <li
                  key={interest.id}
                  className="flex max-w-full items-center gap-1 rounded-full bg-muted py-1 pl-3 pr-1 text-sm font-semibold"
                >
                  <span className="min-w-0 break-words">{interest.name}</span>
                  <button
                    type="button"
                    className="pomi-focus grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-destructive"
                    aria-label={`Remover interesse em ${interest.name}`}
                    disabled={editingInterests}
                    onClick={() => {
                      setInterestFeedback('')
                      addInterest.reset()
                      removeInterest.mutate(interest.id)
                    }}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Você ainda não adicionou nenhum interesse.
            </p>
          )}
          <div className="max-w-lg space-y-2">
            <p className="text-sm font-bold">Adicionar interesse</p>
            <AutocompleteSelect
              ariaLabel="Novo interesse"
              fitContainer
              value={newInterestId}
              options={availableTags.map((tag) => ({
                value: String(tag.id),
                label: tag.name,
              }))}
              onValueChange={chooseInterest}
              disabled={
                interestsQuery.isPending ||
                interestsQuery.isError ||
                tagsQuery.isPending ||
                tagsQuery.isError ||
                !availableTags.length ||
                editingInterests
              }
              placeholder="Digite para buscar um assunto"
            />
            <p className="text-xs text-muted-foreground">
              Selecione um resultado para adicioná-lo ao perfil.
            </p>
            {tagsQuery.isPending && (
              <p role="status" className="text-sm text-muted-foreground">
                Carregando assuntos...
              </p>
            )}
            {tagsQuery.isError && (
              <p role="alert" className="text-sm text-destructive">
                Não foi possível carregar os assuntos disponíveis.{' '}
                <button
                  type="button"
                  className="pomi-focus rounded-sm underline"
                  onClick={() => void tagsQuery.refetch()}
                >
                  Tentar novamente
                </button>
              </p>
            )}
            {!tagsQuery.isPending &&
              !tagsQuery.isError &&
              !interestsQuery.isPending &&
              !interestsQuery.isError &&
              !availableTags.length && (
                <p className="text-sm text-muted-foreground">
                  {tagsQuery.data.length
                    ? 'Todos os assuntos disponíveis já foram adicionados.'
                    : 'Nenhum assunto disponível no momento.'}
                </p>
              )}
          </div>
          <p role="status" className="text-sm text-muted-foreground">
            {editingInterests ? 'Atualizando interesses...' : interestFeedback}
          </p>
          {addInterest.isError && (
            <div role="alert" className="space-y-2 text-sm text-destructive">
              <p>Não foi possível adicionar o interesse. Tente novamente.</p>
              <Button
                variant="outline"
                size="sm"
                disabled={!newInterestId || editingInterests}
                onClick={() => chooseInterest(newInterestId)}
              >
                Tentar adicionar novamente
              </Button>
            </div>
          )}
          {removeInterest.isError && (
            <p role="alert" className="text-sm text-destructive">
              Não foi possível remover o interesse. Ele foi mantido no perfil.
            </p>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={visibilityDialogOpen}
        onOpenChange={(open) => {
          if (!privacy.isPending) setVisibilityDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {profile.enabled
                ? 'Desativar seu perfil público?'
                : 'Tornar seu perfil público?'}
            </DialogTitle>
            <DialogDescription>
              {profile.enabled
                ? 'Seu perfil deixará de aparecer na lista de pessoas. Outras pessoas deixarão de acessar seus dados públicos e horários. Suas preferências serão preservadas.'
                : 'Estudantes autenticados poderão encontrar seu nome, foto, curso, modalidade, ano de ingresso e bio. As disciplinas seguirão o público configurado nesta página.'}
            </DialogDescription>
          </DialogHeader>
          {privacy.isError && (
            <p role="alert" className="text-sm text-destructive">
              Não foi possível alterar a visibilidade. Nenhuma mudança foi
              salva; tente novamente.
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              disabled={privacy.isPending}
              onClick={() => setVisibilityDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant={profile.enabled ? 'destructive' : 'default'}
              disabled={saving}
              onClick={() => privacy.mutate({ enabled: !profile.enabled })}
            >
              {privacy.isPending
                ? 'Salvando...'
                : profile.enabled
                  ? 'Desativar perfil'
                  : 'Tornar público'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
