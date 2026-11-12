import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@ominira/pomi-sdk'
import {
  listAdminFeedbackReports,
  updateAdminFeedbackReport,
} from './feedbackReportApi'
import type {
  FeedbackReport,
  FeedbackReportPatch,
  FeedbackReportStatus,
} from './feedbackReportApi'
import { useAdminAccess } from '@/features/administration'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { ResponsiveDialog } from '@/components/patterns/ResponsiveDialog'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { Field, FieldLabel } from '@/components/patterns/Field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { privateQueryKeys } from '@/integrations/tanstack-query/queryKeys'

const statuses = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em análise',
  CLOSED: 'Encerrado',
}
const kinds = {
  BUG: 'Bug',
  SUGGESTION: 'Sugestão',
  DATA_ISSUE: 'Problema de dados',
}
const features: Record<string, string> = {
  home: 'Início',
  'curriculum-planner': 'Planejamento de currículo',
  'semester-planner': 'Planejamento de semestre',
  'course-situation': 'Situação do curso',
  agenda: 'Agenda',
  social: 'Amigos',
  'academic-data': 'Dados acadêmicos',
}
const statusOptions = {
  PENDING: 'Pendentes',
  OPEN: 'Abertos',
  IN_PROGRESS: 'Em análise',
  CLOSED: 'Encerrados',
  ALL: 'Todos',
}
type StatusFilter = keyof typeof statusOptions

function targetLabel(report: FeedbackReport) {
  if (report.target.type === 'GENERAL') return 'Geral'
  if (report.target.type === 'FEATURE')
    return features[report.target.feature.key] ?? report.target.feature.key
  return `${report.target.academicResource.type} #${report.target.academicResource.id}`
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function accessError(error: unknown) {
  return error instanceof ApiError &&
    (error.status === 401 || error.status === 403)
    ? error.status
    : undefined
}

export function AdminFeedbackReportsPage() {
  const { auth, isAdmin } = useAdminAccess()
  return <AdminFeedbackContent key={auth.sessionSubject} isAdmin={isAdmin} />
}

function AdminFeedbackContent({ isAdmin }: { isAdmin: boolean }) {
  const { auth, identity } = useAdminAccess()
  const queryClient = useQueryClient()
  const session = auth.sessionSubject ?? 'unknown-session'
  const queryKey = privateQueryKeys.adminFeedbackReports(session)
  const [denied, setDenied] = useState<number>()
  const [status, setStatus] = useState<StatusFilter>('PENDING')
  const [kind, setKind] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<FeedbackReport>()
  const [notice, setNotice] = useState('')
  const reports = useQuery({
    queryKey,
    queryFn: () => listAdminFeedbackReports(auth.getAccessToken),
    enabled: isAdmin && !denied,
    retry: false,
    staleTime: 0,
  })
  const queryDenied = accessError(reports.error)
  const blocked = denied ?? queryDenied
  useEffect(() => {
    if (!blocked) return
    setDenied(blocked)
    setSelected(undefined)
    void queryClient
      .cancelQueries({
        queryKey: privateQueryKeys.adminFeedbackReports(session),
      })
      .then(() =>
        queryClient.removeQueries({
          queryKey: privateQueryKeys.adminFeedbackReports(session),
        }),
      )
    void queryClient.invalidateQueries({
      queryKey: privateQueryKeys.currentUser(session),
    })
  }, [blocked, queryClient, session])

  function matches(report: FeedbackReport) {
    return (
      (status === 'ALL' ||
        (status === 'PENDING'
          ? report.status !== 'CLOSED'
          : report.status === status)) &&
      (kind === 'ALL' || report.kind === kind) &&
      normalize(`${report.id} ${report.title} ${report.description}`).includes(
        normalize(search),
      )
    )
  }
  const visible = (reports.data ?? [])
    .filter(matches)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id - b.id)

  if (!isAdmin) return null
  if (blocked)
    return (
      <PageContainer>
        <ErrorState
          title={
            blocked === 401
              ? 'Sessão expirada'
              : 'Acesso restrito a administradores'
          }
          description={
            blocked === 401
              ? 'Entre novamente para continuar.'
              : 'Sua conta não possui mais acesso aos feedbacks.'
          }
          action={
            blocked === 401
              ? {
                  label: 'Entrar novamente',
                  onClick: () => void auth.login(window.location.href),
                }
              : undefined
          }
        />
      </PageContainer>
    )

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Administração"
        title="Feedbacks"
        description="Leia as solicitações e acompanhe as respostas da equipe."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="feedback-status">Status</FieldLabel>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as StatusFilter)}
          >
            <SelectTrigger id="feedback-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusOptions).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="feedback-kind">Tipo</FieldLabel>
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger id="feedback-kind" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os tipos</SelectItem>
              {Object.entries(kinds).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="feedback-search">Buscar feedbacks</FieldLabel>
          <Input
            id="feedback-search"
            placeholder="ID, título ou descrição"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Field>
      </div>
      {notice && (
        <div className="mb-4" role="status">
          <InlineMessage>{notice}</InlineMessage>
        </div>
      )}
      {reports.isPending ? (
        <LoadingState label="Carregando feedbacks" />
      ) : reports.isError ? (
        <ErrorState
          title="Não foi possível carregar os feedbacks"
          description="Tente novamente em instantes."
          action={{
            label: 'Tentar novamente',
            onClick: () => void reports.refetch(),
          }}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title={
            reports.data.length
              ? 'Nenhum feedback corresponde aos filtros'
              : 'Nenhum feedback recebido'
          }
          description="Novas solicitações aparecerão nesta lista."
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? 'feedback' : 'feedbacks'}
          </p>
          {visible.map((report) => (
            <button
              key={report.id}
              type="button"
              className="pomi-focus flex w-full min-w-0 flex-col gap-2 rounded-lg border-2 border-border bg-card p-4 text-left hover:bg-accent sm:flex-row sm:items-start sm:justify-between"
              onClick={() => {
                setSelected(report)
                setNotice('')
              }}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-muted-foreground">
                  #{report.id} · {kinds[report.kind]} · {targetLabel(report)}
                </span>
                <span className="mt-1 block font-bold wrap-anywhere">
                  {report.title}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {formatDate(report.createdAt)}
                </span>
              </span>
              <span className="shrink-0 text-sm font-bold text-primary">
                {statuses[report.status]}
              </span>
            </button>
          ))}
        </div>
      )}
      {selected && (
        <FeedbackEditor
          key={selected.id}
          report={selected}
          onClose={() => setSelected(undefined)}
          onDenied={setDenied}
          onMissing={() => {
            setSelected(undefined)
            setNotice('Este feedback não está mais disponível.')
            void reports.refetch()
          }}
          onSaved={(updated) => {
            queryClient.setQueryData<Array<FeedbackReport>>(
              queryKey,
              (current) =>
                current?.map((report) =>
                  report.id === updated.id ? updated : report,
                ),
            )
            void queryClient.invalidateQueries({ queryKey })
            void queryClient.invalidateQueries({
              queryKey: privateQueryKeys.feedbackReports(
                session,
                identity.data?.userId,
              ),
            })
            setSelected(matches(updated) ? updated : undefined)
            setNotice('Feedback atualizado.')
          }}
        />
      )}
    </PageContainer>
  )
}

function FeedbackEditor({
  report,
  onClose,
  onSaved,
  onDenied,
  onMissing,
}: {
  report: FeedbackReport
  onClose: () => void
  onSaved: (report: FeedbackReport) => void
  onDenied: (status: number) => void
  onMissing: () => void
}) {
  const { auth } = useAdminAccess()
  const [message, setMessage] = useState(report.adminMessage ?? '')
  const [confirming, setConfirming] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const inFlight = useRef(false)
  const changedMessage = message.trim() !== (report.adminMessage ?? '')

  async function save(status?: FeedbackReportStatus) {
    if (inFlight.current) return
    inFlight.current = true
    setSaving(true)
    setError('')
    const body: FeedbackReportPatch = {
      ...(status && status !== report.status ? { status } : {}),
      ...(changedMessage ? { adminMessage: message.trim() || null } : {}),
    }
    try {
      const updated = await updateAdminFeedbackReport(
        report.id,
        body,
        auth.getAccessToken,
      )
      setConfirming(false)
      setMessage(updated.adminMessage ?? '')
      onSaved(updated)
    } catch (failure) {
      const denied = accessError(failure)
      if (denied) onDenied(denied)
      else if (failure instanceof ApiError && failure.status === 404)
        onMissing()
      else setError('Não foi possível atualizar o feedback. Tente novamente.')
    } finally {
      inFlight.current = false
      setSaving(false)
    }
  }

  return (
    <ResponsiveDialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) onClose()
      }}
      title={`#${report.id} — ${report.title}`}
      description={`${kinds[report.kind]} · ${statuses[report.status]}`}
      dialogContentClassName="max-w-2xl wrap-anywhere"
      sheetContentClassName="wrap-anywhere"
      bodyClassName="space-y-5 wrap-anywhere"
    >
      <p className="whitespace-pre-wrap text-sm">{report.description}</p>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-bold">Destino</dt>
          <dd>{targetLabel(report)}</dd>
        </div>
        <div>
          <dt className="font-bold">Autor</dt>
          <dd>
            {report.reporterUserId === null
              ? 'Anônimo'
              : `Usuário #${report.reporterUserId}`}
          </dd>
        </div>
        <div>
          <dt className="font-bold">Origem</dt>
          <dd>{report.sourcePath ?? 'Não informada'}</dd>
        </div>
        <div>
          <dt className="font-bold">Enviado em</dt>
          <dd>{formatDate(report.createdAt)}</dd>
        </div>
        <div>
          <dt className="font-bold">Atualizado em</dt>
          <dd>{formatDate(report.updatedAt)}</dd>
        </div>
      </dl>
      <Field>
        <FieldLabel htmlFor="admin-message">
          Mensagem da equipe (opcional)
        </FieldLabel>
        <Textarea
          id="admin-message"
          maxLength={5000}
          rows={5}
          value={message}
          disabled={saving}
          onChange={(event) => setMessage(event.target.value)}
          aria-describedby="admin-message-help"
        />
        <p id="admin-message-help" className="text-xs text-muted-foreground">
          Visível ao autor identificado em “Meus feedbacks”. {message.length}
          /5000 caracteres.
        </p>
      </Field>
      {error && <InlineMessage variant="error">{error}</InlineMessage>}
      {confirming ? (
        <div className="space-y-3 rounded-md border-2 border-border p-4">
          <p className="font-bold">Encerrar este feedback?</p>
          <p className="text-sm text-muted-foreground">
            A mensagem da equipe é opcional. Você poderá reabrir depois.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button disabled={saving} onClick={() => void save('CLOSED')}>
              {saving ? 'Salvando…' : 'Confirmar encerramento'}
            </Button>
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => setConfirming(false)}
            >
              Cancelar encerramento
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={saving || !changedMessage}
            onClick={() => void save()}
          >
            Salvar mensagem
          </Button>
          {report.status === 'OPEN' && (
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => void save('IN_PROGRESS')}
            >
              Marcar em análise
            </Button>
          )}
          {report.status === 'CLOSED' ? (
            <Button disabled={saving} onClick={() => void save('OPEN')}>
              Reabrir
            </Button>
          ) : (
            <Button disabled={saving} onClick={() => setConfirming(true)}>
              Encerrar
            </Button>
          )}
        </div>
      )}
    </ResponsiveDialog>
  )
}
