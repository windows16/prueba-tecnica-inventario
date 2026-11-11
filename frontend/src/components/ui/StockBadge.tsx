import { cn } from '@/lib/utils'
import { type StockEstado } from '@/features/productos/models/Producto'

interface StockBadgeProps {
  stock: number
}

const config: Record<StockEstado, { label: string; className: string }> = {
  'sin-stock':   { label: 'Sin stock',   className: 'bg-red-100 text-red-700 border-red-200' },
  'bajo-stock':  { label: 'Bajo stock',  className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'disponible':  { label: 'Disponible',  className: 'bg-green-100 text-green-700 border-green-200' },
}

function getEstado(stock: number): StockEstado {
  if (stock === 0) return 'sin-stock'
  if (stock <= 5)  return 'bajo-stock'
  return 'disponible'
}

/**
 * Badge visual que representa el estado del stock de un producto.
 * Regla de negocio: stock = 0 → rojo, stock ≤ 5 → amarillo, stock > 5 → verde.
 */
export function StockBadge({ stock }: StockBadgeProps) {
  const estado = getEstado(stock)
  const { label, className } = config[estado]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {label}
    </span>
  )
}
