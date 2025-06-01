from sqlalchemy import Column, Integer, ForeignKey, DateTime
from models import Base

class AsignacionEspacio(Base):
    __tablename__ = 'asignacion_espacio'

    id_asignacion = Column(Integer, primary_key=True)
    id_ticket = Column(Integer, ForeignKey("ticket.id_ticket"), nullable=False)
    id_espacio = Column(Integer, ForeignKey("espacio_parqueo.id_espacio"), nullable=False)
    hora_inicio_asignacion = Column(DateTime, nullable=False)
    hora_fin_asignacion = Column(DateTime)