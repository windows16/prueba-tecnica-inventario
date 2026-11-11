import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { LoadingState } from '@/components/ui/LoadingState'
import { ProductoService } from '../services/ProductoService'
import { CategoriaService } from '@/features/categorias/services/CategoriaService'
import type { Categoria } from '@/features/categorias/models/Categoria'
import type { ProductoRequest } from '../models/Producto'
import type { ErrorResponse } from '@/services/api-types'
import axios from 'axios'

interface FormState {
  nombre: string
  categoriaId: string
  precio: string
  stock: string
}

export function EditarProducto() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>({
    nombre: '',
    categoriaId: '',
    precio: '',
    stock: '',
  })
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<FormState>>({})

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true)
      setError(null)
      try {
        const [cats, prod] = await Promise.all([
          CategoriaService.listarTodas(),
          ProductoService.obtenerPorId(Number(id)),
        ])
        setCategorias(cats)
        setForm({
          nombre: prod.nombre,
          categoriaId: String(prod.categoriaId),
          precio: String(prod.precio),
          stock: String(prod.stock),
        })
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as ErrorResponse | undefined
          setError(data?.message ?? 'No se pudo cargar el producto solicitado.')
        } else {
          setError('Error al cargar la información del producto.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      cargarDatos()
    }
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = (): boolean => {
    const errors: Partial<FormState> = {}

    if (!form.nombre.trim())
      errors.nombre = 'El nombre es obligatorio'

    if (!form.categoriaId)
      errors.categoriaId = 'Seleccione una categoría'

    const precio = parseFloat(form.precio)
    if (!form.precio || isNaN(precio) || precio <= 0)
      errors.precio = 'El precio debe ser mayor a 0'

    const stock = parseInt(form.stock, 10)
    if (form.stock === '' || isNaN(stock) || stock < 0)
      errors.stock = 'El stock no puede ser negativo'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setError(null)

    const request: ProductoRequest = {
      nombre: form.nombre.trim(),
      categoriaId: Number(form.categoriaId),
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock, 10),
    }

    try {
      await ProductoService.actualizar(Number(id), request)
      navigate('/productos')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as ErrorResponse | undefined
        setError(data?.message ?? 'Error al actualizar el producto.')
      } else {
        setError('Error inesperado. Intente de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingState message="Cargando información del producto..." />
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <Link
          to="/productos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar Producto</h1>
        <p className="text-sm text-muted-foreground">
          Modifique los datos del producto y guarde los cambios
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Formulario */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Nombre */}
        <div className="space-y-1.5">
          <label htmlFor="nombre" className="text-sm font-medium">
            Nombre <span className="text-destructive">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Audífonos Bluetooth"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          />
          {fieldErrors.nombre && (
            <p className="text-xs text-destructive">{fieldErrors.nombre}</p>
          )}
        </div>

        {/* Categoría */}
        <div className="space-y-1.5">
          <label htmlFor="categoriaId" className="text-sm font-medium">
            Categoría <span className="text-destructive">*</span>
          </label>
          <select
            id="categoriaId"
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          >
            <option value="">— Seleccione una categoría —</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {fieldErrors.categoriaId && (
            <p className="text-xs text-destructive">{fieldErrors.categoriaId}</p>
          )}
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Precio */}
          <div className="space-y-1.5">
            <label htmlFor="precio" className="text-sm font-medium">
              Precio <span className="text-destructive">*</span>
            </label>
            <input
              id="precio"
              name="precio"
              type="number"
              min="0.01"
              step="0.01"
              value={form.precio}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
            />
            {fieldErrors.precio && (
              <p className="text-xs text-destructive">{fieldErrors.precio}</p>
            )}
          </div>

          {/* Stock */}
          <div className="space-y-1.5">
            <label htmlFor="stock" className="text-sm font-medium">
              Stock (unidades) <span className="text-destructive">*</span>
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
            />
            {fieldErrors.stock && (
              <p className="text-xs text-destructive">{fieldErrors.stock}</p>
            )}
          </div>
        </div>

        {/* Botón de acción */}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {submitting ? 'Actualizando...' : 'Actualizar Producto'}
        </button>
      </form>
    </div>
  )
}
