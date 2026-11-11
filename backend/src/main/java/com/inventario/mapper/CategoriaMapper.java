package com.inventario.mapper;

import com.inventario.dto.response.CategoriaResponse;
import com.inventario.model.Categoria;

/**
 * Mapper estático para conversión entre {@link Categoria} y sus DTOs.
 */
public final class CategoriaMapper {

    private CategoriaMapper() { /* utility class */ }

    /**
     * Convierte una entidad Categoria a su DTO de respuesta.
     * {@code totalProductos} se obtiene del tamaño de la colección lazy
     * (ya cargada en el contexto del servicio via countByCategoriaId).
     */
    public static CategoriaResponse toResponse(Categoria categoria, long totalProductos) {
        return CategoriaResponse.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .totalProductos(totalProductos)
                .build();
    }
}
