package com.inventario.controller;

import com.inventario.dto.request.ProductoRequest;
import com.inventario.dto.response.PagedResponse;
import com.inventario.dto.response.ProductoResponse;
import com.inventario.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para el recurso Producto.
 */
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    /**
     * GET /api/productos — lista paginada con filtros opcionales.
     *
     * @param page        número de página, 1-based (default: 1)
     * @param limit       elementos por página (default: 10)
     * @param nombre      búsqueda parcial por nombre (opcional)
     * @param categoriaId filtro exacto por categoría (opcional)
     */
    @GetMapping
    public ResponseEntity<PagedResponse<ProductoResponse>> listar(
            @RequestParam(defaultValue = "1")  int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false)    String nombre,
            @RequestParam(required = false)    Integer categoriaId) {

        return ResponseEntity.ok(
                productoService.listar(page, limit, nombre, categoriaId));
    }

    /** POST /api/productos — registra un nuevo producto. */
    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse creado = productoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}
