import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Bell, BellOff } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { ExchangeNoticeSubscription } from '@/features/exchange/data/exchangeApi'
import { ApiError } from '@/api/errors'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { ActionBar } from '@/components/patterns/ActionBar'
import { Field, FieldDescription, FieldLabel } from '@/components/patterns/Field'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { SearchableMultiSelect } from '@/components/patterns/SearchableMultiSelect'
import {
  buildExchangeSubscriptionPatch,
  getExchangeNoticeSubscription,
  listExchangePlaces,
  patchExchangeNoticeSubscription,
} from '@/features/exchange/data/exchangeApi'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'
import {
  privateQueryKeys,
  publicQueryKeys,
} from '@/integrations/tanstack-query/queryKeys'

function subscriptionErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 422) {
    return (
      error.problem?.fields?.find((field) => field.path.includes('placeIds'))
        ?.message ?? 'Um dos locais selecionados não está mais disponível.'
    )
  }
  return 'Não foi possível salvar as preferências.'
}

export function ExchangeNoticeSettingsPage() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const queryClient = useQueryClient()
  const { studentId, studentQuery } = useStudentProfile()
  const placesQuery = useQuery({
    queryKey: publicQueryKeys.exchangePlaces(),
    queryFn: listExchangePlaces,
    staleTime: 5 * 60_000,
    retry: false,
  })
  const subscriptionQuery = useQuery({
    queryKey: privateQueryKeys.exchangeSubscription(sessionSubject, studentId),
    queryFn: () =>
      getExchangeNoticeSubscription(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })
  const [draft, setDraft] = useState<
    Pick<ExchangeNoticeSubscription, 'enabled' | 'placeIds'> | undefined
  >()

  useEffect(() => {
    if (auth.initialized && !auth.isAuthenticated) {
      void auth.login('/editais-de-intercambio/configuracoes')
    }
  }, [auth])

  useEffect(() => {
    if (subscriptionQuery.data) {
      setDraft({
        enabled: subscriptionQuery.data.enabled,
        placeIds: subscriptionQuery.data.placeIds,
      })
    }
  }, [subscriptionQuery.data])

  const patch =
    draft && subscriptionQuery.data
      ? buildExchangeSubscriptionPatch(draft, subscriptionQuery.data)
      : undefined
  const mutation = useMutation({
    mutationFn: () =>
      patchExchangeNoticeSubscription(studentId!, patch!, auth.getAccessToken),
    onSuccess: (subscription) => {
      queryClient.setQueryData(
        privateQueryKeys.exchangeSubscription(sessionSubject, studentId),
        subscription,
      )
      setDraft({
        enabled: subscription.enabled,
        placeIds: subscription.placeIds,
      })
    },
  })

  if (
    !auth.initialized ||
    !auth.isAuthenticated ||
    studentQuery.isLoading ||
    subscriptionQuery.isLoading ||
    placesQuery.isLoading
  ) {
    return <LoadingState label="Carregando configurações de alertas" />
  }

  if (
    studentQuery.isError ||
    subscriptionQuery.isError ||
    placesQuery.isError
  ) {
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível carregar as configurações"
          description="Tente novamente para gerenciar seus alertas."
          action={{
            label: 'Tentar novamente',
            onClick: () => {
              void studentQuery.refetch()
              void subscriptionQuery.refetch()
              void placesQuery.refetch()
            },
          }}
        />
      </PageContainer>
    )
  }

  if (!studentId || !draft) {
    return (
      <PageContainer>
        <ErrorState
          title="Complete seu perfil acadêmico"
          description="Sua conta precisa estar associada a um estudante para configurar alertas."
        />
      </PageContainer>
    )
  }

  const places = placesQuery.data ?? []

  return (
    <PageContainer>
      <Link
        to="/editais-de-intercambio"
        className={`${buttonVariants({ variant: 'ghost' })} mb-4 -ml-3`}
      >
        <ArrowLeft /> Oportunidades
      </Link>
      <PageHeader
        eyebrow="Conta e notificações"
        title="Configurar alertas"
        description="Escolha como deseja receber novos editais de intercâmbio."
      />

      <Card className="mb-5 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              {draft.enabled ? <Bell /> : <BellOff />}
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Envio por e-mail</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pause os alertas sem perder os locais selecionados.
              </p>
            </div>
          </div>
          <FieldLabel className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border-2 border-strong-border px-4 py-2">
            <Checkbox
              checked={draft.enabled}
              onCheckedChange={(checked) =>
                setDraft((current) => ({
                  ...current!,
                  enabled: checked === true,
                }))
              }
            />
            {draft.enabled ? 'Ativo' : 'Pausado'}
          </FieldLabel>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-[0.18em] text-primary uppercase">
              Filtro de origem
            </p>
            <h2 className="mt-1 text-xl font-extrabold">Locais de interesse</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sem seleção, você recebe editais de todos os locais.
            </p>
          </div>
          <strong className="shrink-0 text-sm">
            {draft.placeIds.length}/{places.length}
          </strong>
        </div>
        <Field>
          <FieldLabel>Escolher locais</FieldLabel>
          <SearchableMultiSelect
            label="Escolher locais"
            options={places.map((place) => ({
              value: place.id,
              label: place.name,
            }))}
            selected={draft.placeIds}
            disabled={!draft.enabled}
            onChange={(placeIds) =>
              setDraft((current) => ({ ...current!, placeIds }))
            }
          />
          <FieldDescription>
            Pesquise e selecione quantos locais quiser acompanhar.
          </FieldDescription>
        </Field>
      </Card>

      <ActionBar
        align="between"
        className="mt-6 flex-col border-t-2 border-strong-border pt-5 sm:flex-row"
      >
        <p className="text-sm font-semibold" role="status">
          {mutation.isSuccess && !patch
            ? 'Preferências de editais salvas.'
            : patch
              ? 'Há alterações não salvas.'
              : 'Preferências salvas.'}
        </p>
        <Button
          disabled={!patch || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? 'Salvando…' : 'Salvar alterações'}
        </Button>
      </ActionBar>
      {mutation.isError && (
        <InlineMessage className="mt-3" variant="error">
          {subscriptionErrorMessage(mutation.error)}
        </InlineMessage>
      )}
    </PageContainer>
  )
}
