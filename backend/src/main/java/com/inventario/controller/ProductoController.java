package com.inventario.controller;

import com.inventario.dto.request.ProductoRequest;
import com.inventario.dto.response.ErrorResponse;
import com.inventario.dto.response.PagedResponse;
import com.inventario.dto.response.ProductoResponse;
import com.inventario.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para el recurso Producto documentado con OpenAPI 3 / Swagger.
 */
@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@Tag(name = "Productos", description = "Operaciones para la gestión de productos e inventario")
public class ProductoController {

    private final ProductoService productoService;

    @Operation(
            summary = "Listar productos con paginación y filtros",
            description = "Obtiene los productos paginados y permite filtrar por coincidencia en el nombre o categoría específica."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listado de productos obtenido exitosamente")
    })
    @GetMapping
    public ResponseEntity<PagedResponse<ProductoResponse>> listar(
            @Parameter(description = "Número de página (1-based)", example = "1")
            @RequestParam(defaultValue = "1") int page,

            @Parameter(description = "Cantidad de elementos por página", example = "10")
            @RequestParam(defaultValue = "10") int limit,

            @Parameter(description = "Filtro por coincidencia parcial de nombre", example = "Galaxy")
            @RequestParam(required = false) String nombre,

            @Parameter(description = "ID de la categoría a filtrar", example = "1")
            @RequestParam(required = false) Integer categoriaId) {

        return ResponseEntity.ok(productoService.listar(page, limit, nombre, categoriaId));
    }

    @Operation(
            summary = "Registrar un nuevo producto",
            description = "Crea un producto validando que el nombre no esté vacío, el precio sea > 0 y el stock >= 0."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Producto registrado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (falla de validación)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Categoría asignada no encontrada",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse creado = productoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @Operation(
            summary = "Obtener un producto por ID",
            description = "Retorna el detalle de un producto existente."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto obtenido exitosamente"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> obtenerPorId(
            @Parameter(description = "ID del producto", example = "1")
            @PathVariable Integer id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    @Operation(
            summary = "Actualizar un producto",
            description = "Actualiza los datos de un producto existente validando sus restricciones de negocio."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto actualizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Producto o categoría no encontrados",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> actualizar(
            @Parameter(description = "ID del producto a actualizar", example = "1")
            @PathVariable Integer id,
            @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.actualizar(id, request));
    }
}
