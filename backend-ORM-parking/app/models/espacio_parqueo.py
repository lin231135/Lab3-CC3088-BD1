from sqlalchemy import Column, Integer, Boolean, String
from models import Base

class EspacioParqueo(Base):
    __tablename__ = 'espacio_parqueo'

    id_espacio = Column(Integer, primary_key=True)
    numero_espacio = Column(Integer, unique=True, nullable=False)
    disponible = Column(Boolean, default=True)
    ubicacion = Column(String(100))