package com.inventario.dto.response;

import lombok.Builder;

import java.util.List;

/**
 * Envuelve cualquier listado paginado.
 * El tipo genérico {@code T} permite reutilizar en todos los módulos.
 *
 * <p>Estructura de respuesta:
 * <pre>
 * {
 *   "data": [...],
 *   "meta": { "total": 14, "page": 1, "limit": 10, "totalPages": 2 }
 * }
 * </pre>
 * </p>
 */
@Builder
public record PagedResponse<T>(
        List<T> data,
        Meta meta
) {
    @Builder
    public record Meta(
            long total,
            int page,
            int limit,
            int totalPages
    ) {}
}
