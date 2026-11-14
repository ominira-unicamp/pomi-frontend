import { useMemo } from 'react'

import type { AnyFilterDefinition } from './filterTypes'

export function useFilterController<TState>({
  state,
  definitions,
  onChange,
}: {
  state: TState
  definitions: ReadonlyArray<AnyFilterDefinition<TState>>
  onChange: (state: TState) => void
}) {
  const availableDefinitions = useMemo(
    () =>
      definitions.filter(
        (definition) => definition.isAvailable?.(state) ?? true,
      ),
    [definitions, state],
  )
  const activeDefinitions = availableDefinitions.filter((definition) =>
    definition.isActive(definition.read(state)),
  )

  return {
    definitions: availableDefinitions,
    activeItems: activeDefinitions.map((definition) => ({
      key: definition.key,
      label: definition.label,
      summary: definition.summarize(definition.read(state)),
    })),
    activeCount: activeDefinitions.length,
    definition(key: string) {
      return availableDefinitions.find((definition) => definition.key === key)
    },
    update(key: string, value: unknown) {
      const definition = availableDefinitions.find((item) => item.key === key)
      if (definition) onChange(definition.update(state, value))
    },
    clear(key: string) {
      const definition = availableDefinitions.find((item) => item.key === key)
      if (definition) onChange(definition.clear(state))
    },
    clearAll() {
      onChange(
        activeDefinitions.reduce(
          (current, definition) => definition.clear(current),
          state,
        ),
      )
    },
  }
}
