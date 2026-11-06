import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ExchangeNoticePagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-3"
      aria-label="Paginação dos editais"
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="Página anterior"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft />
      </Button>
      <span className="min-w-24 text-center text-sm font-bold">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        aria-label="Próxima página"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}
