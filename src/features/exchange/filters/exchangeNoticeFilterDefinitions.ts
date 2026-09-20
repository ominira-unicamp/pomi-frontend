import { filterCapabilities } from '@ominira/pomi-sdk/generated/data'

import type { AnyFilterDefinition } from '@/components/filters'
import type { ExchangeNoticeFilters } from '@/features/exchange/data/exchangeNotices'
import type { ExchangePlace } from '@/features/exchange/data/exchangeApi'
import { defineFilter, remoteOperators } from '@/components/filters'

export function exchangeNoticeFilterDefinitions({
  issuers,
  places,
}: {
  issuers: ReadonlyArray<string>
  places: ReadonlyArray<ExchangePlace>
}): ReadonlyArray<AnyFilterDefinition<ExchangeNoticeFilters>> {
  const capabilities = filterCapabilities.listExchangeNotices
  return [
    defineFilter<ExchangeNoticeFilters, ReadonlyArray<string>>({
      key: 'issuers',
      label: 'Órgãos emissores',
      source: 'structuredFilter',
      operators: remoteOperators(capabilities, 'issuer'),
      editor: {
        type: 'multiSelect',
        options: issuers.map((issuer) => ({ value: issuer, label: issuer })),
      },
      read: (state) => state.issuers,
      update: (state, value) => ({ ...state, issuers: value }),
      clear: (state) => ({ ...state, issuers: [] }),
      isActive: (value) => value.length > 0,
      summarize: summarizeValues,
      serialize: (value) => ({ in: value }),
    }),
    defineFilter<ExchangeNoticeFilters, ReadonlyArray<number>>({
      key: 'placeIds',
      label: 'Locais',
      source: 'structuredFilter',
      operators: remoteOperators(capabilities, 'placeId'),
      editor: {
        type: 'multiSelect',
        options: places.map((place) => ({
          value: place.id,
          label: place.name,
        })),
      },
      read: (state) => state.placeIds,
      update: (state, value) => ({ ...state, placeIds: value }),
      clear: (state) => ({ ...state, placeIds: [] }),
      isActive: (value) => value.length > 0,
      summarize: (value) =>
        summarizeValues(
          value.map(
            (id) => places.find((place) => place.id === id)?.name ?? String(id),
          ),
        ),
      serialize: (value) => ({ in: value }),
    }),
    ...(
      [
        ['registrationStart', 'Início das inscrições'],
        ['registrationEnd', 'Fim das inscrições'],
      ] as const
    ).map(([field, label]) =>
      defineFilter<
        ExchangeNoticeFilters,
        Readonly<{ minimum: string; maximum: string }>
      >({
        key: field,
        label,
        source: 'structuredFilter',
        operators: remoteOperators(capabilities, field),
        editor: { type: 'range', inputType: 'date' },
        read: (state) => ({
          minimum:
            field === 'registrationStart'
              ? state.registrationStartAfter
              : state.registrationEndAfter,
          maximum:
            field === 'registrationStart'
              ? state.registrationStartBefore
              : state.registrationEndBefore,
        }),
        update: (state, value) =>
          field === 'registrationStart'
            ? {
                ...state,
                registrationStartAfter: value.minimum,
                registrationStartBefore: value.maximum,
              }
            : {
                ...state,
                registrationEndAfter: value.minimum,
                registrationEndBefore: value.maximum,
              },
        clear: (state) =>
          field === 'registrationStart'
            ? {
                ...state,
                registrationStartAfter: '',
                registrationStartBefore: '',
              }
            : {
                ...state,
                registrationEndAfter: '',
                registrationEndBefore: '',
              },
        isActive: (value) => Boolean(value.minimum || value.maximum),
        summarize: (value) =>
          value.minimum && value.maximum
            ? `${formatDate(value.minimum)}–${formatDate(value.maximum)}`
            : value.minimum
              ? `a partir de ${formatDate(value.minimum)}`
              : `até ${formatDate(value.maximum)}`,
        serialize: (value) => ({
          ...(value.minimum ? { gte: value.minimum } : {}),
          ...(value.maximum ? { lte: value.maximum } : {}),
        }),
      }),
    ),
  ]
}

function summarizeValues(values: ReadonlyArray<string>) {
  if (values.length <= 2) return values.join(', ')
  return `${values.slice(0, 2).join(', ')}, +${values.length - 2}`
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}
