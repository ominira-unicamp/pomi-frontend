import { Command } from 'cmdk'
import { memo, useEffect, useId, useMemo, useRef, useState } from 'react'

export type AutocompleteOption = Readonly<{ value: string; label: string }>

type AutocompleteSelectProps = Readonly<{
  ariaLabel: string
  disabled?: boolean
  emptyLabel?: string
  onValueChange: (value: string) => void
  options: ReadonlyArray<AutocompleteOption>
  placeholder?: string
  value: string
}>

const optionHeight = 40
const viewportHeight = 224
const overscan = 4
const listChromeHeight = 10

function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('pt-BR')
}

export const AutocompleteSelect = memo(function AutocompleteSelect({
  ariaLabel,
  disabled,
  emptyLabel,
  onValueChange,
  options,
  placeholder,
  value,
}: AutocompleteSelectProps) {
  const listId = useId()
  const selected = options.find((option) => option.value === value)
  const [query, setQuery] = useState(selected?.label ?? '')
  const [open, setOpen] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const indexedOptions = useMemo(
    () =>
      options.map((option) => ({
        option,
        searchText: normalizeSearchText(String(option.label)),
      })),
    [options],
  )

  useEffect(() => setQuery(selected?.label ?? ''), [selected?.label])

  const select = (option?: AutocompleteOption) => {
    if (!option) {
      setQuery('')
      onValueChange('')
      setOpen(false)
      return
    }
    setQuery(option.label)
    onValueChange(option.value)
    setOpen(false)
  }
  const normalizedQuery = normalizeSearchText(query.trim())
  const visibleOptions = useMemo(
    () =>
      indexedOptions
        .filter(
          ({ searchText }) =>
            !normalizedQuery || searchText.includes(normalizedQuery),
        )
        .map(({ option }) => option),
    [indexedOptions, normalizedQuery],
  )
  const optionListOffset = emptyLabel ? optionHeight : 0
  const optionScrollTop = Math.max(0, scrollTop - optionListOffset)
  const visibleCount = Math.ceil(viewportHeight / optionHeight)
  const firstOptionIndex = Math.max(
    0,
    Math.floor(optionScrollTop / optionHeight) - overscan,
  )
  const lastOptionIndex = Math.min(
    visibleOptions.length,
    firstOptionIndex + visibleCount + overscan * 2,
  )
  const renderedOptions = visibleOptions.slice(firstOptionIndex, lastOptionIndex)

  useEffect(() => {
    setScrollTop(0)
    if (listRef.current) listRef.current.scrollTop = 0
  }, [normalizedQuery])

  return (
    <Command label={ariaLabel} shouldFilter={false} loop className="relative">
      <Command.Input
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open}
        value={query}
        disabled={disabled}
        placeholder={placeholder ?? emptyLabel}
        aria-label={ariaLabel}
        className="pomi-focus h-10 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        onFocus={() => setOpen(true)}
        onValueChange={(nextQuery) => {
          setQuery(nextQuery)
          setOpen(true)
          if (!nextQuery) onValueChange('')
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
          if (event.key === 'Enter' && visibleOptions.length === 1) {
            event.preventDefault()
            select(visibleOptions[0])
          }
        }}
        onBlur={() => setOpen(false)}
      />
      {open && !disabled && (
        <Command.List
          ref={listRef}
          id={listId}
          label={`Opções de ${ariaLabel}`}
          className="absolute z-50 mt-1 w-max min-w-full overflow-y-auto rounded-md border-2 border-strong-border bg-popover p-1 text-popover-foreground shadow-lg"
          style={{
            height: Math.min(
              viewportHeight + listChromeHeight,
              listChromeHeight +
                optionListOffset +
                Math.max(visibleOptions.length, 1) * optionHeight,
            ),
          }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          {emptyLabel && (
            <Command.Item
              value="__empty__"
              className="pomi-focus block h-10 w-full whitespace-nowrap rounded-sm px-3 py-2 text-left text-sm font-semibold data-[selected=true]:bg-accent"
              onMouseDown={(event) => event.preventDefault()}
              onSelect={() => select()}
            >
              {emptyLabel}
            </Command.Item>
          )}
          <div
            style={{
              height: visibleOptions.length * optionHeight,
              position: 'relative',
            }}
          >
            {renderedOptions.map((option, index) => (
              <Command.Item
                key={option.value}
                value={option.value}
                className="pomi-focus absolute h-10 w-full whitespace-nowrap rounded-sm px-3 py-2 text-left text-sm font-semibold hover:bg-accent data-[selected=true]:bg-accent"
                style={{ top: (firstOptionIndex + index) * optionHeight }}
                onMouseDown={(event) => event.preventDefault()}
                onSelect={() => select(option)}
              >
                {option.label}
              </Command.Item>
            ))}
          </div>
          {!visibleOptions.length && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Nenhuma opção encontrada.
            </p>
          )}
        </Command.List>
      )}
    </Command>
  )
})
