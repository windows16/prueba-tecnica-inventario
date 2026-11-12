package com.inventario.service.impl;

import com.inventario.dto.request.ProductoRequest;
import com.inventario.dto.response.PagedResponse;
import com.inventario.dto.response.ProductoResponse;
import com.inventario.exception.ResourceNotFoundException;
import com.inventario.mapper.ProductoMapper;
import com.inventario.model.Categoria;
import com.inventario.model.Producto;
import com.inventario.repository.CategoriaRepository;
import com.inventario.repository.ProductoRepository;
import com.inventario.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementación de {@link ProductoService}.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProductoResponse> listar(int page, int limit,
                                                   String nombre, Integer categoriaId) {
        // Spring Pageable usa índice 0-based; la API expone 1-based
        Pageable pageable = PageRequest.of(
                page - 1, limit,
                Sort.by("fechaCreacion").descending());

        boolean tieneNombre    = nombre      != null && !nombre.isBlank();
        boolean tieneCategoria = categoriaId != null;

        Page<Producto> resultado;

        if (tieneNombre && tieneCategoria) {
            resultado = productoRepository
                    .findByNombreContainingIgnoreCaseAndCategoriaId(nombre, categoriaId, pageable);
        } else if (tieneNombre) {
            resultado = productoRepository
                    .findByNombreContainingIgnoreCase(nombre, pageable);
        } else if (tieneCategoria) {
            resultado = productoRepository
                    .findByCategoriaId(categoriaId, pageable);
        } else {
            resultado = productoRepository.findAll(pageable);
        }

        List<ProductoResponse> data = resultado.getContent()
                .stream()
                .map(ProductoMapper::toResponse)
                .toList();

        return PagedResponse.<ProductoResponse>builder()
                .data(data)
                .meta(PagedResponse.Meta.builder()
                        .total(resultado.getTotalElements())
                        .page(page)
                        .limit(limit)
                        .totalPages(resultado.getTotalPages())
                        .build())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoResponse obtenerPorId(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Producto no encontrado con id: " + id));
        return ProductoMapper.toResponse(producto);
    }

    @Override
    public ProductoResponse crear(ProductoRequest request) {
        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoría no encontrada con id: " + request.categoriaId()));

        if (request.precio() != null && request.precio().compareTo(new java.math.BigDecimal("1000000")) > 0) {
            throw new com.inventario.exception.BusinessRuleException("El precio no puede ser mayor a 1,000,000");
        }
        if (request.stock() != null && request.stock() > 1000000) {
            throw new com.inventario.exception.BusinessRuleException("El stock no puede ser mayor a 1,000,000");
        }

        Producto producto = ProductoMapper.toEntity(request, categoria);
        return ProductoMapper.toResponse(productoRepository.save(producto));
    }

    @Override
    public ProductoResponse actualizar(Integer id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Producto no encontrado con id: " + id));

        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoría no encontrada con id: " + request.categoriaId()));

        if (request.precio() != null && request.precio().compareTo(new java.math.BigDecimal("1000000")) > 0) {
            throw new com.inventario.exception.BusinessRuleException("El precio no puede ser mayor a 1,000,000");
        }
        if (request.stock() != null && request.stock() > 1000000) {
            throw new com.inventario.exception.BusinessRuleException("El stock no puede ser mayor a 1,000,000");
        }

        producto.setNombre(request.nombre().trim());
        producto.setCategoria(categoria);
        producto.setPrecio(request.precio());
        producto.setStock(request.stock());

        return ProductoMapper.toResponse(productoRepository.save(producto));
    }
}
