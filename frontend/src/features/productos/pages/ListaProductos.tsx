import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit } from 'lucide-react'
import { StockBadge } from '@/components/ui/StockBadge'
import { LoadingState } from '@/components/ui/LoadingState'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { Paginacion } from '@/components/ui/Paginacion'
import { ProductoService } from '../services/ProductoService'
import { CategoriaService } from '@/features/categorias/services/CategoriaService'
import type { Producto } from '../models/Producto'
import type { Categoria } from '@/features/categorias/models/Categoria'
import type { PagedResponse } from '@/services/api-types'

export function ListaProductos() {
  const [paged, setPaged]       = useState<PagedResponse<Producto> | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  // Filtros
  const [nombre, setNombre]           = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>()
  const [page, setPage]               = useState(1)

  // Cargar categorías para el filtro desplegable
  useEffect(() => {
    CategoriaService.listarTodas()
      .then(setCategorias)
      .catch(() => { /* no bloqueante */ })
  }, [])

  const cargar = useCallback(async (p: number) => {
    setLoading(true)
    setError(null)
    try {
      const resultado = await ProductoService.listar({
        page: p,
        limit: 10,
        nombre: nombre || undefined,
        categoriaId,
      })
      setPaged(resultado)
    } catch {
      setError('No se pudo cargar la lista de productos. Verifique la conexión.')
    } finally {
      setLoading(false)
    }
  }, [nombre, categoriaId])

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setPage(1)
    cargar(1)
  }, [nombre, categoriaId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    cargar(page)
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    cargar(1)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Gestión del inventario de la tienda
          </p>
        </div>
        <Link
          to="/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {/* Filtros */}
      <form
        onSubmit={handleBuscar}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-4 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={categoriaId ?? ''}
          onChange={(e) =>
            setCategoriaId(e.target.value ? Number(e.target.value) : undefined)
          }
          className="rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring sm:w-52"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </form>

      {/* Contenido */}
      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {/* Tabla */}
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['Nombre', 'Categoría', 'Precio', 'Stock', 'Estado', 'Alta', 'Acciones'].map((h) => (
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
                {paged?.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      No se encontraron productos con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  paged?.data.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{p.nombre}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.categoriaNombre}</td>
                      <td className="px-4 py-3">
                        ${Number(p.precio).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3">
                        <StockBadge stock={p.stock} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(p.fechaCreacion).toLocaleDateString('es-GT')}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/productos/editar/${p.id}`}
                          className="inline-flex items-center gap-1 rounded-md border border-input px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                          title="Editar producto"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {paged && paged.meta.totalPages > 1 && (
            <Paginacion
              page={paged.meta.page}
              totalPages={paged.meta.totalPages}
              total={paged.meta.total}
              limit={paged.meta.limit}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
