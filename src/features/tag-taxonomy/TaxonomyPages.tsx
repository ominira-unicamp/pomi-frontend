import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Layers3,
  Pencil,
  Search,
  Tags,
} from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import {
  getTag,
  listCategories,
  listTagCoursesPage,
  listTags,
} from './data/tagTaxonomyApi'
import { taxonomyKeys } from './data/tagTaxonomyQueries'
import { buildTagTree } from './data/tagTaxonomyTree'
import {
  normalizeTagSearch,
  tagAncestors,
  tagPath,
} from './data/tagTaxonomyNavigation'
import {
  InterestControl,
  InterestFeedback,
  useTaxonomyInterests,
} from './useTaxonomyInterests'
import type {
  TagDetailsSearch,
  TaxonomySearch,
} from './data/tagTaxonomyNavigation'
import type { Tag } from './data/tagTaxonomyApi'
import type { ReactNode } from 'react'
import type { TagTreeNode } from './data/tagTaxonomyTree'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { ContextBackLink } from '@/components/ContextBackLink'
import { AppliedFilters } from '@/components/patterns/AppliedFilters'
import { Field, FieldLabel } from '@/components/patterns/Field'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function useTaxonomy() {
  const categories = useQuery({
    queryKey: taxonomyKeys.categories,
    queryFn: listCategories,
    staleTime: 300_000,
  })
  const tags = useQuery({
    queryKey: taxonomyKeys.tags,
    queryFn: listTags,
    staleTime: 300_000,
  })
  return { categories, tags }
}

export function TaxonomyExplorePage({
  search,
  onSearchChange,
}: {
  search: TaxonomySearch
  onSearchChange: (search: TaxonomySearch) => void
}) {
  const { categories, tags } = useTaxonomy()
  const interestState = useTaxonomyInterests()
  const { auth, student, studentId, interests } = interestState
  const query = normalizeTagSearch(search.q ?? '')
  const filtered = useMemo(
    () =>
      (tags.data ?? [])
        .filter(
          (tag) =>
            (!search.categoryId || tag.categoryId === search.categoryId) &&
            (!query || normalizeTagSearch(tag.name).includes(query)) &&
            (!search.interests ||
              interests.data?.some((item) => item.id === tag.id)),
        )
        .sort(
          (a, b) =>
            (search.order === 'desc' ? -1 : 1) *
            a.name.localeCompare(b.name, 'pt-BR'),
        ),
    [
      tags.data,
      search.categoryId,
      search.interests,
      search.order,
      query,
      interests.data,
    ],
  )
  const listMode = Boolean(query || search.interests)
  const ready = categories.isSuccess && tags.isSuccess
  const categoryName = categories.data?.find(
    (category) => category.id === search.categoryId,
  )?.name
  const filterPending =
    Boolean(search.interests) &&
    (!auth.initialized ||
      (auth.isAuthenticated &&
        (student.isPending || (Boolean(studentId) && interests.isPending))))
  const groups = (categories.data ?? [])
    .filter(
      (category) => !search.categoryId || category.id === search.categoryId,
    )
    .map((category) => ({
      category,
      items: filtered.filter((tag) => tag.categoryId === category.id),
    }))
    .filter(({ items }) => items.length > 0)
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Conhecimento comunitário"
        title="Explorar tags"
        description="Descubra assuntos e disciplinas e navegue pelo conhecimento da comunidade."
        actions={
          auth.initialized &&
          auth.isAuthenticated && (
            <Link
              to="/taxonomia/organizar"
              search={{}}
              className={buttonVariants({ variant: 'outline' })}
            >
              Organizar taxonomia
            </Link>
          )
        }
      />
      <div>
        <section aria-label="Exploração de tags" className="min-w-0">
          <div className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,0.55fr)] lg:grid-cols-[minmax(0,1fr)_minmax(10rem,0.55fr)_auto]">
            <Field className="min-w-0">
              <FieldLabel htmlFor="taxonomy-search">Buscar tags</FieldLabel>
              <span className="relative block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="taxonomy-search"
                  value={search.q ?? ''}
                  placeholder="Buscar tags"
                  className="h-11 pl-10"
                  onChange={(event) =>
                    onSearchChange({
                      ...search,
                      q: event.target.value || undefined,
                    })
                  }
                />
              </span>
            </Field>
            <Field className="min-w-0">
              <FieldLabel htmlFor="taxonomy-category">Categoria</FieldLabel>
              <Select
                value={String(search.categoryId ?? 'all')}
                onValueChange={(value) =>
                  onSearchChange({
                    ...search,
                    categoryId: value === 'all' ? undefined : Number(value),
                  })
                }
              >
                <SelectTrigger id="taxonomy-category" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.data?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {auth.isAuthenticated && (
              <label className="flex min-h-11 items-center gap-2 whitespace-nowrap text-sm font-bold">
                <Checkbox
                  checked={Boolean(search.interests)}
                  onCheckedChange={(checked) =>
                    onSearchChange({
                      ...search,
                      interests: checked === true || undefined,
                    })
                  }
                />
                Meus interesses
              </label>
            )}
          </div>
          <AppliedFilters<'q' | 'categoryId' | 'interests'>
            className="mt-4"
            items={[
              ...(search.q
                ? [{ key: 'q' as const, label: 'Busca', summary: search.q }]
                : []),
              ...(search.categoryId
                ? [
                    {
                      key: 'categoryId' as const,
                      label: 'Categoria',
                      summary: categoryName ?? String(search.categoryId),
                    },
                  ]
                : []),
              ...(search.interests
                ? [
                    {
                      key: 'interests' as const,
                      label: 'Interesses',
                      summary: 'Meus interesses',
                    },
                  ]
                : []),
            ]}
            onRemove={(key) => onSearchChange({ ...search, [key]: undefined })}
            onClear={() => onSearchChange({ order: search.order })}
            clearLabel="Limpar filtros"
          />
          <div className="my-4 space-y-2">
            <InterestFeedback state={interestState} />
            {auth.initialized && !auth.isAuthenticated && (
              <Button
                variant="outline"
                onClick={() => void auth.login(window.location.href)}
              >
                Entrar para registrar interesses
              </Button>
            )}
            {auth.isAuthenticated && student.isSuccess && !studentId && (
              <p className="text-sm text-muted-foreground">
                Cadastre seu perfil de estudante para registrar interesses.
              </p>
            )}
          </div>
          {ready &&
            !filterPending &&
            (!search.interests || interests.isSuccess) && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  {filtered.length}{' '}
                  {filtered.length === 1
                    ? 'tag encontrada'
                    : 'tags encontradas'}
                </p>
                <div className="flex items-center gap-2">
                  <FieldLabel htmlFor="taxonomy-order">Ordenar por</FieldLabel>
                  <Select
                    value={search.order ?? 'asc'}
                    onValueChange={(value) =>
                      onSearchChange({
                        ...search,
                        order: value === 'desc' ? 'desc' : 'asc',
                      })
                    }
                  >
                    <SelectTrigger id="taxonomy-order" className="w-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Nome: A–Z</SelectItem>
                      <SelectItem value="desc">Nome: Z–A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          {categories.isPending || tags.isPending ? (
            <LoadingState label="Carregando tags" />
          ) : categories.isError || tags.isError ? (
            <ErrorState
              title="Não foi possível carregar as tags"
              description="Tente novamente."
              action={{
                label: 'Tentar novamente',
                onClick: () => {
                  void categories.refetch()
                  void tags.refetch()
                },
              }}
            />
          ) : filterPending ? (
            <LoadingState label="Carregando interesses" />
          ) : search.interests && !auth.isAuthenticated ? (
            <Button onClick={() => void auth.login(window.location.href)}>
              Entrar para ver meus interesses
            </Button>
          ) : search.interests && (student.isError || interests.isError) ? (
            <p className="text-sm text-muted-foreground">
              Tente carregar seus interesses novamente para aplicar este filtro.
            </p>
          ) : search.interests && !studentId ? (
            <p className="text-sm text-muted-foreground">
              O filtro de interesses requer um perfil de estudante.
            </p>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Nenhuma tag encontrada"
              description="Tente outro termo ou altere os filtros."
            />
          ) : (
            <div className="space-y-4">
              {groups.map(({ category, items }) => (
                <details
                  key={category.id}
                  open
                  className="group/category rounded-lg border-2 border-strong-border bg-card p-3 sm:p-4"
                >
                  <summary className="pomi-focus flex min-h-11 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
                    <Layers3
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold">{category.name}</h2>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {items.length} {items.length === 1 ? 'tag' : 'tags'}
                    </span>
                    <ChevronDown
                      className="size-4 shrink-0 transition-transform group-open/category:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="mt-3">
                    {listMode ? (
                      <ul className="divide-y divide-border">
                        {items.map((tag) => (
                          <li key={tag.id}>
                            <ExploreRow
                              tag={tag}
                              search={search}
                              interestState={interestState}
                              path={`${category.name} › ${tagPath(tag, tags.data)}`}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ExploreTree
                        nodes={buildTagTree(items, category.id)}
                        descending={search.order === 'desc'}
                        search={search}
                        interestState={interestState}
                      />
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  )
}

function TagLink({ tag, search }: { tag: Tag; search: TaxonomySearch }) {
  return (
    <Link
      to="/taxonomia/tags/$tagId"
      params={{ tagId: String(tag.id) }}
      search={{ ...search }}
      className="pomi-focus min-w-0 break-words text-sm font-semibold hover:text-primary"
    >
      {tag.name}
    </Link>
  )
}

function ExploreRow({
  tag,
  search,
  interestState,
  path,
  expansion,
}: {
  tag: Tag
  search: TaxonomySearch
  interestState: ReturnType<typeof useTaxonomyInterests>
  path?: string
  expansion?: ReactNode
}) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
      {expansion}
      <div className="min-w-0 flex-1">
        <TagLink tag={tag} search={search} />
        {path && (
          <p className="mt-1 break-words text-xs text-muted-foreground">
            {path}
          </p>
        )}
      </div>
      <InterestControl
        state={interestState}
        tagId={tag.id}
        name={tag.name}
        compact
        iconOnly
      />
    </div>
  )
}

function ExploreTree({
  nodes,
  search,
  interestState,
  descending,
}: {
  nodes: ReadonlyArray<TagTreeNode>
  search: TaxonomySearch
  interestState: ReturnType<typeof useTaxonomyInterests>
  descending: boolean
}) {
  const ordered = descending ? [...nodes].reverse() : nodes
  return (
    <ul className="divide-y-2 divide-border">
      {ordered.map((node) => (
        <ExploreTreeItem
          key={node.id}
          node={node}
          search={search}
          interestState={interestState}
          descending={descending}
        />
      ))}
    </ul>
  )
}

function ExploreTreeItem({
  node,
  search,
  interestState,
  descending,
}: {
  node: TagTreeNode
  search: TaxonomySearch
  interestState: ReturnType<typeof useTaxonomyInterests>
  descending: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const childrenId = useId()
  return (
    <li>
      <ExploreRow
        tag={node}
        search={search}
        interestState={interestState}
        expansion={
          node.children.length > 0 ? (
            <Button
              variant="ghost"
              size="icon"
              aria-expanded={expanded}
              aria-controls={childrenId}
              aria-label={`${expanded ? 'Recolher' : 'Expandir'} subtags de ${node.name}`}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronDown /> : <ChevronRight />}
            </Button>
          ) : (
            <span className="w-10 shrink-0" />
          )
        }
      />
      {node.children.length > 0 && (
        <div
          id={childrenId}
          hidden={!expanded}
          className="ml-3 border-l-2 border-border pl-2"
        >
          <ExploreTree
            nodes={node.children}
            search={search}
            interestState={interestState}
            descending={descending}
          />
        </div>
      )}
    </li>
  )
}

export function TaxonomyTagPage({
  tagId,
  search,
  onPageChange,
}: {
  tagId: number
  search: TagDetailsSearch
  onPageChange: (page: number) => void
}) {
  const { categories, tags } = useTaxonomy()
  const interestState = useTaxonomyInterests()
  const { auth } = interestState
  const page = search.page ?? 1
  const tag = useQuery({
    queryKey: ['public', 'tag-taxonomy', 'tag', tagId],
    queryFn: () => getTag(tagId),
    enabled: Number.isSafeInteger(tagId) && tagId > 0,
  })
  const courses = useQuery({
    queryKey: ['public', 'tag-taxonomy', 'courses', tagId, page],
    queryFn: () => listTagCoursesPage(tagId, page),
    enabled: tag.isSuccess,
  })
  const context = {
    q: search.q,
    categoryId: search.categoryId,
    interests: search.interests,
    order: search.order,
  }
  if (!Number.isSafeInteger(tagId) || tagId <= 0)
    return (
      <PageContainer>
        <EmptyState
          title="Tag não encontrada"
          description="Verifique o endereço informado."
        />
      </PageContainer>
    )
  if (tag.isPending) return <LoadingState label="Carregando tag" />
  if (tag.isError)
    return (
      <PageContainer>
        <Link to="/taxonomia" search={context}>
          Voltar à exploração
        </Link>
        <ErrorState
          title="Não foi possível carregar a tag"
          description="Ela pode ter sido removida ou a conexão está indisponível."
          action={{
            label: 'Tentar novamente',
            onClick: () => void tag.refetch(),
          }}
        />
      </PageContainer>
    )
  const category = categories.data?.find(
    (item) => item.id === tag.data.categoryId,
  )
  const children = tags.data?.filter((item) => item.parentTagId === tagId)
  const courseTotal =
    courses.isSuccess && typeof courses.data.total === 'number'
      ? courses.data.total
      : undefined
  return (
    <PageContainer size="wide">
      <ContextBackLink
        to="/taxonomia"
        search={context}
        label="Voltar à exploração"
      />
      <nav
        aria-label="Caminho da tag"
        className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          to="/taxonomia"
          search={{ ...context, categoryId: tag.data.categoryId }}
          className="pomi-focus rounded-sm underline-offset-4 hover:text-primary hover:underline"
        >
          {category?.name ??
            (categories.isError ? 'Categoria indisponível' : 'Categoria')}
        </Link>
        {tagAncestors(tag.data, tags.data ?? []).map((ancestor) => (
          <span key={ancestor.id}>
            › <TagLink tag={ancestor} search={context} />
          </span>
        ))}
        <span aria-current="page">› {tag.data.name}</span>
      </nav>
      <PageHeader
        title={tag.data.name}
        actions={
          <>
            <InterestControl
              state={interestState}
              tagId={tagId}
              name={tag.data.name}
            />
            {auth.initialized && auth.isAuthenticated && (
              <Link
                to="/taxonomia/organizar"
                search={{ tagId, returnTo: { ...context, page } }}
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Editar na taxonomia
              </Link>
            )}
          </>
        }
      />
      <div className="mb-5">
        <InterestFeedback state={interestState} />
      </div>
      {(categories.isError || tags.isError) && (
        <InlineMessage variant="warning" className="mb-5">
          <p>
            Não foi possível carregar toda a hierarquia. As disciplinas
            continuam disponíveis.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              void categories.refetch()
              void tags.refetch()
            }}
          >
            Recarregar hierarquia
          </Button>
        </InlineMessage>
      )}

      <div>
        <div className="min-w-0 space-y-7">
          <section>
            <h2 className="text-xl font-extrabold sm:text-2xl">
              Disciplinas associadas
              {courseTotal !== undefined && ` (${courseTotal})`}
            </h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              Somente disciplinas associadas diretamente a esta tag.
            </p>
            {courses.isPending ? (
              <LoadingState label="Carregando disciplinas" />
            ) : courses.isError ? (
              <ErrorState
                title="Não foi possível carregar as disciplinas"
                description="Tente novamente."
                action={{
                  label: 'Tentar novamente',
                  onClick: () => void courses.refetch(),
                }}
              />
            ) : (
              <>
                {courses.data.data.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {courses.data.data.map((course) => (
                      <li key={course.id}>
                        <Link
                          to="/disciplinas/$courseId"
                          params={{ courseId: String(course.id) }}
                          search={{}}
                          className="pomi-focus flex min-h-14 items-center gap-3 px-3 py-3 hover:bg-muted sm:px-4"
                        >
                          <span className="min-w-0 flex-1 break-words text-sm font-semibold">
                            <span className="font-mono text-primary">
                              {course.code}
                            </span>{' '}
                            · {course.name}
                          </span>
                          <GraduationCap
                            className="hidden size-4 shrink-0 text-muted-foreground sm:block"
                            aria-hidden="true"
                          />
                          <span className="shrink-0 text-sm">
                            {course.credits} cr.
                          </span>
                          <ChevronRight
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
                    {page === 1
                      ? 'Nenhuma disciplina associada diretamente a esta tag.'
                      : 'Nenhuma disciplina nesta página.'}{' '}
                    As subtags possuem suas próprias associações.
                  </div>
                )}
                {(page > 1 || courses.data.links.next) && (
                  <nav
                    aria-label="Páginas de disciplinas"
                    className="mt-5 flex items-center gap-3"
                  >
                    {page > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => onPageChange(page - 1)}
                      >
                        Anterior
                      </Button>
                    )}
                    <span className="text-sm">Página {page}</span>
                    {courses.data.links.next && (
                      <Button
                        variant="outline"
                        onClick={() => onPageChange(page + 1)}
                      >
                        Próxima
                      </Button>
                    )}
                  </nav>
                )}
              </>
            )}
          </section>
          {Boolean(children?.length) && (
            <section>
              <h2 className="mb-3 text-xl font-extrabold">
                Subtags ({children?.length})
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {children?.map((child) => (
                  <li key={child.id}>
                    <Link
                      to="/taxonomia/tags/$tagId"
                      params={{ tagId: String(child.id) }}
                      search={context}
                      className="pomi-focus flex min-h-12 items-center gap-3 rounded-md border border-border bg-card px-4 py-3 hover:border-primary"
                    >
                      <Tags
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 break-words font-bold">
                        {child.name}
                      </span>
                      <ChevronRight
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
