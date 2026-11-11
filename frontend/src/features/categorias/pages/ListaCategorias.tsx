import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { CategoriaService } from '../services/CategoriaService'
import type { Categoria } from '../models/Categoria'
import type { ErrorResponse } from '@/services/api-types'
import axios from 'axios'

export function ListaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await CategoriaService.listarTodas()
      setCategorias(data)
    } catch {
      setError('No se pudo cargar la lista de categorías.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const handleEliminar = async (categoria: Categoria) => {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return

    setDeletingId(categoria.id)
    setError(null)
    try {
      await CategoriaService.eliminar(categoria.id)
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id))
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as ErrorResponse | undefined
        setError(data?.message ?? 'Error al eliminar la categoría.')
      } else {
        setError('Error inesperado. Intente de nuevo.')
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>
          <p className="text-sm text-muted-foreground">
            Administra las categorías del inventario
          </p>
        </div>
        <Link
          to="/categorias/nueva"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingState />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {['#', 'Nombre', 'Productos', 'Acción'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-medium text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No hay categorías registradas.
                  </td>
                </tr>
              ) : (
                categorias.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{c.id}</td>
                    <td className="px-4 py-3 font-medium">{c.nombre}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-muted px-2 text-xs font-medium">
                        {c.totalProductos}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEliminar(c)}
                        disabled={deletingId === c.id || c.totalProductos > 0}
                        title={
                          c.totalProductos > 0
                            ? `No se puede eliminar: tiene ${c.totalProductos} producto(s)`
                            : 'Eliminar categoría'
                        }
                        className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingId === c.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
