# Dockerfile — Desarrollo Vite + React
FROM node:20-alpine

WORKDIR /app

# Copiar e instalar dependencias
COPY package*.json ./

RUN npm install
RUN npm install bootstrap bootstrap-icons

# Copiar el resto del código fuente
COPY . .

# Exponer puerto por defecto de Vite
EXPOSE 5173

# Comando para iniciar Vite con acceso externo (Docker → Host)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
