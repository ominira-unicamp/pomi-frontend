import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Field({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-2', className)} {...props} />
}

export function FieldLabel({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn('block text-sm font-bold', className)} {...props} />
  )
}

export function FieldDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-muted-foreground', className)} {...props} />
  )
}

export function FieldError({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { children?: ReactNode }) {
  if (!children) return null
  return (
    <p
      role="alert"
      className={cn('text-sm font-semibold text-destructive', className)}
      {...props}
    >
      {children}
    </p>
  )
}
