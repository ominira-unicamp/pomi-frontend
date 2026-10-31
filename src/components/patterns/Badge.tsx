import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex min-h-6 items-center rounded-full border px-2 py-0.5 text-xs font-bold',
  {
    variants: {
      variant: {
        default: 'border-primary bg-primary text-primary-foreground',
        secondary:
          'border-strong-border/30 bg-secondary text-secondary-foreground',
        success:
          'border-green-700 bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-100',
        warning:
          'border-amber-700 bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100',
        destructive:
          'border-destructive bg-destructive text-destructive-foreground',
        outline: 'border-strong-border bg-background text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
