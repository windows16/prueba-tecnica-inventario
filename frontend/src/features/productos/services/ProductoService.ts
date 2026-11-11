import apiClient from '@/services/api-client'
import type { PagedResponse } from '@/services/api-types'
import type { Producto, ProductoRequest } from '../models/Producto'

const BASE = '/productos'

export interface ProductoFiltros {
  page?: number
  limit?: number
  nombre?: string
  categoriaId?: number
}

export const ProductoService = {
  listar: async (filtros: ProductoFiltros = {}): Promise<PagedResponse<Producto>> => {
    const { data } = await apiClient.get<PagedResponse<Producto>>(BASE, {
      params: {
        page: filtros.page ?? 1,
        limit: filtros.limit ?? 10,
        nombre: filtros.nombre || undefined,
        categoriaId: filtros.categoriaId || undefined,
      },
    })
    return data
  },

  crear: async (request: ProductoRequest): Promise<Producto> => {
    const { data } = await apiClient.post<Producto>(BASE, request)
    return data
  },

  obtenerPorId: async (id: number): Promise<Producto> => {
    const { data } = await apiClient.get<Producto>(`${BASE}/${id}`)
    return data
  },

  actualizar: async (id: number, request: ProductoRequest): Promise<Producto> => {
    const { data } = await apiClient.put<Producto>(`${BASE}/${id}`, request)
    return data
  },
}
