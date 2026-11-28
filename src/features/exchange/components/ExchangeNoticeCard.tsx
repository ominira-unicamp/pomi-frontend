import {
  CalendarDays,
  ChevronDown,
  ExternalLink,
  FileText,
  MapPin,
} from 'lucide-react'

import type { ExchangeNotice } from '@/features/exchange/data/exchangeApi'

function formatDate(value: string | null) {
  if (!value) return 'Não informada'
  const [year, month, day] = value.split('-')
  return year && month && day ? `${day}/${month}/${year}` : value
}

export function ExchangeNoticeCard({ notice }: { notice: ExchangeNotice }) {
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
