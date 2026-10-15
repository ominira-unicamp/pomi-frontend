import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { groupApi } from './data/groupApi'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function GroupsPage({
  query,
  onQueryChange,
}: {
  query?: string
  onQueryChange?: (value: string) => void
} = {}) {
  const auth = useOptionalAuth()
  const [localSearch, setLocalSearch] = useState('')
  const search = query ?? localSearch
  const setSearch = onQueryChange ?? setLocalSearch
  const groups = useQuery({
    queryKey: ['public', 'groups'],
    queryFn: groupApi.list,
  })
  const visibleGroups = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    return (groups.data ?? []).filter((group) =>
      [
        group.name,
        group.description ?? '',
        ...group.tags.map((tag) => tag.name),
      ]
        .join(' ')
        .toLocaleLowerCase('pt-BR')
        .includes(term),
    )
  }, [groups.data, search])

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Comunidade"
        title="Explorar grupos"
        description="Conheça as iniciativas e os assuntos que movimentam a comunidade."
        compact
        actions={
          auth.isAuthenticated && (
            <>
              <Link
                to="/meus-grupos"
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Meus grupos
              </Link>
              <Link
                to="/grupos/novo"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                Criar grupo
              </Link>
            </>
          )
        }
      />
      <label className="mb-6 block max-w-xl space-y-2 text-sm font-bold">
        <span>Buscar grupos</span>
        <span className="relative block">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-10"
            value={search}
            placeholder="Nome, descrição ou assunto"
            onChange={(event) => setSearch(event.target.value)}
          />
        </span>
      </label>
      {groups.isPending ? (
        <LoadingState label="Carregando grupos" />
      ) : groups.isError ? (
        <ErrorState
          title="Não foi possível carregar os grupos"
          description="Confira a conexão e tente novamente."
          action={{
            label: 'Tentar novamente',
            onClick: () => void groups.refetch(),
          }}
        />
      ) : visibleGroups.length === 0 ? (
        <EmptyState
          title={search ? 'Nenhum grupo encontrado' : 'Ainda não há grupos'}
          description={
            search
              ? 'Tente outro termo de busca.'
              : 'Quando um grupo for criado, ele aparecerá aqui.'
          }
          action={
            search
              ? { label: 'Limpar busca', onClick: () => setSearch('') }
              : undefined
          }
        />
      ) : (
        <section aria-label="Grupos da comunidade">
          <p className="mb-3 text-sm font-bold text-muted-foreground">
            {visibleGroups.length}{' '}
            {visibleGroups.length === 1 ? 'grupo' : 'grupos'}
          </p>
          <ul className="grid items-start gap-4 md:grid-cols-2">
            {visibleGroups.map((group) => (
              <li
                key={group.id}
                className="min-w-0 rounded-md border-2 border-strong-border bg-card p-5 md:only:col-span-2"
              >
                <article className="flex flex-col">
                  <h2 className="text-xl font-extrabold leading-tight">
                    <Link
                      to="/grupos/$groupId"
                      params={{ groupId: String(group.id) }}
                      className="pomi-focus hover:text-primary"
                    >
                      {group.name}
                    </Link>
                  </h2>
                  {group.description && (
                    <p className="mt-3 line-clamp-3 max-w-2xl text-sm text-muted-foreground">
                      {group.description}
                    </p>
                  )}
                  {group.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-sm bg-muted px-2 py-1 text-xs font-bold"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    to="/grupos/$groupId"
                    params={{ groupId: String(group.id) }}
                    className="pomi-focus mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                  >
                    Conhecer grupo{' '}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageContainer>
  )
}
