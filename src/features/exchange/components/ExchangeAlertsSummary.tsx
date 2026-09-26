import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, BellOff, CheckCircle2, LogIn } from 'lucide-react'

import { useOptionalAuth } from '@/auth/AuthProvider'
import { ErrorState, LoadingState } from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getExchangeNoticeSubscription } from '@/features/exchange/data/exchangeApi'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import { useStudentProfile } from '@/features/student/hooks/useStudentProfile'

export function ExchangeAlertsSummary() {
  const auth = useOptionalAuth()
  const sessionSubject = auth.sessionSubject ?? 'unknown-session'
  const { studentId, studentQuery } = useStudentProfile()
  const subscriptionQuery = useQuery({
    queryKey: privateQueryKeys.exchangeSubscription(sessionSubject, studentId),
    queryFn: () =>
      getExchangeNoticeSubscription(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })

  if (!auth.initialized || (auth.isAuthenticated && studentQuery.isLoading)) {
    return <LoadingState label="Carregando seus alertas" />
  }
  if (!auth.isAuthenticated) {
    return (
      <Card className="mb-10 flex flex-col gap-5 border-primary/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-black tracking-[0.18em] text-primary uppercase">
            Alertas de intercâmbio
          </p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            Receba novos editais por e-mail
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre no POMI e escolha os locais que você quer acompanhar.
          </p>
        </div>
        <Button
          className="shrink-0"
          onClick={() => void auth.login('/editais-de-intercambio')}
        >
          <LogIn /> Configurar alertas
        </Button>
      </Card>
    )
  }
  if (studentQuery.isError) {
    return (
      <div className="mb-10">
        <ErrorState
          title="Não foi possível identificar seu estudante"
          description="O catálogo continua disponível enquanto tentamos carregar seus alertas."
          action={{
            label: 'Tentar novamente',
            onClick: () => void studentQuery.refetch(),
          }}
        />
      </div>
    )
  }
  if (!studentId) {
    return (
      <Card className="mb-10 p-6">
        <h1 className="text-2xl font-black">Complete seu perfil acadêmico</h1>
        <p className="mt-2 text-muted-foreground">
          Sua conta ainda não possui um estudante associado. Complete o perfil
          para configurar alertas de editais.
        </p>
      </Card>
    )
  }
  if (subscriptionQuery.isLoading) {
    return <LoadingState label="Carregando seus alertas" />
  }
  if (subscriptionQuery.isError || !subscriptionQuery.data) {
    return (
      <div className="mb-10">
        <ErrorState
          title="Não foi possível carregar seus alertas"
          description="A lista de editais continua disponível abaixo."
          action={{
            label: 'Tentar novamente',
            onClick: () => void subscriptionQuery.refetch(),
          }}
        />
      </div>
    )
  }

  const { enabled, placeIds } = subscriptionQuery.data
  return (
    <Card className="mb-10 flex flex-col gap-5 border-primary/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="flex min-w-0 gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {enabled ? <CheckCircle2 /> : <BellOff />}
        </div>
        <div>
          <p className="text-xs font-black tracking-[0.18em] text-primary uppercase">
            {enabled ? 'Alertas ativos' : 'Alertas pausados'}
          </p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">
            {enabled ? 'Alertas configurados' : 'Alertas de intercâmbio'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {enabled
              ? placeIds.length > 0
                ? `Você acompanha ${placeIds.length} ${placeIds.length === 1 ? 'local' : 'locais'} e receberá novos editais por e-mail.`
                : 'Você receberá por e-mail novos editais de todos os locais.'
              : 'Seus locais continuam salvos. Reative o envio quando quiser voltar a receber e-mails.'}
          </p>
        </div>
      </div>
      <Link
        to="/editais-de-intercambio/configuracoes"
        className={`${buttonVariants()} shrink-0`}
      >
        {enabled ? 'Editar alertas' : 'Reativar alertas'} <ArrowRight />
      </Link>
    </Card>
  )
}
