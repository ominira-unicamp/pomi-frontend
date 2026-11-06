import { useEffect, useId, useMemo, useState } from 'react'
import { Circle, Plus, Trash2 } from 'lucide-react'
import { collectDescendantTagIds } from './data/tagTaxonomyTree'
import { tagPath } from './data/tagTaxonomyNavigation'
import type { Category, Tag } from './data/tagTaxonomyApi'
import type { TagTreeNode } from './data/tagTaxonomyTree'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ActionBar } from '@/components/patterns/ActionBar'
import { Badge } from '@/components/patterns/Badge'
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/components/patterns/Field'
import { InlineMessage } from '@/components/patterns/InlineMessage'
import { ResponsiveDialog } from '@/components/patterns/ResponsiveDialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type EditorState =
  | { kind: 'category'; mode: 'create' | 'edit'; category?: Category }
  | {
      kind: 'tag'
      mode: 'create' | 'edit'
      tag?: Tag
      categoryId?: number
      parentTagId?: number | null
    }
  | undefined

export function TaxonomyEditor({
  editor,
  categories,
  tags,
  trees,
  busy,
  error,
  onClose,
  onSaveCategory,
  onSaveTag,
  onDirtyChange,
  onDelete,
  onCreateChild,
  confirmDiscard,
}: {
  confirmDiscard: () => Promise<boolean>
  onDirtyChange: (changed: boolean) => void
  onDelete: () => void
  onCreateChild: () => void
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
  const formId = useId()
  const initialName =
    editor?.kind === 'tag'
      ? (editor.tag?.name ?? '')
      : (editor?.category?.name ?? '')
  const initialCategory =
    editor?.kind === 'tag'
      ? String(editor.tag?.categoryId ?? editor.categoryId ?? categories[0]?.id)
      : ''
  const initialParent =
    editor?.kind === 'tag'
      ? String(editor.tag?.parentTagId ?? editor.parentTagId ?? 'none')
      : 'none'
  const [name, setName] = useState(initialName)
  const [categoryId, setCategoryId] = useState(initialCategory)
  const [parentTagId, setParentTagId] = useState(initialParent)
  const structureChanged =
    categoryId !== initialCategory || parentTagId !== initialParent
  const selectedParent = tags.find((item) => item.id === Number(parentTagId))
  const changed =
    name !== initialName ||
    categoryId !== initialCategory ||
    parentTagId !== initialParent
  useEffect(() => {
    onDirtyChange(changed)
    return () => onDirtyChange(false)
  }, [changed, onDirtyChange])
  const close = async () => {
    if (!changed || (await confirmDiscard())) onClose()
  }
  const categoryLocked =
    editor?.kind === 'tag' &&
    Boolean(
      editor.tag && tags.some((tag) => tag.parentTagId === editor.tag!.id),
    )
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

  const title =
    editor?.kind === 'category'
      ? editor.mode === 'create'
        ? 'Nova categoria'
        : 'Editar categoria'
      : editor?.mode === 'create'
        ? 'Nova tag'
        : 'Editar tag'
  if (!editor)
    return (
      <Card variant="flat">
        <CardHeader>
          <CardTitle>Edição da estrutura</CardTitle>
          <CardDescription>
            Selecione uma tag ou categoria para editar.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  const content = (
    <>
      {editor.mode === 'edit' && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              {title}
            </p>
            <h2 className="mt-1 break-words text-2xl font-black tracking-tight">
              {name.trim() || initialName}
            </h2>
          </div>
          {changed && (
            <Badge role="status" variant="secondary" className="gap-2">
              <Circle className="size-2 fill-current" aria-hidden="true" />
              Alterações não salvas
            </Badge>
          )}
        </div>
      )}
      <p className="mb-5 text-sm text-muted-foreground">
        Alterações neste vocabulário são compartilhadas por toda a comunidade.
      </p>
      {editor.kind === 'category' && editor.category && (
        <p className="mb-3 text-sm text-muted-foreground">
          Esta categoria contém{' '}
          {tags.filter((tag) => tag.categoryId === editor.category?.id).length}{' '}
          tags.
        </p>
      )}
      <form
        id={formId}
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (editor.mode === 'edit' && !changed) return
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
              parentTagId: parentTagId === 'none' ? null : Number(parentTagId),
            })
          }
        }}
      >
        <fieldset disabled={busy} className="space-y-4">
          <Field>
            <FieldLabel htmlFor={`${formId}-name`}>
              Nome
              <span className="text-primary" aria-hidden="true">
                {' '}
                *
              </span>
            </FieldLabel>
            <Input
              aria-describedby={`${formId}-naming-help`}
              id={`${formId}-name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="h-11"
              autoFocus={editor.mode === 'create'}
            />
          </Field>
          {editor.kind === 'tag' && (
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`${formId}-category`}>
                  Categoria{' '}
                  <span className="text-primary" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <Select
                  disabled={categoryLocked}
                  value={categoryId}
                  onValueChange={(value) => {
                    setCategoryId(value)
                    setParentTagId('none')
                  }}
                >
                  <SelectTrigger
                    id={`${formId}-category`}
                    aria-describedby={
                      categoryLocked ? `${formId}-category-help` : undefined
                    }
                    className="min-h-11"
                  >
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categoryLocked && (
                  <FieldDescription id={`${formId}-category-help`}>
                    Mova as subtags antes de mudar a categoria.
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor={`${formId}-parent`}>Tag pai</FieldLabel>
                <Select value={parentTagId} onValueChange={setParentTagId}>
                  <SelectTrigger id={`${formId}-parent`} className="min-h-11">
                    <SelectValue placeholder="Sem tag pai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem tag pai</SelectItem>
                    {parentOptions.map((tag) => (
                      <SelectItem key={tag.id} value={String(tag.id)}>
                        {tagPath(tag, tags)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}
          {editor.kind === 'tag' && (
            <p className="text-sm text-muted-foreground">
              {editor.mode === 'edit' && structureChanged
                ? 'Novo caminho:'
                : 'Caminho:'}{' '}
              {categories.find((item) => item.id === Number(categoryId))?.name}{' '}
              › {selectedParent && `${tagPath(selectedParent, tags)} › `}
              {name || 'Nova tag'}
            </p>
          )}
          {error && <InlineMessage variant="error">{error}</InlineMessage>}
          {editor.kind === 'tag' && editor.tag && structureChanged && (
            <p className="text-sm text-muted-foreground">
              Caminho atual:{' '}
              {
                categories.find(
                  (category) => category.id === editor.tag?.categoryId,
                )?.name
              }{' '}
              › {tagPath(editor.tag, tags)}
            </p>
          )}
          <FieldDescription id={`${formId}-naming-help`}>
            Nomes de tags devem ser únicos em toda a categoria, inclusive em
            ramos diferentes.
          </FieldDescription>
        </fieldset>
      </form>
      <ActionBar
        align="between"
        className="mt-6 gap-4 border-t-2 border-border pt-5"
      >
        <div className="flex flex-wrap items-center gap-2">
          {editor.mode === 'edit' && (
            <>
              {editor.kind === 'tag' && (
                <Button
                  variant="outline"
                  disabled={busy || changed}
                  onClick={onCreateChild}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Nova tag filha
                </Button>
              )}
              <Button
                variant="ghost"
                className="text-destructive"
                disabled={busy || changed}
                onClick={onDelete}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Excluir {editor.kind === 'tag' ? 'tag' : 'categoria'}
              </Button>
            </>
          )}
        </div>
        <ActionBar className="ml-auto gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={busy}
          >
            Cancelar
          </Button>
          <Button
            form={formId}
            type="submit"
            disabled={
              busy ||
              !name.trim() ||
              (editor.mode === 'edit' && !changed) ||
              (editor.kind === 'tag' &&
                !categories.some(
                  (category) => category.id === Number(categoryId),
                ))
            }
          >
            {busy ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </ActionBar>
      </ActionBar>
    </>
  )
  return editor.mode === 'create' ? (
    <ResponsiveDialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) void close()
      }}
      title={title}
      description="Crie um termo para a comunidade."
    >
      {content}
    </ResponsiveDialog>
  ) : (
    <Card variant="flat">
      <CardContent className="p-5 sm:p-6">{content}</CardContent>
    </Card>
  )
}
