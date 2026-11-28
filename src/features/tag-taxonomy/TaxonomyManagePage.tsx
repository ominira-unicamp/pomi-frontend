import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronRight, Layers3, Plus, Search } from 'lucide-react'
import { useTaxonomyManagement } from './useTaxonomyManagement'

import type { TaxonomyManageSearch } from '@/features/tag-taxonomy/data/tagTaxonomyNavigation'
import { formatTagCount } from '@/features/tag-taxonomy/TaxonomyPresentation'
import { TaxonomyEditor } from '@/features/tag-taxonomy/TaxonomyEditor'

import { normalizeTagSearch } from '@/features/tag-taxonomy/data/tagTaxonomyNavigation'

import { EmptyState, ErrorState, LoadingState, PageContainer, PageHeader } from '@/components/PageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/patterns/Field'
import { InlineMessage } from '@/components/patterns/InlineMessage'

import { cn } from '@/lib/utils'

import { ManagementTree } from '@/features/tag-taxonomy/ManagementTree'

export function TaxonomyManagePage({
  tagId,
  search: incoming,
  onSearchChange,
}: {
  tagId?: number
  search?: TaxonomyManageSearch
  onSearchChange?: (search: TaxonomyManageSearch) => void | Promise<void>
}) {
  const {
    confirm,
    confirmationDialog,
    confirmDiscard,
    auth,
    search,
    editor,
    revision,
    feedback,
    success,
    accessDenied,
    collapsed,
    setCollapsed,
    structure,
    categoryQuery,
    tagQuery,
    categories,
    tags,
    allTrees,
    trees,
    editorKey,
    navigate,
    canLeave,
    setClean,
    selectEditor,
    closeEditor,
    categoryMutation,
    tagMutation,
    deletion,
    busy,
    removed,
    changedElsewhere,
  } = useTaxonomyManagement({ tagId, search: incoming, onSearchChange })
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
                  if (!editor) return
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
