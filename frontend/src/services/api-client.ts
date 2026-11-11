import axios from 'axios'

/**
 * Instancia de Axios configurada para comunicarse con el backend.
 *
 * En producción (Docker), el nginx hace proxy de /api → backend:8080,
 * por lo que la baseURL relativa funciona en ambos entornos.
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
