from sqlalchemy.orm import Session
from models.ticket import Ticket
from models.asignacion_espacio import AsignacionEspacio
from models.espacio_parqueo import EspacioParqueo
from datetime import datetime
from sqlalchemy import text

# Crear un nuevo ticket + asignación de espacios
def crear_ticket_con_asignacion(db: Session, ticket_data: dict, asignaciones: list[int]):
    # 1. Crear el ticket
    nuevo_ticket = Ticket(**ticket_data)
    db.add(nuevo_ticket)
    db.commit()
    db.refresh(nuevo_ticket)

    # 2. Crear las asignaciones de espacio
    for id_espacio in asignaciones:
        asignacion = AsignacionEspacio(
            id_ticket=nuevo_ticket.id_ticket,
            id_espacio=id_espacio,
            hora_inicio_asignacion=datetime.now()
        )
        db.add(asignacion)

        # Marcar espacio como no disponible
        espacio = db.query(EspacioParqueo).filter_by(id_espacio=id_espacio).first()
        if espacio:
            espacio.disponible = False

    db.commit()
    return nuevo_ticket


# Obtener todos los tickets
def listar_tickets(db: Session):
    return db.execute(text("SELECT * FROM vw_tickets_asignados")).mappings().all()

# Obtener ticket por ID
def obtener_ticket(db: Session, ticket_id: int):
    return db.query(Ticket).filter_by(id_ticket=ticket_id).first()


# Actualizar ticket
def actualizar_ticket(db: Session, ticket_id: int, campos: dict):
    ticket = db.query(Ticket).filter_by(id_ticket=ticket_id).first()
    if not ticket:
        return None
    for k, v in campos.items():
        setattr(ticket, k, v)
    db.commit()
    return ticket


# Eliminar ticket y liberar espacios
def eliminar_ticket(db: Session, ticket_id: int):
    ticket = db.query(Ticket).filter_by(id_ticket=ticket_id).first()
    if not ticket:
        return False

    # Liberar espacios asignados
    asignaciones = db.query(AsignacionEspacio).filter_by(id_ticket=ticket_id).all()
    for a in asignaciones:
        espacio = db.query(EspacioParqueo).filter_by(id_espacio=a.id_espacio).first()
        if espacio:
            espacio.disponible = True
        db.delete(a)

    db.delete(ticket)
    db.commit()
    return True