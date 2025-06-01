from sqlalchemy import Column, Integer, String, Text, Enum
from models import Base
from models.enums import EstadoVehiculoEnum

class TipoVehiculo(Base):
    __tablename__ = 'tipo_vehiculo'

    id_tipo_vehiculo = Column(Integer, primary_key=True)
    nombre_tipo = Column(String(50), nullable=False)
    descripcion = Column(Text)
    estado = Column(Enum(EstadoVehiculoEnum), default=EstadoVehiculoEnum.activo)
