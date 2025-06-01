from sqlalchemy import Column, Integer, ForeignKey, Numeric
from models import Base

class Tarifa(Base):
    __tablename__ = 'tarifa'

    id_tarifa = Column(Integer, primary_key=True)
    id_tipo_vehiculo = Column(Integer, ForeignKey("tipo_vehiculo.id_tipo_vehiculo"), nullable=False)
    tarifa_por_hora = Column(Numeric(10, 2), nullable=False)
    tarifa_minima = Column(Numeric(10, 2), nullable=False)
    tiempo_minimo = Column(Integer, nullable=False)  # en minutos
    tiempo_maximo = Column(Integer, nullable=False)
