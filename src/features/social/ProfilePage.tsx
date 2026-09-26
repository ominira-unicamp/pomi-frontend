import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Copy, Eye, EyeOff, Tags, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { PublicProfile } from '@/features/friends/studentSocialApi'
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
  hasPublicProfileChanges,
  publicProfileUpdateInput,
  updatePublicProfile,
} from '@/features/friends/studentSocialApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function ProfilePage() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const queryClient = useQueryClient()
  const { studentId, studentQuery } = useStudentProfile()
  const [form, setForm] = useState<PublicProfile>()
  const [newInterestId, setNewInterestId] = useState('')
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false)
  const [visibilityTarget, setVisibilityTarget] = useState(false)
  const profileQuery = useQuery({
    queryKey: privateQueryKeys.studentSocialProfile(sessionSubject, studentId),
    queryFn: () => getPublicProfile(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
  })
  const interestsQuery = useQuery({
    queryKey: privateQueryKeys.studentTagInterests(sessionSubject, studentId),
    queryFn: () => listStudentTagInterests(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    staleTime: 60 * 1000,
  })
  const tagsQuery = useQuery({
    queryKey: ['public', 'tag-taxonomy', 'tags'],
    queryFn: listTags,
    staleTime: 5 * 60 * 1000,
  })
  useEffect(() => {
    if (profileQuery.data) setForm(profileQuery.data)
  }, [profileQuery.data])
  const save = useMutation({
    mutationFn: () =>
      updatePublicProfile(
        studentId!,
        publicProfileUpdateInput(form!),
        auth.getAccessToken,
      ),
    onSuccess: (value) => {
      setForm(value)
      queryClient.setQueryData(
        privateQueryKeys.studentSocialProfile(sessionSubject, studentId),
        value,
      )
      void queryClient.invalidateQueries({
        queryKey: privateQueryKeys.studentSocial(sessionSubject, studentId),
      })
    },
  })
  const changeVisibility = useMutation({
    mutationFn: (enabled: boolean) =>
      updatePublicProfile(
        studentId!,
        { ...publicProfileUpdateInput(form!), enabled },
        auth.getAccessToken,
      ),
    onSuccess: (value) => {
      setForm(value)
      setVisibilityDialogOpen(false)
      queryClient.setQueryData(
        privateQueryKeys.studentSocialProfile(sessionSubject, studentId),
        value,
      )
      void queryClient.invalidateQueries({
        queryKey: privateQueryKeys.studentSocial(sessionSubject, studentId),
      })
    },
  })
  const removeInterest = useMutation({
    mutationFn: (tagId: number) =>
      deleteStudentTagInterest(studentId!, tagId, auth.getAccessToken),
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: privateQueryKeys.studentTagInterests(
          sessionSubject,
          studentId,
        ),
      }),
  })
  const addInterest = useMutation({
    mutationFn: (tagId: number) =>
      putStudentTagInterest(studentId!, tagId, auth.getAccessToken),
    onSuccess: () => {
      setNewInterestId('')
      void queryClient.invalidateQueries({
        queryKey: privateQueryKeys.studentTagInterests(
          sessionSubject,
          studentId,
        ),
      })
    },
  })
  if (studentQuery.isLoading || (studentId && profileQuery.isLoading))
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
  const changed = hasPublicProfileChanges(form, profileQuery.data)
  const selectedInterestIds = new Set(
    interestsQuery.data?.map((interest) => interest.id),
  )
  const availableTags = (tagsQuery.data ?? [])
    .filter((tag) => !selectedInterestIds.has(tag.id))
    .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'))
  return form ? (
    <div className="grid gap-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <Card variant="flat" className="border-2 border-border bg-card/80">
          <CardHeader>
            <CardTitle>Dados públicos</CardTitle>
            <p className="text-sm text-muted-foreground">
              As informações que outros estudantes verão.
            </p>
          </CardHeader>
          <CardContent className="grid gap-5">
            <label className="grid gap-1.5 text-sm font-bold">
              Nome público
              <Input
                value={form.displayName}
                onChange={(event) =>
                  setForm({ ...form, displayName: event.target.value })
                }
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold">
              Bio
              <textarea
                className="pomi-focus min-h-28 rounded-md border-2 border-input bg-background p-3 font-medium"
                maxLength={280}
                value={form.bio ?? ''}
                onChange={(event) =>
                  setForm({ ...form, bio: event.target.value || null })
                }
              />
              <span className="text-xs font-normal text-muted-foreground">
                {form.bio?.length ?? 0}/280 caracteres
              </span>
            </label>
          </CardContent>
        </Card>
        <Card variant="flat" className="border-2 border-border bg-card/80">
          <CardHeader>
            <CardTitle>Visibilidade</CardTitle>
            <p className="text-sm text-muted-foreground">
              Controle quem pode encontrar você e ver suas disciplinas.
            </p>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="rounded-md bg-muted/60 p-4">
              <div className="flex items-start gap-3">
                {form.enabled ? (
                  <Eye className="mt-0.5 size-5 text-primary" />
                ) : (
                  <EyeOff className="mt-0.5 size-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-extrabold">
                    {form.enabled ? 'Perfil público' : 'Perfil privado'}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {form.enabled
                      ? 'Outros estudantes podem encontrar seu perfil.'
                      : 'Seu perfil não aparece na lista de pessoas.'}
                  </p>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                variant={form.enabled ? 'outline' : 'default'}
                disabled={changeVisibility.isPending}
                onClick={() => {
                  setVisibilityTarget(!form.enabled)
                  setVisibilityDialogOpen(true)
                }}
              >
                {form.enabled
                  ? 'Desativar perfil público'
                  : 'Tornar perfil público'}
              </Button>
            </div>
            <label className="grid gap-1.5 text-sm font-bold">
              Compartilhar disciplinas cursando
              <select
                className="pomi-focus h-10 rounded-md border-2 border-input bg-background px-3 font-medium"
                value={form.currentCoursesVisibility}
                onChange={(event) =>
                  setForm({
                    ...form,
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
            <p className="text-xs leading-relaxed text-muted-foreground">
              Curso, modalidade e ano de ingresso aparecem automaticamente em
              perfis públicos.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={save.isPending || !changed}
          onClick={() => save.mutate()}
        >
          Salvar alterações
        </Button>
        <Button
          variant="outline"
          onClick={() => void navigator.clipboard.writeText(form.publicId)}
        >
          <Copy /> Copiar código público
        </Button>
      </div>
      <Card variant="flat" className="border-2 border-border bg-card/80">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <Tags className="size-5" /> Interesses
            </span>
            <Link
              to="/taxonomia"
              className="pomi-focus text-sm font-bold text-primary hover:underline"
            >
              Gerenciar na taxonomia
            </Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Assuntos que ajudam a personalizar sua experiência no POMI.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="grid min-w-0 flex-1 gap-1 text-sm font-bold">
              Adicionar interesse
              <AutocompleteSelect
                ariaLabel="Novo interesse"
                value={newInterestId}
                options={availableTags.map((tag) => ({
                  value: String(tag.id),
                  label: tag.name,
                }))}
                onValueChange={setNewInterestId}
                disabled={
                  interestsQuery.isLoading ||
                  tagsQuery.isLoading ||
                  availableTags.length === 0
                }
                placeholder="Digite para buscar um assunto"
              />
            </label>
            <Button
              disabled={!newInterestId || addInterest.isPending}
              onClick={() => addInterest.mutate(Number(newInterestId))}
            >
              Adicionar interesse
            </Button>
          </div>
          {tagsQuery.isError && (
            <p className="mb-4 text-sm text-destructive">
              Não foi possível carregar os assuntos disponíveis.
            </p>
          )}
          {!tagsQuery.isLoading &&
            !tagsQuery.isError &&
            availableTags.length === 0 && (
              <p className="mb-4 text-sm text-muted-foreground">
                Todos os assuntos disponíveis já foram adicionados.
              </p>
            )}
          {interestsQuery.isLoading ? (
            <LoadingState label="Carregando interesses" />
          ) : interestsQuery.data?.length ? (
            <ul className="flex flex-wrap gap-2">
              {interestsQuery.data.map((interest) => (
                <li
                  key={interest.id}
                  className="flex items-center gap-1 rounded-md border-2 border-border bg-muted px-3 py-2 text-sm font-bold"
                >
                  <span>{interest.name}</span>
                  <button
                    type="button"
                    className="pomi-focus ml-1 rounded-sm p-1 text-muted-foreground hover:bg-background hover:text-destructive"
                    aria-label={`Remover interesse em ${interest.name}`}
                    disabled={removeInterest.isPending}
                    onClick={() => removeInterest.mutate(interest.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Você ainda não adicionou nenhum interesse.
            </p>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={visibilityDialogOpen}
        onOpenChange={setVisibilityDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {visibilityTarget
                ? 'Tornar seu perfil público?'
                : 'Desativar seu perfil público?'}
            </DialogTitle>
            <DialogDescription>
              {visibilityTarget
                ? 'Seu nome, curso, modalidade, ano de ingresso e bio poderão ser encontrados por outros estudantes.'
                : 'Seu perfil deixará de aparecer na lista de pessoas. Você poderá ativá-lo novamente quando quiser.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVisibilityDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant={visibilityTarget ? 'default' : 'destructive'}
              disabled={changeVisibility.isPending}
              onClick={() => changeVisibility.mutate(visibilityTarget)}
            >
              {visibilityTarget ? 'Tornar público' : 'Desativar perfil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ) : null
}
