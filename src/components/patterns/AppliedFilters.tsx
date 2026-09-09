import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type AppliedFilterItem<TKey extends string = string> = Readonly<{
  key: TKey
  label: string
  summary: string
  removable?: boolean
}>

export function AppliedFilters<TKey extends string>({
  items,
  onEdit,
  onRemove,
  onAdd,
  onClear,
  className,
}: {
  items: ReadonlyArray<AppliedFilterItem<TKey>>
  onEdit: (key: TKey) => void
  onRemove: (key: TKey) => void
  onAdd?: () => void
  onClear?: () => void
  className?: string
}) {
  if (!items.length && !onAdd) return null

  return (
    <div className={cn('flex min-w-0 flex-wrap items-center gap-2', className)}>
      {items.map((item) => (
        <div
          key={item.key}
          className="inline-flex min-h-10 max-w-full items-stretch overflow-hidden rounded-md border-2 border-strong-border bg-card text-sm shadow-[2px_2px_0_var(--strong-border)]"
        >
          <button
            type="button"
            className="pomi-focus flex min-w-0 items-center gap-1.5 px-3 py-1.5 text-left font-semibold hover:bg-muted"
            aria-label={`Editar filtro ${item.label}: ${item.summary}`}
            onClick={() => onEdit(item.key)}
          >
            <span className="shrink-0 font-extrabold">{item.label}:</span>
            <span className="truncate">{item.summary}</span>
            <Pencil className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
          {item.removable !== false && (
            <button
              type="button"
              className="pomi-focus grid min-w-10 place-items-center border-l-2 border-strong-border hover:bg-accent"
              aria-label={`Remover filtro ${item.label}`}
              onClick={() => onRemove(item.key)}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      ))}
      {onAdd && (
        <Button type="button" variant="outline" onClick={onAdd}>
          <Plus /> Mais filtros
        </Button>
      )}
      {items.length > 1 && onClear && (
        <Button type="button" variant="ghost" onClick={onClear}>
          Limpar todos
        </Button>
      )}
    </div>
  )
}

export function FiltersButton({
  count,
  onClick,
}: {
  count: number
  onClick?: () => void
}) {
  return (
    <Button type="button" variant="outline" onClick={onClick}>
      <SlidersHorizontal /> Filtros{count ? ` (${count})` : ''}
    </Button>
  )
}

export function FilterViewHeader({
  title,
  onBack,
  onClose,
  closeLabel,
  closeClassName,
  actions,
}: {
  title: string
  onBack: () => void
  onClose?: () => void
  closeLabel?: string
  closeClassName?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex min-h-11 items-center gap-2 border-b-2 border-strong-border pb-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Voltar"
        onClick={onBack}
      >
        <ChevronLeft />
      </Button>
      <h3 className="min-w-0 flex-1 truncate text-lg font-extrabold">
        {title}
      </h3>
      {actions}
      {onClose && (
        <Button
          type="button"
          variant="ghost"
          size={closeLabel ? 'sm' : 'icon'}
          className={cn(closeLabel && 'px-2', closeClassName)}
          aria-label={closeLabel ?? 'Fechar filtros'}
          onClick={onClose}
        >
          {closeLabel ?? <X />}
        </Button>
      )}
    </div>
  )
}

export function FilterPropertyList<TKey extends string>({
  items,
  onSelect,
}: {
  items: ReadonlyArray<Readonly<{ key: TKey; label: string; summary?: string }>>
  onSelect: (key: TKey) => void
}) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
  const visibleItems = items.filter(({ label }) =>
    label.toLocaleLowerCase('pt-BR').includes(normalizedQuery),
  )

  return (
    <div className="space-y-3">
      <label className="relative block">
        <span className="sr-only">Buscar filtro</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          placeholder="Buscar filtro..."
          className="pl-9"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div className="overflow-hidden rounded-md border-2 border-strong-border">
        {visibleItems.map(({ key, label, summary }) => (
          <button
            key={key}
            type="button"
            className="pomi-focus flex min-h-12 w-full items-center gap-3 border-b border-border px-3 text-left last:border-b-0 hover:bg-muted"
            onClick={() => onSelect(key)}
          >
            <span className="min-w-0 flex-1 font-bold">{label}</span>
            <span className="max-w-36 truncate text-xs text-muted-foreground">
              {summary ?? 'Não aplicado'}
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
        {!visibleItems.length && (
          <p className="px-3 py-4 text-sm text-muted-foreground">
            Nenhum filtro encontrado.
          </p>
        )}
      </div>
    </div>
  )
}
