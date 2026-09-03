import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BellOff,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Filter,
  LogIn,
  MapPin,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import type { ExchangeNotice, ExchangePlace } from '@/exchange/data/exchangeApi'
import type { ExchangeNoticeFilters } from '@/exchange/data/exchangeNotices'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
} from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getExchangeNoticeSubscription,
  listExchangeNotices,
  listExchangePlaces,
} from '@/exchange/data/exchangeApi'
import {
  defaultExchangeNoticeFilters,
  localDateKey,
  processExchangeNotices,
} from '@/exchange/data/exchangeNotices'
import { useStudentProfile } from '@/student/hooks/useStudentProfile'

const pageSize = 20

function formatDate(value: string | null) {
  if (!value) return 'Não informada'
  const [year, month, day] = value.split('-')
  return year && month && day ? `${day}/${month}/${year}` : value
}

export function SelectionGroup<T extends string | number>({
  label,
  options,
  selected,
  onChange,
  disabled = false,
}: {
  label: string
  options: ReadonlyArray<{ value: T; label: string }>
  selected: ReadonlyArray<T>
  onChange: (values: ReadonlyArray<T>) => void
  disabled?: boolean
}) {
  const toggle = (value: T) =>
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )

  return (
    <fieldset className="min-w-0 disabled:opacity-60" disabled={disabled}>
      <legend className="mb-2 text-sm font-extrabold">{label}</legend>
      <div className="max-h-44 space-y-1 overflow-y-auto rounded-md border-2 border-input bg-background p-2">
        {options.length > 0 ? (
          options.map((option) => (
            <label
              key={String(option.value)}
              className="flex min-h-9 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-sm font-medium hover:bg-muted"
            >
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))
        ) : (
          <p className="px-2 py-1 text-sm text-muted-foreground">
            Nenhuma opção disponível.
          </p>
        )}
      </div>
    </fieldset>
  )
}

function ExchangeAlertsSummary() {
  const auth = useOptionalAuth()
  const { studentId, studentQuery } = useStudentProfile()
  const subscriptionQuery = useQuery({
    queryKey: ['exchange', 'subscription', studentId],
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
            onClick: () => {
              void subscriptionQuery.refetch()
            },
          }}
        />
      </div>
    )
  }

  const subscription = subscriptionQuery.data
  const selectedCount = subscription.placeIds.length
  const enabled = subscription.enabled

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
              ? selectedCount > 0
                ? `Você acompanha ${selectedCount} ${selectedCount === 1 ? 'local' : 'locais'} e receberá novos editais por e-mail.`
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

function NoticeCard({ notice }: { notice: ExchangeNotice }) {
  return (
    <details className="group rounded-lg border-2 border-strong-border bg-card shadow-[4px_4px_0_color-mix(in_srgb,var(--primary)_24%,transparent)]">
      <summary className="pomi-focus flex cursor-pointer list-none flex-col gap-4 rounded-lg p-5 marker:content-none sm:flex-row sm:items-start sm:justify-between [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-sm bg-sidebar px-2 py-1 text-sidebar-foreground">
              {notice.number || 'Número não informado'}
            </span>
            {notice.issuer && <span>{notice.issuer}</span>}
            {notice.place && (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin className="size-3.5" /> {notice.place.name}
              </span>
            )}
          </div>
          <h3 className="mt-3 text-lg font-extrabold">
            {notice.title || 'Título não informado'}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            <CalendarDays className="mr-1 inline size-4" />
            {formatDate(notice.registrationStart)} a{' '}
            {formatDate(notice.registrationEnd)}
          </span>
          <ChevronDown className="size-5 transition-transform group-open:rotate-180" />
        </div>
      </summary>
      <div className="border-t-2 border-dashed border-strong-border px-5 py-4">
        {notice.registrationOriginalText && (
          <p className="mb-4 text-sm">
            <strong>Inscrição:</strong> {notice.registrationOriginalText}
          </p>
        )}
        {notice.files.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {notice.files.map((file) =>
              file.url ? (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pomi-focus inline-flex min-h-10 items-center gap-2 rounded-md border-2 border-strong-border bg-background px-3 py-2 text-sm font-bold hover:bg-secondary"
                >
                  <FileText className="size-4 text-primary" />
                  {file.name || 'Arquivo sem nome'}
                  <ExternalLink className="size-3.5" />
                </a>
              ) : (
                <span
                  key={file.id}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md border-2 border-input bg-muted px-3 py-2 text-sm font-bold text-muted-foreground"
                >
                  <FileText className="size-4" />
                  {file.name || 'Arquivo sem nome'} — link indisponível
                </span>
              ),
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum arquivo disponível para este edital.
          </p>
        )}
      </div>
    </details>
  )
}

function CatalogFilters({
  filters,
  issuers,
  places,
  onChange,
}: {
  filters: ExchangeNoticeFilters
  issuers: ReadonlyArray<string>
  places: ReadonlyArray<ExchangePlace>
  onChange: (filters: ExchangeNoticeFilters) => void
}) {
  type ActiveFilter =
    | 'issuers'
    | 'placeIds'
    | 'registrationStartAfter'
    | 'registrationStartBefore'
    | 'registrationEndAfter'
    | 'registrationEndBefore'

  const filterOptions: ReadonlyArray<{
    key: ActiveFilter
    label: string
  }> = [
    { key: 'issuers', label: 'Órgãos emissores' },
    { key: 'placeIds', label: 'Locais' },
    { key: 'registrationStartAfter', label: 'Início a partir de' },
    { key: 'registrationStartBefore', label: 'Início até' },
    { key: 'registrationEndAfter', label: 'Fim a partir de' },
    { key: 'registrationEndBefore', label: 'Fim até' },
  ]
  const [activeFilters, setActiveFilters] = useState<Array<ActiveFilter>>([])
  const update = <TKey extends keyof ExchangeNoticeFilters>(
    key: TKey,
    value: ExchangeNoticeFilters[TKey],
  ) => onChange({ ...filters, [key]: value })
  const addFilter = (key: ActiveFilter) =>
    setActiveFilters((current) =>
      current.includes(key) ? current : [...current, key],
    )
  const removeFilter = (key: ActiveFilter) => {
    setActiveFilters((current) => current.filter((item) => item !== key))
    update(key, defaultExchangeNoticeFilters[key])
  }
  const availableFilters = filterOptions.filter(
    ({ key }) => !activeFilters.includes(key),
  )

  return (
    <div className="mb-6 space-y-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <label className="relative">
          <span className="sr-only">Buscar editais</span>
          <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            value={filters.search}
            placeholder="Busque por título, número ou local"
            onChange={(event) => update('search', event.target.value)}
          />
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" disabled={availableFilters.length === 0}>
              <Plus /> Mais filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {availableFilters.map(({ key, label }) => (
              <DropdownMenuItem key={key} onSelect={() => addFilter(key)}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          onClick={() => {
            addFilter('registrationEndAfter')
            update('registrationEndAfter', localDateKey(new Date()))
          }}
        >
          <Filter /> Inscrições abertas
        </Button>
        <div className="flex gap-2">
          <label>
            <span className="sr-only">Ordenar por</span>
            <select
              className="pomi-focus h-10 rounded-md border-2 border-input bg-background px-3 text-sm font-bold"
              value={filters.sortField}
              onChange={(event) =>
                update(
                  'sortField',
                  event.target.value as ExchangeNoticeFilters['sortField'],
                )
              }
            >
              <option value="registrationStart">Data de início</option>
              <option value="registrationEnd">Data de fim</option>
            </select>
          </label>
          <Button
            variant="outline"
            aria-label={
              filters.sortDirection === 'asc'
                ? 'Alterar para ordem decrescente'
                : 'Alterar para ordem crescente'
            }
            onClick={() =>
              update(
                'sortDirection',
                filters.sortDirection === 'asc' ? 'desc' : 'asc',
              )
            }
          >
            {filters.sortDirection === 'asc' ? 'Crescente' : 'Decrescente'}
          </Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="grid gap-4 rounded-lg border-2 border-strong-border bg-muted/40 p-4 md:grid-cols-2 xl:grid-cols-3">
          {activeFilters.map((key) => {
            const label = filterOptions.find(
              (option) => option.key === key,
            )!.label
            return (
              <div key={key} className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold">{label}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={`Remover filtro ${label}`}
                    onClick={() => removeFilter(key)}
                  >
                    <X />
                  </Button>
                </div>
                {key === 'issuers' ? (
                  <SelectionGroup
                    label=""
                    options={issuers.map((issuer) => ({
                      value: issuer,
                      label: issuer,
                    }))}
                    selected={filters.issuers}
                    onChange={(values) => update('issuers', values)}
                  />
                ) : key === 'placeIds' ? (
                  <SelectionGroup
                    label=""
                    options={places.map((place) => ({
                      value: place.id,
                      label: place.name,
                    }))}
                    selected={filters.placeIds}
                    onChange={(values) => update('placeIds', values)}
                  />
                ) : (
                  <Input
                    aria-label={label}
                    type="date"
                    value={filters[key]}
                    onChange={(event) => update(key, event.target.value)}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ExchangeNoticesPage() {
  const [filters, setFilters] = useState(defaultExchangeNoticeFilters)
  const [page, setPage] = useState(1)
  const noticesQuery = useQuery({
    queryKey: ['exchange', 'notices'],
    queryFn: listExchangeNotices,
    retry: false,
  })
  const placesQuery = useQuery({
    queryKey: ['exchange', 'places'],
    queryFn: listExchangePlaces,
    staleTime: 5 * 60_000,
    retry: false,
  })

  const notices = noticesQuery.data ?? []
  const places = placesQuery.data ?? []
  const issuers = useMemo(
    () =>
      [...new Set(notices.map((notice) => notice.issuer).filter(Boolean))]
        .filter((issuer): issuer is string => typeof issuer === 'string')
        .sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [notices],
  )
  const processed = useMemo(
    () => processExchangeNotices(notices, filters),
    [filters, notices],
  )
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize))
  const visible = processed.slice((page - 1) * pageSize, page * pageSize)

  const changeFilters = (next: ExchangeNoticeFilters) => {
    setFilters(next)
    setPage(1)
  }

  return (
    <PageContainer size="wide">
      <ExchangeAlertsSummary />

      <section aria-labelledby="exchange-notices-title">
        <div className="mb-5">
          <h2 id="exchange-notices-title" className="text-2xl font-black">
            Editais de intercâmbio
          </h2>
          <p className="mt-1 text-muted-foreground">
            Abra um edital para consultar os arquivos disponíveis.
          </p>
        </div>

        <CatalogFilters
          filters={filters}
          issuers={issuers}
          places={places}
          onChange={changeFilters}
        />

        {noticesQuery.isLoading ? (
          <LoadingState label="Carregando editais" />
        ) : noticesQuery.isError ? (
          <ErrorState
            title="Não foi possível carregar os editais"
            description="Verifique sua conexão e tente novamente."
            action={{
              label: 'Tentar novamente',
              onClick: () => void noticesQuery.refetch(),
            }}
          />
        ) : notices.length === 0 ? (
          <EmptyState
            title="Nenhum edital publicado"
            description="Ainda não há editais disponíveis no POMI."
          />
        ) : processed.length === 0 ? (
          <EmptyState
            title="Nenhum edital encontrado"
            description="Remova alguns filtros para ampliar a busca."
            action={{
              label: 'Limpar filtros',
              onClick: () => changeFilters(defaultExchangeNoticeFilters),
            }}
          />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <strong>
                {processed.length === 1
                  ? '1 edital encontrado'
                  : `${processed.length} editais encontrados`}
              </strong>
              <span className="text-muted-foreground">
                Página {page} de {totalPages}
              </span>
            </div>
            <div className="space-y-4">
              {visible.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-center gap-3"
                aria-label="Paginação dos editais"
              >
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Página anterior"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  <ChevronLeft />
                </Button>
                <span className="min-w-24 text-center text-sm font-bold">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Próxima página"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  <ChevronRight />
                </Button>
              </nav>
            )}
          </>
        )}
      </section>
    </PageContainer>
  )
}
