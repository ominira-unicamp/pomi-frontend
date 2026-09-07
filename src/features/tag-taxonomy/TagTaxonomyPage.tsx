import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  ChevronDown,
  ChevronRight,
  Edit3,
  FolderPlus,
  PencilLine,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import {
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
  listCategories,
  listRelatedCourses,
  listTags,
  updateCategory,
  updateTag,
} from './data/tagTaxonomyApi'
import {
  buildTagTree,
  collectDescendantTagIds,
  filterTagTree,
} from './data/tagTaxonomyTree'
import type { Category, Tag } from './data/tagTaxonomyApi'
import type { TagTreeNode } from './data/tagTaxonomyTree'
import { useOptionalAuth } from '@/auth/AuthProvider'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
} from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type EditorState =
  | { kind: 'category'; mode: 'create' | 'edit'; category?: Category }
  | {
      kind: 'tag'
      mode: 'create' | 'edit'
      tag?: Tag
      categoryId?: number
      parentTagId?: number | null
    }
  | undefined

const taxonomyQueryKey = ['public', 'tag-taxonomy'] as const

export function TagTaxonomyPage() {
  const auth = useOptionalAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedTagId, setSelectedTagId] = useState<number>()
  const [expandedTagIds, setExpandedTagIds] = useState<Set<number>>(new Set())
  const [contributionMode, setContributionMode] = useState(false)
  const [editor, setEditor] = useState<EditorState>()
  const [feedback, setFeedback] = useState<string>()

  const categoriesQuery = useQuery({
    queryKey: [...taxonomyQueryKey, 'categories'],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  })
  const tagsQuery = useQuery({
    queryKey: [...taxonomyQueryKey, 'tags'],
    queryFn: listTags,
    staleTime: 5 * 60 * 1000,
  })
  const relatedCoursesQuery = useQuery({
    queryKey: [...taxonomyQueryKey, 'related-courses', selectedTagId],
    queryFn: () => listRelatedCourses(selectedTagId!),
    enabled: selectedTagId !== undefined,
  })

  const tags = tagsQuery.data ?? []
  const categories = categoriesQuery.data ?? []
  const allTrees = useMemo(
    () =>
      categories.map((category) => ({
        category,
        tree: buildTagTree(tags, category.id),
      })),
    [categories, tags],
  )
  const trees = useMemo(
    () =>
      allTrees
        .map(({ category, tree }) => ({
          category,
          tree: filterTagTree(tree, search),
        }))
        .filter(({ tree }) => tree.length > 0 || !search.trim()),
    [allTrees, search],
  )
  const selectedTag = tags.find((tag) => tag.id === selectedTagId)
  const selectedCategory = categories.find(
    (category) => category.id === selectedTag?.categoryId,
  )

  useEffect(() => {
    setExpandedTagIds((current) => {
      const next = new Set(current)
      let changed = false
      for (const tag of tags) {
        if (tag.parentTagId === null && !next.has(tag.id)) {
          next.add(tag.id)
          changed = true
        }
      }
      return changed ? next : current
    })
  }, [tags])

  const invalidateTaxonomy = () =>
    queryClient.invalidateQueries({ queryKey: taxonomyQueryKey })

  const categoryMutation = useMutation({
    mutationFn: (input: { id?: number; name: string }) =>
      input.id
        ? updateCategory(input.id, input.name, auth.getAccessToken)
        : createCategory(input.name, auth.getAccessToken),
    onSuccess: async () => {
      setEditor(undefined)
      setFeedback(undefined)
      await invalidateTaxonomy()
    },
    onError: (error) => setFeedback(apiErrorMessage(error)),
  })
  const tagMutation = useMutation({
    mutationFn: (input: {
      id?: number
      name: string
      categoryId: number
      parentTagId: number | null
    }) => {
      const payload = {
        name: input.name,
        categoryId: input.categoryId,
        parentTagId: input.parentTagId,
      }
      return input.id
        ? updateTag(input.id, payload, auth.getAccessToken)
        : createTag(payload, auth.getAccessToken)
    },
    onSuccess: async (tag) => {
      setSelectedTagId(tag.id)
      setEditor(undefined)
      setFeedback(undefined)
      await invalidateTaxonomy()
    },
    onError: (error) => setFeedback(apiErrorMessage(error)),
  })
  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: number) =>
      deleteCategory(categoryId, auth.getAccessToken),
    onSuccess: async () => {
      setEditor(undefined)
      setFeedback(undefined)
      await invalidateTaxonomy()
    },
    onError: (error) => setFeedback(apiErrorMessage(error)),
  })
  const deleteTagMutation = useMutation({
    mutationFn: (tagId: number) => deleteTag(tagId, auth.getAccessToken),
    onSuccess: async (_, tagId) => {
      if (selectedTagId === tagId) setSelectedTagId(undefined)
      setFeedback(undefined)
      await invalidateTaxonomy()
    },
    onError: (error) => setFeedback(apiErrorMessage(error)),
  })

  const isMutating =
    categoryMutation.isPending ||
    tagMutation.isPending ||
    deleteCategoryMutation.isPending ||
    deleteTagMutation.isPending

  if (categoriesQuery.isLoading || tagsQuery.isLoading) {
    return <LoadingState label="Carregando taxonomia" />
  }

  if (categoriesQuery.isError || tagsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          title="Não foi possível carregar a taxonomia"
          description="Tente novamente em alguns instantes."
          action={{
            label: 'Tentar novamente',
            onClick: () => {
              void categoriesQuery.refetch()
              void tagsQuery.refetch()
            },
          }}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer size="wide">
      <PageHeader
        eyebrow="Conhecimento comunitário"
        title="Taxonomia de tags"
        description="Explore como as disciplinas são organizadas e encontre cursos relacionados por assunto."
        actions={
          !auth.initialized ? (
            <Button variant="outline" disabled>
              Verificando sessão…
            </Button>
          ) : auth.isAuthenticated ? (
            <div className="flex flex-wrap justify-end gap-2">
              {contributionMode && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => openCategoryEditor('create')}
                  >
                    <FolderPlus /> Nova categoria
                  </Button>
                  <Button
                    onClick={() => openTagEditor('create')}
                    disabled={categories.length === 0}
                  >
                    <Plus /> Nova tag
                  </Button>
                </>
              )}
              <Button
                variant={contributionMode ? 'secondary' : 'default'}
                onClick={toggleContribution}
              >
                <PencilLine />
                {contributionMode ? 'Desativar contribuição' : 'Contribuir'}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => void auth.login(window.location.href)}
            >
              <PencilLine /> Contribuir
            </Button>
          )
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block min-w-0 flex-1 sm:max-w-xl">
          <span className="sr-only">Buscar uma tag</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar uma tag"
            className="h-11 pl-9"
          />
        </label>
        {search && (
          <Button variant="ghost" onClick={() => setSearch('')}>
            <X /> Limpar busca
          </Button>
        )}
      </div>

      {feedback && (
        <div className="mb-6 rounded-md border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          {feedback}
        </div>
      )}

      {categories.length === 0 ? (
        <EmptyState
          title="Taxonomia vazia"
          description="Ainda não há categorias ou tags cadastradas."
          action={
            auth.initialized && auth.isAuthenticated
              ? {
                  label: 'Criar categoria',
                  onClick: () => openCategoryEditor('create'),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-start">
          <section aria-label="Categorias e tags" className="space-y-4">
            {trees.map(({ category, tree }) => (
              <Card
                key={category.id}
                variant="flat"
                className="overflow-hidden"
              >
                <CardHeader className="border-b-2 border-border p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>
                        {countTreeNodes(tree)}{' '}
                        {countTreeNodes(tree) === 1 ? 'tag' : 'tags'}
                      </CardDescription>
                    </div>
                    {auth.initialized &&
                      auth.isAuthenticated &&
                      contributionMode && (
                        <div className="flex shrink-0 gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Criar tag em ${category.name}`}
                            onClick={() =>
                              openTagEditor(
                                'create',
                                undefined,
                                null,
                                category.id,
                              )
                            }
                          >
                            <Plus />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Editar categoria ${category.name}`}
                            onClick={() => openCategoryEditor('edit', category)}
                          >
                            <Edit3 />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Excluir categoria ${category.name}`}
                            onClick={() => confirmDeleteCategory(category)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      )}
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  {tree.length === 0 ? (
                    <p className="px-2 py-3 text-sm text-muted-foreground">
                      Nenhuma tag corresponde à busca.
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {tree.map((node) => (
                        <TagTreeItem
                          key={node.id}
                          node={node}
                          depth={0}
                          selectedTagId={selectedTagId}
                          expandedTagIds={expandedTagIds}
                          authenticated={
                            auth.initialized &&
                            auth.isAuthenticated &&
                            contributionMode
                          }
                          onSelect={setSelectedTagId}
                          onToggle={toggleTag}
                          onCreateChild={(tag) =>
                            openTagEditor(
                              'create',
                              undefined,
                              tag.id,
                              tag.categoryId,
                            )
                          }
                          onEdit={(tag) => openTagEditor('edit', tag)}
                          onDelete={confirmDeleteTag}
                        />
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
            {trees.length === 0 && (
              <EmptyState
                title="Nenhuma tag encontrada"
                description="Tente buscar por outro termo."
              />
            )}
          </section>

          <TagDetails
            tag={selectedTag}
            category={selectedCategory}
            courses={relatedCoursesQuery.data}
            isLoading={relatedCoursesQuery.isLoading}
            isError={relatedCoursesQuery.isError}
            onRetry={() => void relatedCoursesQuery.refetch()}
            authenticated={auth.initialized && auth.isAuthenticated}
            contributionMode={contributionMode}
            onEdit={(tag) => openTagEditor('edit', tag)}
            onCreateChild={() =>
              selectedTagId !== undefined &&
              openTagEditor(
                'create',
                undefined,
                selectedTagId,
                selectedTag?.categoryId,
              )
            }
            onDelete={confirmDeleteTag}
          />
        </div>
      )}

      <TaxonomyEditorDialog
        editor={editor}
        categories={categories}
        tags={tags}
        trees={allTrees.map(({ tree }) => tree)}
        busy={isMutating}
        error={feedback}
        onClose={() => {
          setEditor(undefined)
          setFeedback(undefined)
        }}
        onSaveCategory={(input) => categoryMutation.mutate(input)}
        onSaveTag={(input) => tagMutation.mutate(input)}
      />
    </PageContainer>
  )

  function toggleTag(tagId: number) {
    setExpandedTagIds((current) => {
      const next = new Set(current)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  function toggleContribution() {
    if (!auth.initialized || !auth.isAuthenticated) return
    setContributionMode((current) => !current)
  }

  function openCategoryEditor(mode: 'create' | 'edit', category?: Category) {
    setFeedback(undefined)
    setEditor({ kind: 'category', mode, category })
  }

  function openTagEditor(
    mode: 'create' | 'edit',
    tag?: Tag,
    parentTagId: number | null = null,
    categoryId?: number,
  ) {
    setFeedback(undefined)
    setEditor({ kind: 'tag', mode, tag, parentTagId, categoryId })
  }

  function confirmDeleteCategory(category: Category) {
    if (!window.confirm(`Excluir a categoria “${category.name}”?`)) return
    deleteCategoryMutation.mutate(category.id)
  }

  function confirmDeleteTag(tag: Tag) {
    if (!window.confirm(`Excluir a tag “${tag.name}”?`)) return
    deleteTagMutation.mutate(tag.id)
  }
}

function TagTreeItem({
  node,
  depth,
  selectedTagId,
  expandedTagIds,
  authenticated,
  onSelect,
  onToggle,
  onCreateChild,
  onEdit,
  onDelete,
}: {
  node: TagTreeNode
  depth: number
  selectedTagId?: number
  expandedTagIds: ReadonlySet<number>
  authenticated: boolean
  onSelect: (tagId: number) => void
  onToggle: (tagId: number) => void
  onCreateChild: (tag: Tag) => void
  onEdit: (tag: Tag) => void
  onDelete: (tag: Tag) => void
}) {
  const hasChildren = node.children.length > 0
  const expanded = expandedTagIds.has(node.id)
  return (
    <li>
      <div
        className={cn(
          'group flex min-h-10 items-center gap-1 rounded-md border-2 border-transparent pr-1 hover:bg-accent',
          selectedTagId === node.id && 'border-primary bg-primary/10',
        )}
        style={{ marginLeft: `${depth * 1.25}rem` }}
      >
        <button
          type="button"
          aria-label={
            hasChildren
              ? expanded
                ? `Recolher ${node.name}`
                : `Expandir ${node.name}`
              : undefined
          }
          className="grid size-8 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-background disabled:invisible"
          disabled={!hasChildren}
          onClick={() => onToggle(node.id)}
        >
          {hasChildren && (expanded ? <ChevronDown /> : <ChevronRight />)}
        </button>
        <button
          type="button"
          className="min-w-0 flex-1 py-2 text-left text-sm font-bold"
          onClick={() => onSelect(node.id)}
        >
          <span className="block truncate">{node.name}</span>
        </button>
        {authenticated && (
          <div className="flex shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Criar tag filha de ${node.name}`}
              onClick={() => onCreateChild(node)}
            >
              <Plus />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Editar tag ${node.name}`}
              onClick={() => onEdit(node)}
            >
              <Edit3 />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-destructive"
              aria-label={`Excluir tag ${node.name}`}
              onClick={() => onDelete(node)}
            >
              <Trash2 />
            </Button>
          </div>
        )}
      </div>
      {hasChildren && expanded && (
        <ul className="mt-1 space-y-1">
          {node.children.map((child) => (
            <TagTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedTagId={selectedTagId}
              expandedTagIds={expandedTagIds}
              authenticated={authenticated}
              onSelect={onSelect}
              onToggle={onToggle}
              onCreateChild={onCreateChild}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function TagDetails({
  tag,
  category,
  courses,
  isLoading,
  isError,
  onRetry,
  authenticated,
  contributionMode,
  onEdit,
  onCreateChild,
  onDelete,
}: {
  tag?: Tag
  category?: Category
  courses?: ReadonlyArray<{
    id: number
    code: string
    name: string
    credits: number
  }>
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  authenticated: boolean
  contributionMode: boolean
  onEdit: (tag: Tag) => void
  onCreateChild: () => void
  onDelete: (tag: Tag) => void
}) {
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <div className="mb-2 grid size-11 place-items-center rounded-md bg-primary text-primary-foreground">
          <Tags className="size-5" />
        </div>
        <CardTitle>{tag?.name ?? 'Selecione uma tag'}</CardTitle>
        <CardDescription>
          {tag && category
            ? `${category.name} · cursos relacionados`
            : 'Escolha uma tag na árvore para ver suas disciplinas.'}
        </CardDescription>
        {tag && authenticated && contributionMode && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => onEdit(tag)}>
              <Edit3 /> Editar tag
            </Button>
            <Button variant="outline" onClick={onCreateChild}>
              <Plus /> Nova tag filha
            </Button>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(tag)}
            >
              <Trash2 /> Excluir
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!tag ? (
          <p className="text-sm text-muted-foreground">
            A seleção de uma tag mostra as disciplinas associadas a ela.
          </p>
        ) : isLoading ? (
          <LoadingState label="Carregando disciplinas" />
        ) : isError ? (
          <ErrorState
            title="Não foi possível carregar as disciplinas"
            description="Tente novamente em alguns instantes."
            action={{ label: 'Tentar novamente', onClick: onRetry }}
          />
        ) : !courses || courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma disciplina está associada a esta tag.
          </p>
        ) : (
          <ul className="divide-y-2 divide-border">
            {courses.map((course) => (
              <li key={course.id}>
                <Link
                  to="/disciplinas/$courseId"
                  params={{ courseId: String(course.id) }}
                  search={{}}
                  className="group flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="min-w-0 flex-1 text-sm font-bold group-hover:text-primary">
                    <span className="font-mono text-xs font-black text-primary">
                      {course.code}
                    </span>{' '}
                    <span aria-hidden="true">-</span> {course.name}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                    {course.credits} cr.
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function TaxonomyEditorDialog({
  editor,
  categories,
  tags,
  trees,
  busy,
  error,
  onClose,
  onSaveCategory,
  onSaveTag,
}: {
  editor: EditorState
  categories: ReadonlyArray<Category>
  tags: ReadonlyArray<Tag>
  trees: ReadonlyArray<ReadonlyArray<TagTreeNode>>
  busy: boolean
  error?: string
  onClose: () => void
  onSaveCategory: (input: { id?: number; name: string }) => void
  onSaveTag: (input: {
    id?: number
    name: string
    categoryId: number
    parentTagId: number | null
  }) => void
}) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [parentTagId, setParentTagId] = useState('none')

  useEffect(() => {
    if (!editor) return
    if (editor.kind === 'category') {
      setName(editor.category?.name ?? '')
      setCategoryId('')
      setParentTagId('none')
    } else {
      setName(editor.tag?.name ?? '')
      const initialCategoryId = editor.tag
        ? editor.tag.categoryId
        : (editor.categoryId ?? categories[0]?.id)
      setCategoryId(String(initialCategoryId))
      setParentTagId(
        editor.tag?.parentTagId
          ? String(editor.tag.parentTagId)
          : editor.parentTagId
            ? String(editor.parentTagId)
            : 'none',
      )
    }
  }, [categories, editor])

  const parentOptions = useMemo(() => {
    const id = Number(categoryId)
    const editingTag = editor?.kind === 'tag' ? editor.tag : undefined
    const excluded = editingTag
      ? collectDescendantTagIds(trees.flat(), editingTag.id)
      : new Set<number>()
    return tags
      .filter(
        (tag) =>
          tag.categoryId === id &&
          !excluded.has(tag.id) &&
          tag.id !== editingTag?.id,
      )
      .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'))
  }, [categoryId, editor, tags, trees])

  return (
    <Dialog
      open={editor !== undefined}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editor?.kind === 'category'
              ? editor.mode === 'create'
                ? 'Nova categoria'
                : 'Editar categoria'
              : editor?.mode === 'create'
                ? 'Nova tag'
                : 'Editar tag'}
          </DialogTitle>
          <DialogDescription>
            {editor?.kind === 'category'
              ? 'Categorias agrupam tags relacionadas.'
              : 'Tags organizam disciplinas por assunto e podem ter uma tag pai.'}
          </DialogDescription>
        </DialogHeader>
        {editor && (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              const trimmedName = name.trim()
              if (!trimmedName) return
              if (editor.kind === 'category') {
                onSaveCategory({ id: editor.category?.id, name: trimmedName })
              } else {
                const parsedCategoryId = Number(categoryId)
                if (!parsedCategoryId) return
                onSaveTag({
                  id: editor.tag?.id,
                  name: trimmedName,
                  categoryId: parsedCategoryId,
                  parentTagId:
                    parentTagId === 'none' ? null : Number(parentTagId),
                })
              }
            }}
          >
            <label className="block space-y-2 text-sm font-bold">
              <span>Nome</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoFocus
              />
            </label>
            {editor.kind === 'tag' && (
              <>
                <label className="block space-y-2 text-sm font-bold">
                  <span>Categoria</span>
                  <Select
                    value={categoryId}
                    onValueChange={(value) => {
                      setCategoryId(value)
                      setParentTagId('none')
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <label className="block space-y-2 text-sm font-bold">
                  <span>Tag pai</span>
                  <Select value={parentTagId} onValueChange={setParentTagId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sem tag pai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem tag pai</SelectItem>
                      {parentOptions.map((tag) => (
                        <SelectItem key={tag.id} value={String(tag.id)}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </>
            )}
            {error && (
              <p className="rounded-md border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={busy}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={busy || !name.trim()}>
                {busy ? 'Salvando…' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function countTreeNodes(nodes: ReadonlyArray<TagTreeNode>): number {
  return nodes.reduce(
    (total, node) => total + 1 + countTreeNodes(node.children),
    0,
  )
}

function apiErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Não foi possível salvar a alteração.'
}
