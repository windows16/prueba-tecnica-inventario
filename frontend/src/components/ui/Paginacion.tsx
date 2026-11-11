import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginacionProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function Paginacion({ page, totalPages, total, limit, onPageChange }: PaginacionProps) {
  const desde = (page - 1) * limit + 1
  const hasta  = Math.min(page * limit, total)

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{desde}–{hasta}</span> de{' '}
        <span className="font-medium">{total}</span> registros
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors',
            page <= 1
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-accent hover:text-accent-foreground',
          )}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors',
              p === page
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors',
            page >= totalPages
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-accent hover:text-accent-foreground',
          )}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
