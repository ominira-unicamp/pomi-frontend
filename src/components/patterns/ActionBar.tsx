import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const actionBarVariants = cva('flex flex-wrap items-center gap-2', {
  variants: {
    align: {
      start: 'justify-start',
      end: 'justify-end',
      between: 'justify-between',
    },
  },
  defaultVariants: { align: 'end' },
})

export function ActionBar({
  className,
  align,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof actionBarVariants>) {
  return (
    <div className={cn(actionBarVariants({ align }), className)} {...props} />
  )
}
