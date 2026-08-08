import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps, HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetPortal = DialogPrimitive.Portal

export function SheetOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/65 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  )
}

export function SheetContent({
  className,
  children,
  side = 'left',
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  const position = {
    top: 'inset-x-0 top-0 border-b-2 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
    right:
      'inset-y-0 right-0 h-full w-3/4 border-l-2 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
    bottom:
      'inset-x-0 bottom-0 border-t-2 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r-2 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
  }[side]

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 flex flex-col border-strong-border bg-sidebar text-sidebar-foreground shadow-xl transition data-[state=closed]:duration-200 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in',
          position,
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="pomi-focus absolute top-4 right-4 rounded-sm p-2 text-sidebar-foreground hover:bg-sidebar-accent">
          <X className="size-5" />
          <span className="sr-only">Fechar menu</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

export function SheetHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-2 p-5', className)} {...props} />
}

export function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-extrabold', className)}
      {...props}
    />
  )
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-sidebar-foreground/70', className)}
      {...props}
    />
  )
}
