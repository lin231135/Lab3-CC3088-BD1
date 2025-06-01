import enum

class EstadoVehiculoEnum(enum.Enum):
    activo = "activo"
    inactivo = "inactivo"

class EstadoTicketEnum(enum.Enum):
    activo = "activo"
    finalizado = "finalizado"
    cancelado = "cancelado"