import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { ListaProductos } from '@/features/productos/pages/ListaProductos'
import { CrearProducto } from '@/features/productos/pages/CrearProducto'
import { ListaCategorias } from '@/features/categorias/pages/ListaCategorias'
import { CrearCategoria } from '@/features/categorias/pages/CrearCategoria'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Redirige raíz a /productos */}
          <Route index element={<Navigate to="/productos" replace />} />

          {/* Productos */}
          <Route path="/productos"       element={<ListaProductos />} />
          <Route path="/productos/nuevo" element={<CrearProducto />} />

          {/* Categorías */}
          <Route path="/categorias"       element={<ListaCategorias />} />
          <Route path="/categorias/nueva" element={<CrearCategoria />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/productos" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
