package com.inventario.service.impl;

import com.inventario.dto.request.CategoriaRequest;
import com.inventario.dto.response.CategoriaResponse;
import com.inventario.exception.BusinessRuleException;
import com.inventario.exception.ResourceNotFoundException;
import com.inventario.mapper.CategoriaMapper;
import com.inventario.model.Categoria;
import com.inventario.repository.CategoriaRepository;
import com.inventario.repository.ProductoRepository;
import com.inventario.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementación de {@link CategoriaService}.
 *
 * <p>{@code @Transactional} a nivel de clase aplica por defecto a todos
 * los métodos. Los métodos de solo lectura sobreescriben con
 * {@code readOnly = true} para optimizar el contexto de Hibernate.</p>
 */
@Service
@Transactional
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(c -> {
                    long total = productoRepository.countByCategoriaId(c.getId());
                    return CategoriaMapper.toResponse(c, total);
                })
                .toList();
    }

    @Override
    public CategoriaResponse crear(CategoriaRequest request) {
        String nombre = request.nombre().trim();

        if (categoriaRepository.existsByNombreIgnoreCase(nombre)) {
            throw new BusinessRuleException(
                    "Ya existe una categoría con el nombre: \"" + nombre + "\"");
        }

        Categoria nueva = Categoria.builder()
                .nombre(nombre)
                .build();

        Categoria guardada = categoriaRepository.save(nueva);
        return CategoriaMapper.toResponse(guardada, 0L);
    }

    @Override
    public void eliminar(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoría no encontrada con id: " + id));

        long totalProductos = productoRepository.countByCategoriaId(id);
        if (totalProductos > 0) {
            throw new BusinessRuleException(
                    "No se puede eliminar la categoría \"" + categoria.getNombre()
                    + "\" porque tiene " + totalProductos + " producto(s) asociado(s). "
                    + "Reasigne o elimine los productos primero.");
        }

        categoriaRepository.delete(categoria);
    }
}
