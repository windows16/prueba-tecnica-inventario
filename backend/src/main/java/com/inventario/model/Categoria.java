package com.inventario.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que mapea la tabla {@code categorias}.
 *
 * <p>La relación {@code OneToMany} usa {@code FetchType.LAZY} para evitar
 * que se cargue la colección de productos en cada consulta de categoría.
 * El acceso a {@code productos} se realiza solo cuando sea explícitamente
 * necesario (p.ej. para contar antes de eliminar).</p>
 */
@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @OneToMany(mappedBy = "categoria", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Producto> productos = new ArrayList<>();
}
