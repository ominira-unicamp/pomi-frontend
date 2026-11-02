import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useBlocker } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronRight,
  Layers3,
  Plus,
  Search,
  Tag as TagIcon,
} from 'lucide-react'
import { isApiError } from '@ominira/pomi-sdk'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { formatTagCount } from './TaxonomyPresentation'
import { TaxonomyEditor } from './TaxonomyEditor'
import {
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
  getCategory,
  getTag,
  listCategories,
  listTags,
  updateCategory,
  updateTag,
} from './data/tagTaxonomyApi'
import { buildTagTree, filterTagTree } from './data/tagTaxonomyTree'
import { normalizeTagSearch } from './data/tagTaxonomyNavigation'
import { invalidateTagConsumers, taxonomyKeys } from './data/tagTaxonomyQueries'
import type { EditorState } from './TaxonomyEditor'
import type { Category, Tag, TagInput } from './data/tagTaxonomyApi'
import type { TaxonomyManageSearch } from './data/tagTaxonomyNavigation'
import type { TagTreeNode } from './data/tagTaxonomyTree'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/patterns/Field'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { useConfirmation } from '@/components/patterns/useConfirmation'
import { cn } from '@/lib/utils'

export function TaxonomyManagePage({
  tagId,
  search: incoming,
  onSearchChange,
}: {
  tagId?: number
  search?: TaxonomyManageSearch
  onSearchChange?: (search: TaxonomyManageSearch) => void | Promise<void>
}) {
  const { request: confirm, dialog: confirmationDialog } = useConfirmation()
  const confirmDiscard = () =>
    confirm({
      title: 'Descartar alterações não salvas?',
      description: 'As alterações deste rascunho serão perdidas.',
      confirmLabel: 'Descartar alterações',
      destructive: true,
    })
  const auth = useOptionalAuth()
  const client = useQueryClient()
  const [localSearch, setLocalSearch] = useState<TaxonomyManageSearch>({
    tagId,
  })
  const search = incoming ?? localSearch
  const [editor, setEditor] = useState<EditorState>()
  const [revision, setRevision] = useState(0)
  const [dirty, setDirty] = useState(false)
  const [feedback, setFeedback] = useState<string>()
  const [success, setSuccess] = useState<string>()
  const [accessDenied, setAccessDenied] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const appliedSelection = useRef<string | undefined>(undefined)
  const ownNavigation = useRef(false)
  const structureScroll = useRef(0)
  const structure = useRef<HTMLElement>(null)
  const categoryQuery = useQuery({
    queryKey: taxonomyKeys.categories,
    queryFn: listCategories,
    staleTime: 300_000,
  })
  const tagQuery = useQuery({
    queryKey: taxonomyKeys.tags,
    queryFn: listTags,
    staleTime: 300_000,
  })
  const categories = categoryQuery.data ?? []
  const tags = tagQuery.data ?? []
  const allTrees = useMemo(
    () =>
      categories.map((category) => ({
        category,
        tree: buildTagTree(tags, category.id),
      })),
    [categories, tags],
  )
  const trees = useMemo(() => {
    const query = normalizeTagSearch(search.q ?? '')
    return allTrees
      .filter(
        ({ category }) =>
          !search.categoryId || category.id === search.categoryId,
      )
      .map(({ category, tree }) => ({
        category,
        tree: normalizeTagSearch(category.name).includes(query)
          ? tree
          : filterTagTree(tree, query),
      }))
      .filter(
        ({ category, tree }) =>
          !query ||
          tree.length > 0 ||
          normalizeTagSearch(category.name).includes(query),
      )
  }, [allTrees, search.q, search.categoryId])
  const selection = search.tagId
    ? `tag-${search.tagId}`
    : search.selectedCategoryId
      ? `category-${search.selectedCategoryId}`
      : 'none'
  const editorKey =
    editor?.kind === 'tag'
      ? `tag-${editor.tag?.id ?? 'new'}-${editor.parentTagId ?? ''}`
      : `category-${editor?.category?.id ?? 'new'}`
  const fail = (error: unknown) => {
    setFeedback(taxonomyErrorMessage(error))
    if (isApiError(error) && (error.status === 401 || error.status === 403))
      setAccessDenied(true)
  }

  const navigate = (next: TaxonomyManageSearch) => {
    setLocalSearch(next)
    if (!onSearchChange) return
    ownNavigation.current = true
    void Promise.resolve(onSearchChange(next)).finally(() => {
      ownNavigation.current = false
    })
  }
  const canLeave = async () => !dirty || (await confirmDiscard())
  const setClean = useCallback((value: boolean) => setDirty(value), [])
  const selectEditor = async (next: EditorState) => {
    if (busy || !(await canLeave())) return
    if (!editor || window.innerWidth >= 1024)
      structureScroll.current = window.scrollY
    setDirty(false)
    setFeedback(undefined)
    setSuccess(undefined)
    setEditor(next)
    setRevision((value) => value + 1)
    const nextTag =
      next?.mode === 'create'
        ? search.tagId
        : next?.kind === 'tag'
          ? next.tag?.id
          : undefined
    const nextCategory =
      next?.mode === 'create'
        ? search.selectedCategoryId
        : next?.kind === 'category'
          ? next.category?.id
          : undefined
    appliedSelection.current = nextTag
      ? `tag-${nextTag}`
      : nextCategory
        ? `category-${nextCategory}`
        : 'none'
    navigate({ ...search, tagId: nextTag, selectedCategoryId: nextCategory })
    if (window.innerWidth < 1024)
      requestAnimationFrame(() => window.scrollTo({ top: 0 }))
  }
  const closeEditor = (clearSelection = false) => {
    setDirty(false)
    setEditor(undefined)
    appliedSelection.current = clearSelection ? 'none' : selection
    if (clearSelection)
      navigate({ ...search, tagId: undefined, selectedCategoryId: undefined })
    requestAnimationFrame(() =>
      window.scrollTo({ top: structureScroll.current }),
    )
  }
  const saved = async (value: Category | Tag) => {
    const isTag = 'categoryId' in value
    setEditor(
      isTag
        ? { kind: 'tag', mode: 'edit', tag: value }
        : { kind: 'category', mode: 'edit', category: value },
    )
    setRevision((count) => count + 1)
    setDirty(false)
    setFeedback(undefined)
    setSuccess('Alterações salvas. A estrutura foi atualizada.')
    appliedSelection.current = isTag
      ? `tag-${value.id}`
      : `category-${value.id}`
    navigate({
      ...search,
      tagId: isTag ? value.id : undefined,
      selectedCategoryId: isTag ? undefined : value.id,
    })
    setCollapsed((current) => {
      const next = new Set(current)
      if (isTag) {
        next.delete(`category-${value.categoryId}`)
        let parent = value.parentTagId
        const seen = new Set<number>()
        while (parent && !seen.has(parent)) {
          seen.add(parent)
          next.delete(`tag-${parent}`)
          parent = tags.find((tag) => tag.id === parent)?.parentTagId ?? null
        }
      }
      return next
    })
    await invalidateTagConsumers(client)
  }
  const categoryMutation = useMutation({
    mutationFn: async (input: { id?: number; name: string }) => {
      if (input.id && editor?.kind === 'category' && editor.category) {
        const current = await getCategory(input.id)
        if (current.name !== editor.category.name) {
          client.setQueryData<ReadonlyArray<Category>>(
            taxonomyKeys.categories,
            (items) =>
              items?.map((item) => (item.id === current.id ? current : item)),
          )
          throw new Error(
            'Esta categoria foi alterada por outra pessoa. Reabra o item para carregar a versão atual antes de salvar.',
          )
        }
      }
      return input.id
        ? updateCategory(input.id, input.name, auth.getAccessToken)
        : createCategory(input.name, auth.getAccessToken)
    },
    onSuccess: saved,
    onError: fail,
  })
  const tagMutation = useMutation({
    mutationFn: async (input: TagInput & { id?: number }) => {
      const { id, ...body } = input
      if (id && editor?.kind === 'tag' && editor.tag) {
        const current = await getTag(id)
        const previous = editor.tag
        if (
          current.name !== previous.name ||
          current.categoryId !== previous.categoryId ||
          current.parentTagId !== previous.parentTagId
        ) {
          client.setQueryData<ReadonlyArray<Tag>>(taxonomyKeys.tags, (items) =>
            items?.map((item) => (item.id === current.id ? current : item)),
          )
          throw new Error(
            'Esta tag foi alterada por outra pessoa. Reabra o item para carregar a versão atual antes de salvar.',
          )
        }
      }
      return id
        ? updateTag(id, body, auth.getAccessToken)
        : createTag(body, auth.getAccessToken)
    },
    onSuccess: saved,
    onError: fail,
  })
  const deletion = useMutation({
    mutationFn: async () => {
      if (editor?.kind === 'tag' && editor.tag)
        await deleteTag(editor.tag.id, auth.getAccessToken)
      else if (editor?.kind === 'category' && editor.category)
        await deleteCategory(editor.category.id, auth.getAccessToken)
    },
    onSuccess: async () => {
      closeEditor(true)
      setSuccess('Item excluído.')
      await invalidateTagConsumers(client)
    },
    onError: fail,
  })
  const busy =
    categoryMutation.isPending || tagMutation.isPending || deletion.isPending
  useBlocker({
    disabled: !dirty && !busy,
    enableBeforeUnload: dirty || busy,
    shouldBlockFn: async () =>
      ownNavigation.current ? false : busy || !(await confirmDiscard()),
  })

  useEffect(() => {
    if (
      !tagQuery.isSuccess ||
      !categoryQuery.isSuccess ||
      appliedSelection.current === selection
    )
      return
    appliedSelection.current = selection
    const selectedTag = tags.find((tag) => tag.id === search.tagId)
    const selectedCategory = categories.find(
      (category) => category.id === search.selectedCategoryId,
    )
    setDirty(false)
    setFeedback(undefined)
    setRevision((count) => count + 1)
    if (selectedTag) setEditor({ kind: 'tag', mode: 'edit', tag: selectedTag })
    else if (selectedCategory)
      setEditor({ kind: 'category', mode: 'edit', category: selectedCategory })
    else {
      setEditor(undefined)
      if (selection !== 'none')
        setFeedback(
          'O item solicitado não está mais disponível. Escolha outro na estrutura.',
        )
    }
  }, [
    selection,
    tagQuery.isSuccess,
    categoryQuery.isSuccess,
    tags,
    categories,
    search.tagId,
    search.selectedCategoryId,
  ])

  const removed =
    editor?.mode === 'edit' &&
    (editor.kind === 'tag'
      ? !tags.some((tag) => tag.id === editor.tag?.id)
      : !categories.some((category) => category.id === editor.category?.id))
  const changedElsewhere =
    editor?.mode === 'edit' &&
    (editor.kind === 'tag'
      ? tags.some(
          (tag) =>
            tag.id === editor.tag?.id &&
            (tag.name !== editor.tag.name ||
              tag.parentTagId !== editor.tag.parentTagId ||
              tag.categoryId !== editor.tag.categoryId),
        )
      : categories.some(
          (category) =>
            category.id === editor.category?.id &&
            category.name !== editor.category.name,
        ))
  if (!auth.initialized) return <LoadingState label="Verificando sessão" />
  if (!auth.isAuthenticated || accessDenied)
    return (
      <PageContainer>
        <PageHeader
          title="Organizar taxonomia"
          description={
            accessDenied
              ? 'A sessão não permite alterar a taxonomia. Entre novamente para verificar seu acesso.'
              : 'Entre para contribuir com as categorias e tags da comunidade.'
          }
        />
        <Button onClick={() => void auth.login(window.location.href)}>
          Entrar para contribuir
        </Button>
        <Link
          to="/taxonomia"
          search={{}}
          className={cn(buttonVariants({ variant: 'ghost' }), 'ml-2')}
        >
          Explorar tags
        </Link>
      </PageContainer>
    )
  if (categoryQuery.isPending || tagQuery.isPending)
    return <LoadingState label="Carregando taxonomia" />
  if (categoryQuery.isError || tagQuery.isError)
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível carregar a taxonomia"
          description="Tente novamente."
          action={{
            label: 'Tentar novamente',
            onClick: () => {
              void categoryQuery.refetch()
              void tagQuery.refetch()
            },
          }}
        />
      </PageContainer>
    )
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Conhecimento comunitário"
        title="Organizar taxonomia"
        description="Contribuição comunitária: alterações nos termos afetam disciplinas, interesses, grupos e eventos."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => selectEditor({ kind: 'category', mode: 'create' })}
            >
              <Plus />
              Nova categoria
            </Button>
            <Button
              disabled={busy || categories.length === 0}
              onClick={() =>
                selectEditor({
                  kind: 'tag',
                  mode: 'create',
                  categoryId:
                    editor?.kind === 'tag'
                      ? (editor.tag?.categoryId ??
                        editor.categoryId ??
                        categories[0]?.id)
                      : (editor?.category?.id ?? categories[0]?.id),
                  parentTagId: null,
                })
              }
            >
              <Plus className="size-4" aria-hidden="true" />
              Nova tag
            </Button>
            <Link
              to="/taxonomia"
              search={search.returnTo ?? {}}
              className={buttonVariants({ variant: 'ghost' })}
            >
              Explorar tags
            </Link>
          </div>
        }
      />
      {success && (
        <InlineMessage variant="success" className="mb-4">
          {success}
        </InlineMessage>
      )}
      {feedback && (
        <InlineMessage variant="error" className="mb-4">
          {feedback}
        </InlineMessage>
      )}
      {categories.length === 0 && (
        <EmptyState
          title="Taxonomia vazia"
          description="Crie uma categoria para começar a organizar as tags."
          action={{
            label: 'Criar categoria',
            onClick: () => selectEditor({ kind: 'category', mode: 'create' }),
          }}
        />
      )}
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section
          ref={structure}
          aria-label="Estrutura da taxonomia"
          className={cn(
            'min-w-0 rounded-lg border-2 border-strong-border bg-card p-4 sm:p-5',
            editor?.mode === 'edit' && 'hidden lg:block',
          )}
        >
          <Field className="mb-4">
            <FieldLabel
              htmlFor="taxonomy-structure-search"
              className="flex items-center gap-2"
            >
              <Search className="size-4" />
              Buscar categoria ou tag
            </FieldLabel>
            <Input
              id="taxonomy-structure-search"
              value={search.q ?? ''}
              onChange={(event) =>
                navigate({ ...search, q: event.target.value || undefined })
              }
              placeholder="Nome da categoria ou tag"
            />
          </Field>
          {trees.map(({ category, tree }) => (
            <div key={category.id} className="border-b-2 border-border py-3">
              <div
                className={cn(
                  'flex min-h-11 items-center gap-2 rounded-md',
                  search.selectedCategoryId === category.id && 'bg-primary/10',
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`${collapsed.has(`category-${category.id}`) ? 'Expandir' : 'Recolher'} categoria ${category.name}`}
                  aria-expanded={!collapsed.has(`category-${category.id}`)}
                  onClick={() => toggle(`category-${category.id}`)}
                >
                  {collapsed.has(`category-${category.id}`) ? (
                    <ChevronRight />
                  ) : (
                    <ChevronDown />
                  )}
                </Button>
                <button
                  type="button"
                  aria-label={category.name}
                  aria-pressed={search.selectedCategoryId === category.id}
                  className="pomi-focus min-w-0 flex-1 break-words py-2 text-left text-base font-bold"
                  onClick={() =>
                    selectEditor({ kind: 'category', mode: 'edit', category })
                  }
                >
                  <span className="flex items-center gap-3">
                    <Layers3
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block">{category.name}</span>
                      <span className="block text-xs font-normal text-muted-foreground">
                        {formatTagCount(
                          tags.filter((tag) => tag.categoryId === category.id)
                            .length,
                        )}
                      </span>
                    </span>
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={busy}
                  aria-label={`Criar tag em ${category.name}`}
                  onClick={() =>
                    selectEditor({
                      kind: 'tag',
                      mode: 'create',
                      categoryId: category.id,
                      parentTagId: null,
                    })
                  }
                >
                  <Plus />
                </Button>
              </div>
              {(!collapsed.has(`category-${category.id}`) ||
                Boolean(search.q?.trim())) && (
                <ManagementTree
                  nodes={tree}
                  selectedId={search.tagId}
                  collapsed={collapsed}
                  searching={Boolean(search.q?.trim())}
                  busy={busy}
                  onToggle={toggle}
                  onSelect={(tag) =>
                    selectEditor({ kind: 'tag', mode: 'edit', tag })
                  }
                  onCreate={(tag) =>
                    selectEditor({
                      kind: 'tag',
                      mode: 'create',
                      categoryId: tag.categoryId,
                      parentTagId: tag.id,
                    })
                  }
                />
              )}
            </div>
          ))}
          {categories.length > 0 &&
            trees.every(
              ({ tree, category }) =>
                !tree.length &&
                !normalizeTagSearch(category.name).includes(
                  normalizeTagSearch(search.q ?? ''),
                ),
            ) && (
              <p className="py-4 text-muted-foreground">
                Nenhum item corresponde à busca.
              </p>
            )}
        </section>
        <section
          aria-label="Propriedades da taxonomia"
          className="min-w-0 lg:sticky lg:top-24"
        >
          {editor?.mode === 'edit' && (
            <Button
              variant="ghost"
              className="mb-3 lg:hidden"
              disabled={busy}
              onClick={async () => {
                if (await canLeave()) closeEditor()
              }}
            >
              Voltar à estrutura
            </Button>
          )}
          {!busy && (removed || changedElsewhere) && (
            <InlineMessage variant="warning" role="alert" className="mb-4">
              <p>
                {removed
                  ? 'Este item foi removido. Seu rascunho foi mantido para consulta; escolha outro item na estrutura.'
                  : 'Este item mudou desde que você começou a editar. Reabra-o para carregar a versão atual; seu rascunho foi preservado.'}
              </p>
              <Button
                variant="outline"
                onClick={async () => {
                  if (editor.kind === 'tag') {
                    const current = tags.find(
                      (item) => item.id === editor.tag?.id,
                    )
                    if (current)
                      selectEditor({ kind: 'tag', mode: 'edit', tag: current })
                    else if (await canLeave()) closeEditor()
                  } else {
                    const current = categories.find(
                      (item) => item.id === editor.category?.id,
                    )
                    if (current)
                      selectEditor({
                        kind: 'category',
                        mode: 'edit',
                        category: current,
                      })
                    else if (await canLeave()) closeEditor()
                  }
                }}
              >
                Reabrir item
              </Button>
            </InlineMessage>
          )}
          <TaxonomyEditor
            key={`${editorKey}-${revision}`}
            editor={editor}
            categories={categories}
            tags={tags}
            trees={allTrees.map(({ tree }) => tree)}
            busy={busy || Boolean(removed) || Boolean(changedElsewhere)}
            error={undefined}
            onDirtyChange={setClean}
            onClose={closeEditor}
            onSaveCategory={(input) => categoryMutation.mutate(input)}
            onSaveTag={(input) => tagMutation.mutate(input)}
            confirmDiscard={confirmDiscard}
            onDelete={async () => {
              if (
                await confirm({
                  title:
                    editor?.kind === 'tag'
                      ? 'Excluir tag?'
                      : 'Excluir categoria?',
                  confirmLabel:
                    editor?.kind === 'tag'
                      ? 'Excluir tag'
                      : 'Excluir categoria',
                  destructive: true,
                  description:
                    editor?.kind === 'tag'
                      ? 'Excluir esta tag globalmente? Interesses associados serão removidos. Tags com filhas ou vínculos com disciplinas, grupos ou eventos não podem ser excluídas.'
                      : 'Excluir esta categoria? Categorias com tags não podem ser excluídas.',
                })
              )
                deletion.mutate()
            }}
            onCreateChild={() => {
              if (editor?.kind === 'tag' && editor.tag)
                selectEditor({
                  kind: 'tag',
                  mode: 'create',
                  categoryId: editor.tag.categoryId,
                  parentTagId: editor.tag.id,
                })
            }}
          />
          {editor?.kind === 'tag' && editor.tag && (
            <Link
              className="pomi-focus mt-4 inline-block rounded-sm text-sm font-bold text-primary underline-offset-4 hover:underline"
              to="/taxonomia/tags/$tagId"
              params={{ tagId: String(editor.tag.id) }}
              search={search.returnTo ?? {}}
            >
              Ver detalhe de {editor.tag.name}
            </Link>
          )}
        </section>
      </div>
      {confirmationDialog}
    </PageContainer>
  )
  function toggle(key: string) {
    setCollapsed((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }
}

function ManagementTree({
  nodes,
  selectedId,
  collapsed,
  searching,
  busy,
  onToggle,
  onSelect,
  onCreate,
}: {
  nodes: ReadonlyArray<TagTreeNode>
  selectedId?: number
  collapsed: ReadonlySet<string>
  searching: boolean
  busy: boolean
  onToggle: (key: string) => void
  onSelect: (tag: Tag) => void
  onCreate: (tag: Tag) => void
}) {
  return (
    <ul className="ml-3 space-y-1 border-l-2 border-border pl-3">
      {nodes.map((node) => (
        <li key={node.id}>
          <div
            className={cn(
              'flex min-h-11 items-center gap-1 rounded-md px-1',
              selectedId === node.id && 'bg-primary/10 ring-1 ring-primary',
            )}
          >
            {node.children.length > 0 ? (
              <Button
                variant="ghost"
                size="icon"
                aria-expanded={searching || !collapsed.has(`tag-${node.id}`)}
                aria-label={`${collapsed.has(`tag-${node.id}`) ? 'Expandir' : 'Recolher'} ${node.name}`}
                onClick={() => onToggle(`tag-${node.id}`)}
              >
                {!searching && collapsed.has(`tag-${node.id}`) ? (
                  <ChevronRight />
                ) : (
                  <ChevronDown />
                )}
              </Button>
            ) : (
              <span className="w-10 shrink-0" />
            )}
            <button
              type="button"
              aria-pressed={selectedId === node.id}
              className="pomi-focus flex min-w-0 flex-1 items-center gap-2 break-words py-2 text-left text-sm font-semibold"
              onClick={() => onSelect(node)}
            >
              <TagIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 break-words">{node.name}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              disabled={busy}
              aria-label={`Criar tag filha de ${node.name}`}
              onClick={() => onCreate(node)}
            >
              <Plus />
            </Button>
          </div>
          {node.children.length > 0 &&
            (searching || !collapsed.has(`tag-${node.id}`)) && (
              <ManagementTree
                nodes={node.children}
                selectedId={selectedId}
                collapsed={collapsed}
                searching={searching}
                busy={busy}
                onToggle={onToggle}
                onSelect={onSelect}
                onCreate={onCreate}
              />
            )}
        </li>
      ))}
    </ul>
  )
}

function taxonomyErrorMessage(error: unknown) {
  if (isApiError(error)) {
    if (error.status === 401 || error.status === 403)
      return 'Sem permissão para alterar a taxonomia nesta sessão.'
    if (error.status === 409)
      return `Conflito na taxonomia. ${error.problem?.detail ?? 'Verifique nomes repetidos e vínculos que impedem a operação.'}`
    if (error.status === 422)
      return 'Referência inválida. A categoria ou tag pai pode ter sido removida; reabra o item.'
    if (error.status === 404)
      return 'O item não existe mais. Atualize a estrutura antes de continuar.'
  }
  return error instanceof Error
    ? error.message
    : 'Não foi possível salvar a alteração.'
}
