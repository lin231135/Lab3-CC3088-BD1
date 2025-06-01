from sqlalchemy import Column, Integer, ForeignKey, Date, DateTime, Enum, Numeric
from models import Base
from models.enums import EstadoTicketEnum

class Ticket(Base):
    __tablename__ = 'ticket'

    id_ticket = Column(Integer, primary_key=True)
    id_cliente = Column(Integer, ForeignKey("cliente.id_cliente"))
    id_tipo_vehiculo = Column(Integer, ForeignKey("tipo_vehiculo.id_tipo_vehiculo"), nullable=False)
    fecha = Column(Date, nullable=False)
    hora_entrada = Column(DateTime, nullable=False)
    hora_salida = Column(DateTime)
    estado = Column(Enum(EstadoTicketEnum), nullable=False)
    costo_total = Column(Numeric(10, 2))