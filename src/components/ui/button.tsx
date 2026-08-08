import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'pomi-focus inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border-2 border-transparent text-sm font-bold transition-[background-color,color,border-color,transform,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border-primary bg-primary text-primary-foreground shadow-[3px_3px_0_var(--strong-border)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--strong-border)]',
        secondary:
          'border-strong-border bg-secondary text-secondary-foreground hover:bg-accent',
        outline:
          'border-strong-border bg-background text-foreground hover:bg-secondary',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        destructive:
          'border-destructive bg-destructive text-destructive-foreground hover:opacity-90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export function Button({
  className,
  variant,
  size,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
