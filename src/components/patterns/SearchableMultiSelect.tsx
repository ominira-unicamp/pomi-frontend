import { ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

type MultiSelectOption<T extends string | number> = Readonly<{
  value: T
  label: string
}>

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('pt-BR')
}

export function SearchableMultiSelect<T extends string | number>({
  label,
  options,
  selected,
  onChange,
  disabled = false,
  emptyLabel = 'Nenhuma opção disponível.',
}: {
  label: string
  options: ReadonlyArray<MultiSelectOption<T>>
  selected: ReadonlyArray<T>
  onChange: (values: ReadonlyArray<T>) => void
  disabled?: boolean
  emptyLabel?: string
}) {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const visibleOptions = useMemo(() => {
    const normalizedQuery = normalize(query.trim())
    return options.filter(
      (option) =>
        !normalizedQuery || normalize(option.label).includes(normalizedQuery),
    )
  }, [options, query])
  const toggle = (value: T) =>
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  const selectionLabel = selected.length
    ? `${selected.length} ${selected.length === 1 ? 'selecionado' : 'selecionados'}`
    : `Selecionar ${label.toLocaleLowerCase('pt-BR')}`

  useEffect(() => {
    if (!open) return
    const closeWhenOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpen(false)
      }
    }
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeWhenOutside)
    document.addEventListener('keydown', closeWithEscape)
    return () => {
      document.removeEventListener('pointerdown', closeWhenOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative min-w-0">
      <Button
        className="w-full justify-between border-input bg-background font-medium hover:bg-background"
        variant="outline"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{selectionLabel}</span>
        <ChevronDown className="shrink-0" />
      </Button>
      {open && !disabled && (
        <div
          id={listId}
          role="dialog"
          aria-label={`Selecionar ${label}`}
          className="absolute z-50 mt-1 w-full min-w-72 rounded-md border-2 border-strong-border bg-card p-3 text-card-foreground shadow-[5px_5px_0_var(--strong-border)]"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                aria-label={`Buscar ${label}`}
                className="pl-10"
                placeholder={`Buscar ${label.toLocaleLowerCase('pt-BR')}`}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setOpen(false)
                }}
              />
            </div>
            {selected.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Limpar ${label}`}
                onClick={() => onChange([])}
              >
                <X />
              </Button>
            )}
          </div>
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {visibleOptions.map((option) => {
              const checked = selected.includes(option.value)
              return (
                <label
                  key={String(option.value)}
                  className="flex min-h-10 cursor-pointer items-center gap-3 rounded-sm px-2 py-1 text-sm font-medium hover:bg-muted"
                >
                  <Checkbox
                    checked={checked}
                    aria-label={option.label}
                    onCheckedChange={() => toggle(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              )
            })}
            {!options.length ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                {emptyLabel}
              </p>
            ) : !visibleOptions.length ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                Nenhuma opção encontrada.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
