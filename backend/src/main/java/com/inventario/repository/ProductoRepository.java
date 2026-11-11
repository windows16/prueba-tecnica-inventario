package com.inventario.repository;

import com.inventario.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    /** Conteo de productos por categoría — usado para validar el borrado. */
    long countByCategoriaId(Integer categoriaId);

    // ── Consultas para los filtros de listado ──────────────────────────────

    Page<Producto> findByNombreContainingIgnoreCase(
            String nombre, Pageable pageable);

    Page<Producto> findByCategoriaId(
            Integer categoriaId, Pageable pageable);

    Page<Producto> findByNombreContainingIgnoreCaseAndCategoriaId(
            String nombre, Integer categoriaId, Pageable pageable);
}
