export interface Producto {
  id: number
  nombre: string
  categoriaId: number
  categoriaNombre: string
  precio: number
  stock: number
  fechaCreacion: string
}

export interface ProductoRequest {
  nombre: string
  categoriaId: number
  precio: number
  stock: number
}

/** Lógica de negocio: estado visual según el nivel de stock */
export type StockEstado = 'sin-stock' | 'bajo-stock' | 'disponible'

export function getStockEstado(stock: number): StockEstado {
  if (stock === 0) return 'sin-stock'
  if (stock <= 5)  return 'bajo-stock'
  return 'disponible'
}
