package com.inventario.service;

import com.inventario.dto.request.CategoriaRequest;
import com.inventario.dto.response.CategoriaResponse;

import java.util.List;

public interface CategoriaService {

    List<CategoriaResponse> listarTodas();

    CategoriaResponse crear(CategoriaRequest request);

    /**
     * Elimina una categoría.
     *
     * @throws com.inventario.exception.ResourceNotFoundException si no existe.
     * @throws com.inventario.exception.BusinessRuleException     si tiene productos asociados.
     */
    void eliminar(Integer id);
}
