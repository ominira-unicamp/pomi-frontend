import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Input({
  className,
  type,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        'pomi-focus h-10 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
