import { ChevronLeft, Pencil, Plus, SlidersHorizontal, X } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
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
  onClick: () => void
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
  actions,
}: {
  title: string
  onBack: () => void
  onClose?: () => void
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
          size="icon"
          aria-label="Fechar filtros"
          onClick={onClose}
        >
          <X />
        </Button>
      )}
    </div>
  )
}
