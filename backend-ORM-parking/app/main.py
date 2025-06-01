import os
import time
import psycopg2
import uvicorn
from db import engine
from models import Base
from models import cliente, tipo_vehiculo, tarifa, espacio_parqueo, ticket, asignacion_espacio
from sqlalchemy.schema import CreateTable
import api

SCRIPTS_DIR = "/scripts"

def inicializar_base():
    # 1. Crear base de datos
    print("🚀 Creando base de datos...")
    Base.metadata.create_all(bind=engine)

    # 2. Escribir schema.sql en /scripts
    os.makedirs(SCRIPTS_DIR, exist_ok=True)
    schema_path = os.path.join(SCRIPTS_DIR, "schema.sql")
    with open(schema_path, "w") as f:
        for table in Base.metadata.tables.values():
            ddl = str(CreateTable(table).compile(engine))
            f.write(f"{ddl};\n\n")
    print("✅ schema.sql generado")

    # 3. Esperar que PostgreSQL esté listo
    print("⏳ Esperando conexión a la base de datos...")
    for _ in range(10):
        try:
            conn = psycopg2.connect(
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT"),
                dbname=os.getenv("POSTGRES_DB"),
                user=os.getenv("POSTGRES_USER"),
                password=os.getenv("POSTGRES_PASSWORD"),
            )
            conn.close()
            break
        except psycopg2.OperationalError:
            time.sleep(2)
    else:
        print("❌ No se pudo conectar a la base de datos.")
        exit(1)

    # 4. Ejecutar data.sql y view.sql
    print("📥 Insertando datos desde data.sql...")
    try:
        with psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
        ) as conn:
            with conn.cursor() as cur:
                # Ejecutar data.sql
                data_path = os.path.join(SCRIPTS_DIR, "data.sql")
                with open(data_path, "r") as f:
                    cur.execute(f.read())
                print("✅ Datos insertados exitosamente.")

                # Ejecutar view.sql si existe
                view_path = os.path.join(SCRIPTS_DIR, "view.sql")
                if os.path.exists(view_path):
                    with open(view_path, "r") as f:
                        cur.execute(f.read())
                    print("✅ Vista creada correctamente.")
                else:
                    print("⚠️  No se encontró view.sql, omitiendo creación de vista.")

            conn.commit()
    except Exception as e:
        print("❌ Error al insertar datos o crear vista:", e)

def levantar_api():
    print("🚀 Levantando API en http://localhost:8000")
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    inicializar_base()
    levantar_api()