import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { ErrorAlert } from '@/components/ui/ErrorAlert'
import { CategoriaService } from '../services/CategoriaService'
import type { ErrorResponse } from '@/services/api-types'
import axios from 'axios'

export function CrearCategoria() {
  const navigate = useNavigate()

  const [nombre, setNombre]       = useState('')
  const [fieldError, setFieldError] = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) {
      setFieldError('El nombre de la categoría es obligatorio')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await CategoriaService.crear({ nombre: nombre.trim() })
      navigate('/categorias')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as ErrorResponse | undefined
        setError(data?.message ?? 'Error al crear la categoría.')
      } else {
        setError('Error inesperado. Intente de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/categorias"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nueva Categoría</h1>
        <p className="text-sm text-muted-foreground">
          Agregue una categoría para organizar sus productos
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="nombre" className="text-sm font-medium">
            Nombre <span className="text-destructive">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setFieldError('') }}
            placeholder="Ej. Electrónica"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
          />
          {fieldError && (
            <p className="text-xs text-destructive">{fieldError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {submitting ? 'Guardando...' : 'Guardar Categoría'}
        </button>
      </form>
    </div>
  )
}
