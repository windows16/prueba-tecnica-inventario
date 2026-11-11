package com.inventario.repository;

import com.inventario.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    /** Verifica duplicados de nombre (case-insensitive) antes de insertar. */
    boolean existsByNombreIgnoreCase(String nombre);
}
