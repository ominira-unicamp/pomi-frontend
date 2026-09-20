import type { ComponentProps, ReactElement, ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useDesktopLayout } from '@/hooks/useDesktopLayout'
import { cn } from '@/lib/utils'

type ResponsiveDialogProps = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  trigger?: ReactElement
  dialogContentClassName?: string
  sheetContentClassName?: string
  bodyClassName?: string
  onOpenAutoFocus?: ComponentProps<typeof DialogContent>['onOpenAutoFocus']
}>

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  dialogContentClassName,
  sheetContentClassName,
  bodyClassName,
  onOpenAutoFocus,
}: ResponsiveDialogProps) {
  const desktop = useDesktopLayout()

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent
          className={dialogContentClassName}
          onOpenAutoFocus={onOpenAutoFocus}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className={bodyClassName}>{children}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        side="bottom"
        closeButtonLabel="Fechar"
        closeButtonClassName="text-card-foreground hover:bg-accent"
        className={cn(
          'max-h-[90dvh] overflow-hidden rounded-t-xl bg-card text-card-foreground',
          sheetContentClassName,
        )}
        onOpenAutoFocus={onOpenAutoFocus}
      >
        <SheetHeader className="border-b-2 border-strong-border pr-12">
          <SheetTitle>{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-muted-foreground">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div
          className={cn(
            'pomi-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]',
            bodyClassName,
          )}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
