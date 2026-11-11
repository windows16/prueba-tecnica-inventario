package com.inventario.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Estructura estándar para todas las respuestas de error de la API.
 * Consistente en todos los endpoints — el frontend siempre lee el mismo shape.
 */
@Builder
public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path
) {}
