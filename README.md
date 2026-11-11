# Sistema de Gestión de Inventario

Aplicación web full-stack para el control de inventario de una tienda.
Permite visualizar productos, registrar nuevos elementos y aplica reglas de negocio
para el control de stock e integridad de categorías.

---

## 📋 Requisitos Funcionales y Reglas de Negocio

El sistema cubre formalmente los siguientes requisitos funcionales de acuerdo a la especificación técnica:

### RF-01: Listado y Visualización de Productos
- **Descripción:** El sistema debe presentar una vista principal que liste todos los productos en una tabla organizada y responsiva.
- **Campos visibles:** Nombre del producto, Categoría asignada, Precio unitario, Unidades en Stock, Estado de Inventario y Fecha de creación.
- **Paginación:** La información se presenta paginada en bloques de 10 elementos para optimizar el rendimiento.

### RF-02: Búsqueda y Filtrado de Productos
- **Descripción:** El usuario debe poder localizar productos mediante filtros combinables:
  - **Búsqueda por texto:** Filtrado por coincidencia parcial de texto en el nombre del producto (case-insensitive).
  - **Filtro por categoría:** Selector desplegable que permite aislar los productos de una categoría específica o ver todas.

### RF-03: Registro de Nuevos Productos
- **Descripción:** El sistema debe proveer un formulario para dar de alta productos asignándolos a una categoría existente.
- **Validaciones obligatorias (Frontend & Backend):**
  - **Nombre:** Obligatorio, no vacío ni espacios en blanco (máximo 200 caracteres).
  - **Categoría:** Obligatoria, debe existir previamente en la base de datos.
  - **Precio:** Numérico decimal obligatorio y estrictamente mayor a 0 (`precio > 0`).
  - **Stock:** Entero obligatorio, no negativo (`stock >= 0`).

### RF-04: Control y Alerta Visual de Stock (Regla de Negocio)
- **Descripción:** La interfaz debe evaluar en tiempo real la cantidad de stock de cada producto y mostrar un indicador visual distintivo según la condición:
  - **Sin Stock (Stock = 0):** Etiqueta roja indicando `"Sin stock"`.
  - **Bajo Stock (1 ≤ Stock ≤ 5):** Etiqueta de advertencia amarilla/ámbar indicando `"Bajo stock"`.
  - **Stock Normal (Stock > 5):** Etiqueta verde indicando `"Disponible"`.

### RF-05: Gestión de Categorías
- **Descripción:** El sistema debe permitir visualizar las categorías disponibles junto con la cantidad de productos vinculados a cada una, así como registrar nuevas categorías con nombres únicos.

### RF-06: Integridad Referencial en Categorías (Regla de Negocio)
- **Descripción:** El sistema debe impedir la eliminación de cualquier categoría que tenga productos asociados.
- **Comportamiento:**
  - En la interfaz, la acción de eliminar se deshabilita preventivamente si la categoría posee productos asociados.
  - A nivel backend y base de datos, si se intenta eliminar una categoría con dependencias, se rechaza la solicitud controladamente (`HTTP 409 Conflict` / `ON DELETE RESTRICT`) sin provocar caídas ni excepciones no controladas en el servidor.

---

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| **Backend** | Java 21 + Spring Boot 3.3 | Arquitectura en capas estándar, Spring Data JPA, Bean Validation y manejo centralizado de excepciones |
| **Base de datos** | PostgreSQL 16 | Motor relacional robusto, normalizado en 3FN con constraints (`CHECK`, `UNIQUE`, `FOREIGN KEY`) |
| **Frontend** | React 19 + TypeScript + Vite | SPA moderna, tipado estricto, Tailwind CSS v4, Lucide Icons y diseño responsivo |
| **Servidor Web** | Nginx Alpine (Reverse Proxy) | Servidor estático de alta eficiencia con redirección interna de `/api/` hacia el backend |
| **Contenedores** | Docker + Docker Compose | Despliegue agnóstico, reproducible y aislado con un solo comando |

---

## Requisitos Previos

- **Docker Desktop** (versión 4.x o superior) con Docker Compose habilitado.
> *Nota:* No se requiere tener instalado Java, Node.js ni PostgreSQL en la máquina host; los contenedores proveen los entornos de compilación y ejecución completos.

---

## Levantar el Proyecto con Docker

### 1. Clonar o ingresar al directorio del proyecto

```bash
cd prueba-tecnica-inventario
```

### 2. Variables de entorno (Opcional)

El archivo `docker-compose.yml` cuenta con valores por defecto preconfigurados y listos para usar. Si se desean personalizar credenciales, se puede copiar la plantilla:

```bash
cp .env.example .env
```

### 3. Construir y levantar los contenedores

```bash
docker compose up --build
```

*(Si se requiere reconstruir descartando capas anteriores, usar `docker compose build --no-cache && docker compose up`).*

### 4. Puntos de acceso

| Servicio | URL | Descripción |
|---|---|---|
| **Frontend (Web)** | [http://localhost](http://localhost) | Aplicación web completa de inventario |
| **Backend (API REST)** | [http://localhost:8080/api](http://localhost:8080/api) | Endpoints REST de Spring Boot |
| **Documentación Swagger UI** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Documentación interactiva OpenAPI 3 |
| **PostgreSQL** | `localhost:5432` | Base de datos (`inventario_db`) |

> En el primer arranque, PostgreSQL ejecuta automáticamente el script `database.sql` cargando las tablas normalizadas y los datos de prueba iniciales (incluyendo casos de bajo stock).

### 5. Detener la aplicación

```bash
# Detener contenedores preservando los datos de la base de datos
docker compose down

# Detener contenedores eliminando el volumen de datos
docker compose down -v
```

---

## Base de Datos e Inicialización

### Esquema y Normalización (3FN)

El modelo está normalizado en Tercera Forma Normal (3FN), eliminando redundancias y dependencias transitivas:

```
categorias                                productos
┌───────────────────────────┐             ┌────────────────────────────────────────────────────────┐
│ id: SERIAL (PK)           │◄────────────│ id: SERIAL (PK)                                        │
│ nombre: VARCHAR(100) (UQ) │             │ categoria_id: INT (FK -> categorias.id ON DEL RESTRICT)│
└───────────────────────────┘             │ nombre: VARCHAR(200) NOT NULL                          │
                                          │ precio: NUMERIC(10,2) CHECK (precio > 0)               │
                                          │ stock: INT CHECK (stock >= 0)                          │
                                          │ fecha_creacion: TIMESTAMPTZ DEFAULT NOW()              │
                                          └────────────────────────────────────────────────────────┘
```

### Importación Manual (Entorno sin Docker)

Si se desea ejecutar la base de datos fuera de Docker en un servidor PostgreSQL local:

```bash
psql -U postgres -c "CREATE DATABASE inventario_db;"
psql -U postgres -d inventario_db -f database.sql
```

---

## API REST Endpoints

### Categorías
- `GET /api/categorias`: Obtiene el listado completo de categorías y el total de productos de cada una.
- `POST /api/categorias`: Registra una nueva categoría (`{ "nombre": "..." }`).
- `DELETE /api/categorias/{id}`: Elimina una categoría si no tiene productos asociados (retorna `409 Conflict` si posee dependencias).

### Productos
- `GET /api/productos?page=1&limit=10&nombre=&categoriaId=`: Listado paginado de productos con filtros dinámicos.
- `POST /api/productos`: Registra un nuevo producto:
  ```json
  {
    "nombre": "Mouse Ergonómico",
    "categoriaId": 1,
    "precio": 35.50,
    "stock": 4
  }
  ```

---

## Estructura del Proyecto

```
prueba-tecnica-inventario/
├── backend/                             # API Spring Boot (Java 21)
│   ├── src/main/java/com/inventario/
│   │   ├── config/                      # Configuración de CORS y beans
│   │   ├── controller/                  # Endpoints REST (ResponseEntity, @Valid)
│   │   ├── dto/                         # Records DTO de entrada y salida
│   │   ├── exception/                   # GlobalExceptionHandler y excepciones de negocio
│   │   ├── mapper/                      # Transformaciones Entity <-> DTO
│   │   ├── model/                       # Entidades JPA (@Entity, @Table)
│   │   ├── repository/                  # Spring Data JPA Repositories
│   │   └── service/                     # Interfaces y lógica de negocio (@Transactional)
│   ├── Dockerfile                       # Multi-stage build con Maven y JRE 21 Alpine
│   └── pom.xml
│
├── frontend/                            # SPA React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/ui/               # Componentes UI reutilizables (Badges, Alerts)
│   │   ├── features/
│   │   │   ├── categorias/              # Módulo de Categorías (pages, services, models)
│   │   │   └── productos/               # Módulo de Productos (pages, services, models)
│   │   ├── routers/                     # Enrutador y Layout de la aplicación
│   │   └── services/                    # Cliente HTTP Axios centralizado
│   ├── Dockerfile                       # Multi-stage: compilación Node + servidor Nginx
│   ├── nginx.conf                       # Configuración de proxy inverso y SPA fallback
│   └── package.json
│
├── database.sql                         # Script DDL + Seed data inicial
├── docker-compose.yml                   # Orquestación de servicios (db, api, web)
├── .env.example                         # Plantilla de variables de entorno
└── README.md                            # Documentación integral del proyecto
```
