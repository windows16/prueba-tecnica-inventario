package com.inventario.service;

import com.inventario.dto.request.ProductoRequest;
import com.inventario.dto.response.PagedResponse;
import com.inventario.dto.response.ProductoResponse;

public interface ProductoService {

    /**
     * Lista productos con paginación y filtros opcionales.
     *
     * @param page        número de página (1-based)
     * @param limit       elementos por página
     * @param nombre      filtro parcial por nombre (opcional)
     * @param categoriaId filtro exacto por categoría (opcional)
     */
    PagedResponse<ProductoResponse> listar(int page, int limit, String nombre, Integer categoriaId);

    ProductoResponse crear(ProductoRequest request);
}
