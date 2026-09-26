import type { ReactNode } from 'react'

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in'

export type FilterOption = Readonly<{
  value: string | number
  label: string
}>

export type StandardFilterEditor =
  | Readonly<{ type: 'boolean' }>
  | Readonly<{ type: 'select'; options: ReadonlyArray<FilterOption> }>
  | Readonly<{ type: 'multiSelect'; options: ReadonlyArray<FilterOption> }>
  | Readonly<{
      type: 'range'
      inputType: 'date' | 'time' | 'number'
      minimumLabel?: string
      maximumLabel?: string
      options?: ReadonlyArray<FilterOption>
    }>

export type FilterDefinition<TState, TValue = unknown> = Readonly<{
  key: string
  label: string
  source: 'local' | 'queryParameter' | 'structuredFilter'
  operators?: ReadonlyArray<FilterOperator>
  editor:
    | StandardFilterEditor
    | Readonly<{
        type: 'custom'
        render: (props: FilterEditorProps<TValue>) => ReactNode
      }>
  isAvailable?: (state: TState) => boolean
  read: (state: TState) => TValue
  update: (state: TState, value: TValue) => TState
  clear: (state: TState) => TState
  isActive: (value: TValue) => boolean
  summarize: (value: TValue) => string
  serialize?: (value: TValue) => unknown
}>

export type AnyFilterDefinition<TState> = FilterDefinition<TState, any>

export type FilterEditorProps<TValue = unknown> = Readonly<{
  value: TValue
  onChange: (value: TValue) => void
  onClear: () => void
}>

export function defineFilter<TState, TValue>(
  definition: FilterDefinition<TState, TValue>,
): FilterDefinition<TState, TValue> {
  return definition
}
