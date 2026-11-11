package com.inventario.dto.response;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * DTO de salida para un producto.
 * Incluye {@code categoriaNombre} para evitar que el frontend
 * tenga que hacer una segunda petición solo para mostrar el nombre.
 */
@Builder
public record ProductoResponse(
        Integer id,
        String nombre,
        Integer categoriaId,
        String categoriaNombre,
        BigDecimal precio,
        Integer stock,
        OffsetDateTime fechaCreacion
) {}
