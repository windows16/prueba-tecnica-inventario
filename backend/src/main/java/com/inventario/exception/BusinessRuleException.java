package com.inventario.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Se lanza cuando una operación viola una regla de negocio.
 * Ejemplos:
 * <ul>
 *   <li>Intentar eliminar una categoría que tiene productos asociados.</li>
 *   <li>Crear una categoría con un nombre ya existente.</li>
 * </ul>
 * Mapeado a HTTP 409 Conflict por {@link GlobalExceptionHandler}.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
