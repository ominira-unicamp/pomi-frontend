import { ChevronDown, ChevronRight, Plus, Tag as TagIcon } from 'lucide-react'
import type { Tag } from '@/features/tag-taxonomy/data/tagTaxonomyApi'
import type { TagTreeNode } from '@/features/tag-taxonomy/data/tagTaxonomyTree'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ManagementTree({
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
