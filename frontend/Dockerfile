# ── Etapa 1: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Copiar dependencias primero para aprovechar caché de capas
COPY package*.json ./
# npm install en lugar de npm ci porque no hay package-lock.json generado localmente.
# Docker cacheará esta capa si package.json no cambia.
RUN npm install --silent

# Copiar fuentes y compilar
COPY . .
RUN npm run build

# ── Etapa 2: runtime (nginx sirve el build estático) ──────────────────────────
FROM nginx:1.27-alpine AS runtime

# Eliminar configuración por defecto de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build de React
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
