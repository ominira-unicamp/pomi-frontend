import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const sectionVariants = cva('', {
  variants: {
    variant: {
      default: '',
      bordered: 'rounded-lg border-2 border-strong-border bg-card p-4',
      subtle: 'rounded-lg border border-border bg-muted/40 p-4',
    },
  },
  defaultVariants: { variant: 'default' },
})

export function Section({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLElement> & VariantProps<typeof sectionVariants>) {
  return (
    <section
      className={cn(sectionVariants({ variant }), className)}
      {...props}
    />
  )
}

export function SectionHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
      {...props}
    />
  )
}

export function SectionTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-xl font-extrabold', className)} {...props} />
}

export function SectionDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
}

export function SectionContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-w-0', className)} {...props} />
}
