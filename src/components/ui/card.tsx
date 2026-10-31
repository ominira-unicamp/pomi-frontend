import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-lg border-2 border-strong-border bg-card text-card-foreground',
  {
    variants: {
      variant: {
        default:
          'shadow-[5px_5px_0_color-mix(in_srgb,var(--primary)_28%,transparent)]',
        highlighted:
          'border-primary shadow-[5px_5px_0_color-mix(in_srgb,var(--primary)_42%,transparent)]',
        flat: 'shadow-none',
        interactive:
          'pomi-focus transition-[border-color,transform,box-shadow] hover:-translate-x-px hover:-translate-y-px hover:border-primary hover:shadow-[7px_7px_0_color-mix(in_srgb,var(--primary)_32%,transparent)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
  )
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-xl font-extrabold', className)} {...props} />
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}
