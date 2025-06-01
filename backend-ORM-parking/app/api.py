from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import SessionLocal
from crud import ticket
from models import enums
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o ["http://localhost:5173"] si querés limitarlo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia para obtener una sesión por request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# Pydantic Schemas
# =========================

class TicketBase(BaseModel):
    id_cliente: Optional[int]
    id_tipo_vehiculo: int
    fecha: datetime
    hora_entrada: datetime
    hora_salida: Optional[datetime] = None
    estado: enums.EstadoTicketEnum
    costo_total: Optional[float] = None

class CrearTicket(TicketBase):
    asignaciones: List[int]

class TicketResponse(TicketBase):
    id_ticket: int
    class Config:
        from_attributes = True

class TicketVista(BaseModel):
    id_ticket: int
    cliente: str
    tipo_vehiculo: str
    fecha: datetime
    hora_entrada: datetime
    hora_salida: Optional[datetime] = None
    estado: enums.EstadoTicketEnum
    costo_total: Optional[float] = None
    numero_espacio: Optional[int] = None
    ubicacion: Optional[str] = None
    hora_inicio_asignacion: Optional[datetime] = None
    hora_fin_asignacion: Optional[datetime] = None

    class Config:
        from_attributes = True

# =========================
# ENDPOINTS API REST
# =========================

@app.get("/tickets", response_model=List[TicketVista])
def listar(db: Session = Depends(get_db)):
    return ticket.listar_tickets(db)

@app.get("/tickets/{ticket_id}", response_model=TicketResponse)
def obtener(ticket_id: int, db: Session = Depends(get_db)):
    t = ticket.obtener_ticket(db, ticket_id)
    if not t:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return t

@app.post("/tickets", response_model=TicketResponse)
def crear(data: CrearTicket, db: Session = Depends(get_db)):
    return ticket.crear_ticket_con_asignacion(
        db, data.dict(exclude={"asignaciones"}), data.asignaciones
    )

@app.put("/tickets/{ticket_id}", response_model=TicketResponse)
def actualizar(ticket_id: int, campos: TicketBase, db: Session = Depends(get_db)):
    t = ticket.actualizar_ticket(db, ticket_id, campos.dict(exclude_unset=True))
    if not t:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return t

@app.delete("/tickets/{ticket_id}")
def eliminar(ticket_id: int, db: Session = Depends(get_db)):
    if not ticket.eliminar_ticket(db, ticket_id):
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return {"message": "Ticket eliminado correctamente"}

@app.get("/espacios/disponibles")
def listar_espacios_disponibles(db: Session = Depends(get_db)):
    from models.espacio_parqueo import EspacioParqueo
    espacios = db.query(EspacioParqueo).filter_by(disponible=True).all()
    return [
        {
            "id_espacio": e.id_espacio,
            "numero_espacio": e.numero_espacio,
            "ubicacion": e.ubicacion
        } for e in espacios
    ]

@app.get("/tipos_vehiculo")
def listar_tipos_vehiculo(db: Session = Depends(get_db)):
    from models.tipo_vehiculo import TipoVehiculo
    return db.query(TipoVehiculo).filter_by(estado=enums.EstadoVehiculoEnum.activo).all()

@app.get("/clientes")
def listar_clientes(db: Session = Depends(get_db)):
    from models.cliente import Cliente
    return db.query(Cliente).all()
