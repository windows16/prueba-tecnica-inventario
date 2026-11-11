package com.inventario.mapper;

import com.inventario.dto.request.ProductoRequest;
import com.inventario.dto.response.ProductoResponse;
import com.inventario.model.Categoria;
import com.inventario.model.Producto;

/**
 * Mapper estático para conversión entre {@link Producto} y sus DTOs.
 *
 * <p>Se usa clase utilitaria con constructor privado (patrón utility class)
 * en lugar de un framework como MapStruct para mantener la solución
 * autocontenida y legible sin dependencias adicionales.</p>
 */
public final class ProductoMapper {

    private ProductoMapper() { /* utility class */ }

    /**
     * Convierte una entidad Producto a su DTO de respuesta.
     * Accede a {@code categoria.getNombre()} para aplanar la relación
     * en un único objeto sin anidación.
     */
    public static ProductoResponse toResponse(Producto producto) {
        return ProductoResponse.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .categoriaId(producto.getCategoria().getId())
                .categoriaNombre(producto.getCategoria().getNombre())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .fechaCreacion(producto.getFechaCreacion())
                .build();
    }

    /**
     * Convierte un DTO de petición a entidad Producto.
     * El {@code trim()} elimina espacios accidentales en el nombre.
     */
    public static Producto toEntity(ProductoRequest request, Categoria categoria) {
        return Producto.builder()
                .nombre(request.nombre().trim())
                .categoria(categoria)
                .precio(request.precio())
                .stock(request.stock())
                .build();
    }
}
