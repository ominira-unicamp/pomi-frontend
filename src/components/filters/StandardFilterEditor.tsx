import type { AnyFilterDefinition } from './filterTypes'

import { SearchableMultiSelect } from '@/components/patterns/SearchableMultiSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function StandardFilterEditor<TState>({
  definition,
  state,
  onChange,
}: {
  definition: AnyFilterDefinition<TState>
  state: TState
  onChange: (state: TState) => void
}) {
  const value = definition.read(state)
  const update = (next: unknown) => onChange(definition.update(state, next))
  const clear = () => onChange(definition.clear(state))
  const editor = definition.editor

  if (editor.type === 'custom')
    return editor.render({ value, onChange: update, onClear: clear })

  if (editor.type === 'boolean')
    return (
      <Button
        type="button"
        variant={value ? 'default' : 'outline'}
        onClick={() => update(!value)}
      >
        {value ? 'Ativado' : 'Desativado'}
      </Button>
    )

  if (editor.type === 'select')
    return (
      <Select
        value={value === undefined || value === '' ? '__all' : String(value)}
        onValueChange={(next) =>
          update(
            next === '__all'
              ? undefined
              : editor.options.find((option) => String(option.value) === next)
                  ?.value,
          )
        }
      >
        <SelectTrigger aria-label={definition.label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all">Qualquer</SelectItem>
          {editor.options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )

  if (editor.type === 'multiSelect')
    return (
      <SearchableMultiSelect
        inline
        label={definition.label}
        options={editor.options}
        selected={Array.isArray(value) ? value : []}
        onChange={update}
      />
    )

  const range = (value ?? {}) as { minimum?: string; maximum?: string }
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        ['minimum', editor.minimumLabel ?? 'A partir de'],
        ['maximum', editor.maximumLabel ?? 'Até'],
      ].map(([key, label]) => (
        <label key={key} className="text-xs font-bold">
          {label}
          {editor.options ? (
            <select
              value={range[key as keyof typeof range] ?? ''}
              onChange={(event) =>
                update({ ...range, [key]: event.target.value })
              }
              className="mt-1 h-9 w-full rounded-md border-2 border-input bg-background px-2 text-sm"
            >
              <option value="">Qualquer</option>
              {editor.options.map((option) => (
                <option key={String(option.value)} value={String(option.value)}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              className="mt-1"
              type={editor.inputType}
              value={range[key as keyof typeof range] ?? ''}
              onChange={(event) =>
                update({ ...range, [key]: event.target.value })
              }
            />
          )}
        </label>
      ))}
    </div>
  )
}
