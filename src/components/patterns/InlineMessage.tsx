import { cva } from 'class-variance-authority'
import { AlertCircle, CheckCircle2, CircleAlert, Info } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const inlineMessageVariants = cva(
  'flex items-start gap-2 rounded-md border px-3 py-2 text-sm font-semibold [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        info: 'border-border bg-muted text-foreground',
        success:
          'border-green-700/50 bg-green-100 text-green-950 dark:bg-green-950 dark:text-green-100',
        warning:
          'border-amber-700/50 bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100',
        error: 'border-destructive/60 bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: { variant: 'info' },
  },
)

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: CircleAlert,
  error: AlertCircle,
}

export function InlineMessage({
  className,
  variant = 'info',
  children,
  role,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inlineMessageVariants>) {
  const Icon = icons[variant ?? 'info']
  return (
    <div
      role={
        role ??
        (variant === 'error'
          ? 'alert'
          : variant === 'success'
            ? 'status'
            : undefined)
      }
      className={cn(inlineMessageVariants({ variant }), className)}
      {...props}
    >
      <Icon />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
