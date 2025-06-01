# Sistema de Control de Entradas y Salidas - Parqueo Público

Integrantes:

Javier Linares - 231135
Cristian Tunchez - 231359

Este proyecto corresponde al Laboratorio 3 de Bases de Datos 1 (CC3088) y permite gestionar un sistema de parqueo público utilizando una arquitectura dividida en backend y frontend, cada uno en su propia carpeta.

## Estructura del Proyecto

```
/raíz-del-proyecto
│
├── backend/
│   ├── app/
│   ├── db/
│   ├── models/
│   ├── crud/
│   ├── main.py
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── App.jsx
│   ├── Dockerfile
│   └── docker-compose.yml
```

## Requisitos

- Docker
- Docker DockerDescktop

---

## Pasos para ejecutar el proyecto

### 1. Ejecutar el Backend

1. Abre una terminal y navega a la carpeta `backend/`.

```bash
cd backend
```

2. Construye y levanta los contenedores con Docker Compose:

```bash
docker compose up --build
```

3. El backend estará disponible en: [http://localhost:8000](http://localhost:8000)

> **Nota:** Se utiliza FastAPI y SQLAlchemy como ORM. La base de datos PostgreSQL se inicializa automáticamente.

---

### 2. Ejecutar el Frontend

1. Abre otra terminal y navega a la carpeta `frontend/`.

```bash
cd frontend
```

2. Construye y levanta los contenedores:

```bash
docker compose up --build
```

3. El frontend estará disponible en: [http://localhost:5173](http://localhost:5173)

> **Nota:** El frontend está hecho en React (Vite). Consume directamente los endpoints del backend para visualizar y operar el CRUD.

---

## Funcionalidades principales

- Registrar tickets de parqueo asociados a uno o más espacios.
- Visualizar todos los tickets desde una tabla responsive.
- Editar y eliminar tickets.
- Modal para registrar y modificar tickets.
- Vista (VIEW) en PostgreSQL para poblar el índice.
- Tipos de datos personalizados y validaciones.
