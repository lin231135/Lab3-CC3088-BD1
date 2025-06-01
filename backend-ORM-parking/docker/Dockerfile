FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el contenido de app (incluye templates y módulos)
COPY app/ /app/

# Comando que inicializa la base + lanza la API
CMD ["python", "main.py"]