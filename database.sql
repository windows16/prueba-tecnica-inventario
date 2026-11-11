-- ============================================================
--  Sistema de Gestión de Inventario
--  Base de datos: PostgreSQL 16
--  Archivo:       database.sql  (raíz del proyecto)
-- ============================================================

-- Crear la base de datos (ejecutar como superusuario si es necesario)
-- CREATE DATABASE inventario_db WITH ENCODING 'UTF8';
-- \c inventario_db

-- -------------------------------------------------------
-- Tabla: categorias  (tabla maestra, sin FK salientes)
-- Normalización: 3FN — valores atómicos, PK simple,
--   sin dependencias transitivas.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id     SERIAL       PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    CONSTRAINT uq_categorias_nombre UNIQUE (nombre)
);

-- -------------------------------------------------------
-- Tabla: productos  (tabla dependiente, FK → categorias)
-- ON DELETE RESTRICT refuerza a nivel de BD la regla de
--   negocio: no se puede borrar una categoría con productos.
-- CHECK constraints garantizan integridad de dominio.
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id             SERIAL         PRIMARY KEY,
    categoria_id   INTEGER        NOT NULL,
    nombre         VARCHAR(200)   NOT NULL,
    precio         NUMERIC(10, 2) NOT NULL,
    stock          INTEGER        NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_productos_precio_positivo
        CHECK (precio > 0),

    CONSTRAINT chk_productos_stock_no_negativo
        CHECK (stock >= 0)
);

-- -------------------------------------------------------
-- Índices para columnas de búsqueda y JOIN frecuentes
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id
    ON productos (categoria_id);

CREATE INDEX IF NOT EXISTS idx_productos_nombre
    ON productos (nombre);

-- -------------------------------------------------------
-- Datos de prueba: categorías
-- -------------------------------------------------------
INSERT INTO categorias (nombre) VALUES
    ('Electrónica'),
    ('Ropa y Accesorios'),
    ('Alimentos y Bebidas'),
    ('Hogar y Decoración'),
    ('Deportes')
ON CONFLICT (nombre) DO NOTHING;

-- -------------------------------------------------------
-- Datos de prueba: productos
-- Incluye casos de bajo stock (≤5) y sin stock (=0)
-- para verificar las alertas visuales.
-- -------------------------------------------------------
INSERT INTO productos (categoria_id, nombre, precio, stock) VALUES
    -- Electrónica
    (1, 'Smartphone Samsung Galaxy A14',   299.99,  25),
    (1, 'Audífonos Bluetooth JBL',          49.99,   3),  -- Bajo stock
    (1, 'Cable USB-C 2m',                    8.50, 100),
    (1, 'Tablet Lenovo Tab M10',           189.00,   5),  -- Bajo stock (límite)
    -- Ropa y Accesorios
    (2, 'Camiseta deportiva talla M',       18.99,  40),
    (2, 'Jeans slim fit talla 32',          45.00,   2),  -- Bajo stock
    (2, 'Gorra bordada',                    12.50,  15),
    -- Alimentos y Bebidas
    (3, 'Café molido 500g',                  9.99,   0),  -- Sin stock
    (3, 'Aceite de oliva extra virgen 1L',  14.75,  60),
    (3, 'Granola artesanal 400g',            7.25,  30),
    -- Hogar y Decoración
    (4, 'Lámpara LED de escritorio',        35.00,   8),
    (4, 'Cojín decorativo 45x45cm',         22.00,   4),  -- Bajo stock
    -- Deportes
    (5, 'Pelota de fútbol N°5',             28.00,  12),
    (5, 'Banda elástica de resistencia',    11.00,   1);  -- Bajo stock
