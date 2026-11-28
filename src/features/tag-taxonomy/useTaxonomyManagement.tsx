import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlocker } from '@tanstack/react-router'

import { isApiError } from '@ominira/pomi-sdk'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { EditorState } from '@/features/tag-taxonomy/TaxonomyEditor'
import type { Category, Tag, TagInput } from '@/features/tag-taxonomy/data/tagTaxonomyApi'
import type { TaxonomyManageSearch } from '@/features/tag-taxonomy/data/tagTaxonomyNavigation'
import { createCategory, createTag, deleteCategory, deleteTag, getCategory, getTag, listCategories, listTags, updateCategory, updateTag } from '@/features/tag-taxonomy/data/tagTaxonomyApi'
import { buildTagTree, filterTagTree } from '@/features/tag-taxonomy/data/tagTaxonomyTree'
import { normalizeTagSearch } from '@/features/tag-taxonomy/data/tagTaxonomyNavigation'
import { invalidateTagConsumers, taxonomyKeys } from '@/features/tag-taxonomy/data/tagTaxonomyQueries'
import { useOptionalAuth } from '@/auth/AuthProvider'

import { useConfirmation } from '@/components/patterns/useConfirmation'

import { taxonomyErrorMessage } from '@/features/tag-taxonomy/taxonomyErrorMessage'

export function useTaxonomyManagement({
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
  return {
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
  }
}
