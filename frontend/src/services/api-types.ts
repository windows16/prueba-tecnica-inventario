/** Respuesta paginada estándar del backend */
export interface PagedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

/** Estructura de error estándar del backend */
export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
