import { cloneElement } from 'react'
import type { ReactElement } from 'react'

export function ActionTooltip({
  content,
  children,
}: {
  content: string
  children: ReactElement<{ title?: string }>
}) {
  return cloneElement(children, { title: content })
}
