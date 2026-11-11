package com.inventario.dto.response;

import lombok.Builder;

/**
 * DTO de salida para una categoría.
 * Incluye {@code totalProductos} para que la UI pueda
 * mostrar cuántos productos tiene y decidir si permite borrarla.
 */
@Builder
public record CategoriaResponse(
        Integer id,
        String nombre,
        long totalProductos
) {}
