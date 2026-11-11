import apiClient from '@/services/api-client'
import type { Categoria, CategoriaRequest } from '../models/Categoria'

const BASE = '/categorias'

export const CategoriaService = {
  listarTodas: async (): Promise<Categoria[]> => {
    const { data } = await apiClient.get<Categoria[]>(BASE)
    return data
  },

  crear: async (request: CategoriaRequest): Promise<Categoria> => {
    const { data } = await apiClient.post<Categoria>(BASE, request)
    return data
  },

  eliminar: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE}/${id}`)
  },
}
