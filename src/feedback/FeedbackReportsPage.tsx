import { useQuery } from '@tanstack/react-query'
import { MessageSquareText } from 'lucide-react'

import type {
  FeedbackReport,
  FeedbackReportStatus,
} from '@/feedback/feedbackReportApi'
import { listStudentFeedbackReports } from '@/feedback/feedbackReportApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'
import { useStudentProfile } from '@/student/hooks/useStudentProfile'

const statusLabels: Record<FeedbackReportStatus, string> = {
  OPEN: 'Aberta',
  IN_PROGRESS: 'Em análise',
  CLOSED: 'Encerrada',
}

const kindLabels = {
  BUG: 'Bug',
  SUGGESTION: 'Sugestão',
  DATA_ISSUE: 'Problema de dados',
} as const

function targetLabel(report: FeedbackReport) {
  if (report.target.type === 'GENERAL') return 'Geral'
  if (report.target.type === 'FEATURE') return report.target.featureKey
  return `${report.target.academicResourceType} #${report.target.academicResourceId}`
}

function statusClass(status: FeedbackReportStatus) {
  if (status === 'CLOSED') return 'bg-muted text-muted-foreground'
  if (status === 'IN_PROGRESS') return 'bg-secondary text-secondary-foreground'
  return 'bg-primary text-primary-foreground'
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function FeedbackReportCard({ report }: { report: FeedbackReport }) {
  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black tracking-[0.18em] text-primary uppercase">
            {kindLabels[report.kind]} · {targetLabel(report)}
          </p>
          <CardTitle className="mt-2 break-words">{report.title}</CardTitle>
        </div>
        <span
          className={`w-fit shrink-0 rounded-md px-3 py-1 text-xs font-black ${statusClass(report.status)}`}
        >
          {statusLabels[report.status]}
        </span>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {report.description}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Enviada em {formatDate(report.createdAt)}
          {report.updatedAt !== report.createdAt &&
            ` · Atualizada em ${formatDate(report.updatedAt)}`}
        </p>
        {report.adminMessage && (
          <div className="mt-5 border-l-4 border-primary bg-muted/50 px-4 py-3">
            <p className="text-xs font-black tracking-[0.12em] text-primary uppercase">
              Mensagem da equipe
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
              {report.adminMessage}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function FeedbackReportsPage() {
  const auth = useOptionalAuth()
  const { studentId, studentQuery } = useStudentProfile()
  const reportsQuery = useQuery({
    queryKey: privateQueryKeys.feedbackReports(
      auth.sessionSubject ?? 'unknown-session',
      studentId,
    ),
    queryFn: () => listStudentFeedbackReports(studentId!, auth.getAccessToken),
    enabled: Boolean(studentId),
    retry: false,
  })

  if (!auth.initialized || studentQuery.isLoading || (studentId && reportsQuery.isLoading)) {
    return <LoadingState label="Carregando suas solicitações" />
  }
  if (!auth.isAuthenticated) {
    return (
      <PageContainer>
        <ErrorState
          title="Entre para visualizar suas solicitações"
          description="Os feedbacks enviados com a sua conta ficam disponíveis nesta página."
          action={{ label: 'Entrar', onClick: () => void auth.login() }}
        />
      </PageContainer>
    )
  }
  if (studentQuery.isError || reportsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível carregar suas solicitações"
          description="Tente novamente em instantes."
          action={{ label: 'Tentar novamente', onClick: () => void reportsQuery.refetch() }}
        />
      </PageContainer>
    )
  }
  if (!studentId) {
    return (
      <PageContainer>
        <ErrorState
          title="Conta de estudante não encontrada"
          description="Conclua o cadastro do seu estudante para consultar suas solicitações."
        />
      </PageContainer>
    )
  }
  const reports = reportsQuery.data ?? []
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Conta"
        title="Minhas solicitações"
        description="Acompanhe os feedbacks que você enviou para a equipe do POMI."
      />
      {reports.length === 0 ? (
        <EmptyState
          title="Nenhuma solicitação ainda"
          description="Quando você enviar um feedback identificado, ele aparecerá aqui."
          action={{ label: 'Voltar ao início', onClick: () => window.history.back() }}
        />
      ) : (
        <div className="grid gap-5">
          {reports.map((report) => (
            <FeedbackReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <MessageSquareText className="size-4" />
        <span>Solicitações encerradas continuam disponíveis para consulta.</span>
      </div>
    </PageContainer>
  )
}
