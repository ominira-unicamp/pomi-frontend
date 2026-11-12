import { Check, LoaderCircle, Plus, Star } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser } from '@/features/identity/identityApi'
import { useOptionalAuth } from '@/auth/AuthProvider'

import {
  deleteUserInterest,
  listUserInterests,
  putUserInterest,
} from '@/features/student-interests/data/studentTagInterestApi'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import { Button } from '@/components/ui/button'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { ErrorState } from '@/components/PageLayout'

export function useTaxonomyInterests() {
  const auth = useOptionalAuth()
  const client = useQueryClient()
  const session = auth.sessionSubject ?? 'unknown-session'
  const student = useQuery({
    queryKey: privateQueryKeys.currentUser(session),
    queryFn: () => getCurrentUser(auth.getAccessToken),
    enabled:
      auth.initialized && auth.isAuthenticated && Boolean(auth.sessionSubject),
    retry: false,
    staleTime: 300_000,
  })
  const userId = student.data?.userId
  const interests = useQuery({
    queryKey: privateQueryKeys.userInterests(session, userId),
    queryFn: () => listUserInterests(userId!, auth.getAccessToken),
    enabled: auth.initialized && auth.isAuthenticated && Boolean(userId),
    retry: false,
    staleTime: 60_000,
  })
  const mutation = useMutation({
    mutationFn: async (input: { tagId: number; interested: boolean }) => {
      if (!userId || !interests.isSuccess || !auth.isAuthenticated)
        throw new Error('Interesses indisponíveis.')
      if (input.interested)
        await putUserInterest(userId, input.tagId, auth.getAccessToken)
      else await deleteUserInterest(userId, input.tagId, auth.getAccessToken)
    },
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({
          queryKey: privateQueryKeys.userInterests(session, userId),
        }),
        client.invalidateQueries({
          queryKey: privateQueryKeys.userSocial(session, userId),
        }),
      ]),
  })
  return { auth, student, userId, interests, mutation }
}

type InterestState = ReturnType<typeof useTaxonomyInterests>

export function InterestFeedback({ state }: { state: InterestState }) {
  if (
    state.auth.isAuthenticated &&
    (state.student.isError || state.interests.isError)
  )
    return (
      <ErrorState
        title="Não foi possível carregar seu interesse"
        description="Suas escolhas não foram alteradas. Tente novamente antes de salvar."
        action={{
          label: 'Tentar novamente',
          onClick: () => {
            void state.student.refetch()
            if (state.userId) void state.interests.refetch()
          },
        }}
      />
    )
  if (state.mutation.isError)
    return (
      <InlineMessage variant="error">
        Não foi possível salvar seu interesse. Tente novamente.
      </InlineMessage>
    )
  if (state.mutation.isSuccess)
    return (
      <InlineMessage variant="success">
        {state.mutation.variables.interested
          ? 'Interesse adicionado.'
          : 'Interesse removido.'}
      </InlineMessage>
    )
  return null
}

export function InterestControl({
  state,
  tagId,
  name,
  compact = false,
  iconOnly = false,
}: {
  state: InterestState
  tagId: number
  name: string
  compact?: boolean
  iconOnly?: boolean
}) {
  const { auth, student, userId, interests, mutation } = state
  if (!auth.initialized)
    return (
      <span role="status" className="text-sm text-muted-foreground">
        Verificando sessão…
      </span>
    )
  if (!auth.isAuthenticated)
    return compact ? null : (
      <Button onClick={() => void auth.login(window.location.href)}>
        Entrar para adicionar interesse
      </Button>
    )
  if (student.isError || interests.isError)
    return compact ? (
      <span className="text-sm text-muted-foreground">
        Interesse indisponível
      </span>
    ) : null
  if (student.isPending || (userId && interests.isPending))
    return (
      <span role="status" className="text-sm text-muted-foreground">
        Carregando interesse…
      </span>
    )
  if (!userId)
    return compact ? null : (
      <p>Não foi possível identificar sua conta para registrar interesses.</p>
    )
  const interested = interests.data?.some((item) => item.id === tagId) ?? false
  return (
    <Button
      size={iconOnly ? 'icon' : compact ? 'sm' : 'default'}
      variant={
        iconOnly
          ? interested
            ? 'default'
            : 'outline'
          : interested
            ? 'outline'
            : 'default'
      }
      className={
        iconOnly ? 'size-10 shrink-0 shadow-none sm:size-8' : undefined
      }
      title={
        iconOnly
          ? `${interested ? 'Remover' : 'Adicionar'} interesse em ${name}`
          : undefined
      }
      aria-pressed={interested}
      aria-label={
        compact || iconOnly
          ? `${interested ? 'Remover' : 'Adicionar'} interesse em ${name}`
          : undefined
      }
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ tagId, interested: !interested })}
    >
      {iconOnly ? (
        mutation.isPending && mutation.variables.tagId === tagId ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Star
            className={interested ? 'size-5 fill-current' : 'size-5'}
            aria-hidden="true"
          />
        )
      ) : (
        <>
          {!compact &&
            (interested ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Plus className="size-4" aria-hidden="true" />
            ))}
          {mutation.isPending && mutation.variables.tagId === tagId
            ? 'Salvando…'
            : interested
              ? 'Remover interesse'
              : 'Adicionar interesse'}
        </>
      )}
    </Button>
  )
}
