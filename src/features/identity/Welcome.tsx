import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useBlocker, useRouterState } from '@tanstack/react-router'
import { welcomeReturnTo } from './welcomeNavigation'
import {
  AcademicWelcomeStep,
  PrivacyWelcomeStep,
  PublicWelcomeStep,
  useWelcomeProfile,
} from './WelcomeSteps'
import { useCurrentUser } from './index'
import type { StudentHistoryImportSummary } from '@/features/student/data/studentApi'
import { HistoryImportPanel } from '@/features/course-situation/components/HistoryImportPanel'
import { pomiSdk } from '@/api/client'
import { useOptionalAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Brand } from '@/components/Brand'
import { ActionBar } from '@/components/patterns/ActionBar'
import { Section, SectionTitle } from '@/components/patterns/Section'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { ThemeMenu } from '@/components/ThemeMenu'
import {
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

export function WelcomeGate() {
  const auth = useOptionalAuth()
  const current = useCurrentUser()
  const location = useRouterState({
    select: (state) => ({
      href: state.location.href,
      pathname: state.location.pathname,
    }),
  })
  useEffect(() => {
    if (
      auth.isAuthenticated &&
      current.data?.welcomePending &&
      location.pathname.replace(/\/$/, '') !== '/boas-vindas'
    ) {
      window.location.replace(
        '/boas-vindas?returnTo=' + encodeURIComponent(location.href),
      )
    }
  }, [
    auth.isAuthenticated,
    current.data?.welcomePending,
    location.href,
    location.pathname,
  ])
  return null
}

const steps = [
  'Vida acadêmica',
  'Histórico',
  'Perfil público',
  'Privacidade',
  'Conclusão',
]

export function WelcomePage() {
  const auth = useOptionalAuth()
  const current = useCurrentUser()
  if (!auth.initialized || (auth.isAuthenticated && current.isPending))
    return (
      <PageContainer>
        <LoadingState label="Carregando sua conta" />
      </PageContainer>
    )
  if (!auth.isAuthenticated)
    return (
      <PageContainer>
        <PageHeader title="Boas-vindas ao POMI" />
        <Button onClick={() => void auth.login(window.location.href)}>
          Entrar
        </Button>
      </PageContainer>
    )
  if (current.isError)
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível carregar sua conta"
          description="Tente novamente para continuar."
        />
        <Button onClick={() => void current.refetch()}>Tentar novamente</Button>
      </PageContainer>
    )
  if (!current.data?.welcomePending)
    return (
      <PageContainer>
        <PageHeader title="Minha conta" />
        <Button onClick={() => window.location.assign('/perfil')}>
          Acessar minha conta
        </Button>
      </PageContainer>
    )
  if (typeof current.data.userId !== 'number')
    return (
      <PageContainer>
        <ErrorState
          title="Conta de usuário necessária"
          description="Entre com uma conta pessoal para configurar seu perfil."
        />
      </PageContainer>
    )
  return (
    <WelcomeFlow
      key={`${auth.sessionSubject}:${current.data.userId}`}
      userId={current.data.userId}
    />
  )
}

function WelcomeFlow({ userId }: { userId: number }) {
  const auth = useOptionalAuth()
  const client = useQueryClient()
  const [step, setStep] = useState(0)
  const [visited, setVisited] = useState([0])
  const [dirty, setDirty] = useState<Record<number, boolean>>({})
  const [busy, setBusy] = useState<Record<number, boolean>>({})
  const [importSummary, setImportSummary] =
    useState<StudentHistoryImportSummary>()
  const [skipped, setSkipped] = useState<Array<number>>([])
  const leaving = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const anyDirty = Object.values(dirty).some(Boolean)
  const anyBusy = Object.values(busy).some(Boolean)
  const returnTo = welcomeReturnTo(
    new URLSearchParams(window.location.search).get('returnTo'),
    window.location.origin,
  )
  const finish = useMutation({
    mutationFn: async () => {
      await pomiSdk.app.currentUser.completeWelcome(userId, {
        getAccessToken: auth.getAccessToken,
      })
      leaving.current = true
      window.location.assign(returnTo)
      void client.invalidateQueries({
        queryKey: privateQueryKeys.currentUser(
          auth.sessionSubject ?? 'unknown-session',
        ),
      })
    },
  })
  useBlocker({
    disabled: !anyDirty && !anyBusy,
    enableBeforeUnload: () => !leaving.current && (anyDirty || anyBusy),
    shouldBlockFn: () =>
      !leaving.current &&
      (anyBusy ||
        !window.confirm(
          'Sair e descartar alterações não salvas? Os dados já salvos serão mantidos.',
        )),
  })
  useEffect(() => {
    heading.current?.focus()
  }, [step])
  const changeStep = (value: number) => {
    setStep(value)
    setVisited((previous) =>
      previous.includes(value) ? previous : [...previous, value],
    )
  }
  const next = () => changeStep(Math.min(step + 1, 4))
  const updateDirty = useCallback(
    (index: number, value: boolean) =>
      setDirty((previous) =>
        previous[index] === value ? previous : { ...previous, [index]: value },
      ),
    [],
  )
  const updateBusy = useCallback(
    (index: number, value: boolean) =>
      setBusy((previous) =>
        previous[index] === value ? previous : { ...previous, [index]: value },
      ),
    [],
  )
  const dirty0 = useCallback(
    (value: boolean) => updateDirty(0, value),
    [updateDirty],
  )
  const dirty1 = useCallback(
    (value: boolean) => updateDirty(1, value),
    [updateDirty],
  )
  const dirty2 = useCallback(
    (value: boolean) => updateDirty(2, value),
    [updateDirty],
  )
  const dirty3 = useCallback(
    (value: boolean) => updateDirty(3, value),
    [updateDirty],
  )
  const busy0 = useCallback(
    (value: boolean) => updateBusy(0, value),
    [updateBusy],
  )
  const busy1 = useCallback(
    (value: boolean) => updateBusy(1, value),
    [updateBusy],
  )
  const busy2 = useCallback(
    (value: boolean) => updateBusy(2, value),
    [updateBusy],
  )
  const busy3 = useCallback(
    (value: boolean) => updateBusy(3, value),
    [updateBusy],
  )
  const complete = (index: number) => {
    updateDirty(index, false)
    setSkipped((previous) => previous.filter((value) => value !== index))
    next()
  }
  const finishFlow = () => {
    if (
      !anyBusy &&
      (!anyDirty ||
        window.confirm(
          'Descartar alterações não salvas e encerrar a configuração? Os dados já salvos serão mantidos.',
        ))
    )
      finish.mutate()
  }
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <PageContainer className="py-5 sm:py-5">
        <header className="flex items-center justify-between gap-3 border-b border-border pb-5">
          <Brand surface="page" />
          <div className="flex items-center gap-2">
            <ThemeMenu surface="page" />
            <Button
              variant="ghost"
              disabled={anyBusy || finish.isPending}
              onClick={() => {
                if (
                  !anyDirty ||
                  window.confirm('Sair e descartar alterações não salvas?')
                ) {
                  leaving.current = true
                  void auth.logout()
                }
              }}
            >
              Sair da conta
            </Button>
          </div>
        </header>
      </PageContainer>
      <main>
        <PageContainer className="space-y-6 pt-0 sm:pt-0">
          <PageHeader
            title="Boas-vindas ao POMI"
            description="Prepare sua conta no seu ritmo. Todas as etapas são opcionais e podem ser configuradas depois."
          />
          <ol
            aria-label="Etapas da configuração"
            className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5"
          >
            {steps.map((label, index) => (
              <li
                key={label}
                aria-current={index === step ? 'step' : undefined}
                className={
                  index === step
                    ? 'border-b-4 border-primary py-2 font-bold'
                    : 'border-b border-border py-2 text-muted-foreground'
                }
              >
                {index + 1}. {label}
              </li>
            ))}
          </ol>
          <Section
            aria-labelledby="welcome-step-title"
            variant="bordered"
            className="space-y-5 sm:p-6"
          >
            <SectionTitle
              ref={heading}
              tabIndex={-1}
              id="welcome-step-title"
              className="outline-none"
            >
              {steps[step]}
            </SectionTitle>
            <div hidden={step !== 0}>
              <AcademicWelcomeStep
                userId={userId}
                onContinue={() => complete(0)}
                onDirtyChange={dirty0}
                onSavingChange={busy0}
              />
            </div>
            {visited.includes(1) && (
              <div hidden={step !== 1}>
                <HistoryImportPanel
                  userId={userId}
                  onDirtyChange={dirty1}
                  onSavingChange={busy1}
                  onSummary={setImportSummary}
                />
                {importSummary && (
                  <Button className="mt-4" onClick={() => complete(1)}>
                    Continuar
                  </Button>
                )}
              </div>
            )}
            {visited.includes(2) && (
              <div hidden={step !== 2}>
                <PublicWelcomeStep
                  userId={userId}
                  onContinue={() => complete(2)}
                  onDirtyChange={dirty2}
                  onSavingChange={busy2}
                />
              </div>
            )}
            {visited.includes(3) && (
              <div hidden={step !== 3}>
                <PrivacyWelcomeStep
                  userId={userId}
                  onContinue={() => complete(3)}
                  onDirtyChange={dirty3}
                  onSavingChange={busy3}
                />
              </div>
            )}
            {step === 4 && (
              <>
                <WelcomeSummary
                  userId={userId}
                  importSummary={importSummary}
                  skipped={skipped}
                />
                <Button
                  disabled={anyBusy || finish.isPending}
                  onClick={finishFlow}
                >
                  {finish.isPending ? 'Concluindo…' : 'Começar a usar o POMI'}
                </Button>
              </>
            )}
            {finish.isError && (
              <InlineMessage variant="error">
                Não foi possível concluir as boas-vindas. Tente novamente.
              </InlineMessage>
            )}
          </Section>
          <ActionBar align="start">
            <Button
              variant="outline"
              disabled={step === 0 || anyBusy || finish.isPending}
              onClick={() => changeStep(step - 1)}
            >
              Voltar
            </Button>
            {step < 4 && (
              <Button
                variant="outline"
                disabled={anyBusy || finish.isPending}
                onClick={() => {
                  setSkipped((previous) =>
                    previous.includes(step) ? previous : [...previous, step],
                  )
                  next()
                }}
              >
                Pular esta etapa
              </Button>
            )}
            <Button
              variant="ghost"
              disabled={anyBusy || finish.isPending}
              onClick={finishFlow}
            >
              Configurar depois
            </Button>
          </ActionBar>
        </PageContainer>
      </main>
    </div>
  )
}

function WelcomeSummary({
  userId,
  importSummary,
  skipped,
}: {
  userId: number
  importSummary?: StudentHistoryImportSummary
  skipped: Array<number>
}) {
  const current = useCurrentUser()
  const profile = useWelcomeProfile(userId)
  return (
    <div className="space-y-3">
      <p>
        Confira os dados salvos. Você pode voltar para revisar ou ajustar tudo
        depois em Minha conta.
      </p>
      <ul className="space-y-2">
        <li>
          Vínculo acadêmico:{' '}
          {current.data?.studentId ? 'configurado' : 'sem vínculo'}.
        </li>
        <li>
          Histórico nesta sessão:{' '}
          {importSummary
            ? `${importSummary.created} registros criados e ${importSummary.updated} atualizados`
            : 'nenhuma importação realizada'}
          .
        </li>
        <li>
          Nome de exibição:{' '}
          {profile.data?.displayName ?? 'não foi possível consultar'}.
        </li>
        <li>
          Perfil público:{' '}
          {profile.data
            ? profile.data.enabled
              ? 'ativado'
              : 'desativado'
            : 'não foi possível consultar'}
          .
        </li>
        <li>
          Disciplinas:{' '}
          {profile.data
            ? {
                PRIVATE: 'somente você',
                FRIENDS: 'amigos',
                PUBLIC: 'usuários autenticados',
              }[profile.data.currentCoursesVisibility]
            : 'não foi possível consultar'}
          .
        </li>
      </ul>
      {skipped.length > 0 && (
        <p>
          Etapas puladas nesta sessão:{' '}
          {skipped.map((index) => steps[index]).join(', ')}. Dados anteriores
          foram preservados.
        </p>
      )}
    </div>
  )
}
