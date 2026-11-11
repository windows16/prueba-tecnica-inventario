package com.inventario.controller;

import com.inventario.dto.request.CategoriaRequest;
import com.inventario.dto.response.CategoriaResponse;
import com.inventario.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST para el recurso Categoría.
 *
 * <p>Responsabilidad única: recibir la petición HTTP, delegar al servicio
 * y devolver la respuesta con el código HTTP correcto.
 * No contiene lógica de negocio.</p>
 */
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    /** GET /api/categorias — lista todas las categorías con su conteo de productos. */
    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listar() {
        return ResponseEntity.ok(categoriaService.listarTodas());
    }

    /** POST /api/categorias — crea una nueva categoría. */
    @PostMapping
    public ResponseEntity<CategoriaResponse> crear(@Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse creada = categoriaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    /**
     * DELETE /api/categorias/{id} — elimina una categoría vacía.
     * Devuelve 409 si tiene productos asociados (manejado por GlobalExceptionHandler).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
