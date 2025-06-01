import { useEffect, useState } from "react";
import {
  obtenerTickets,
  crearTicket,
  eliminarTicket,
  obtenerEspaciosDisponibles,
  actualizarTicket,
  obtenerTiposVehiculo,
  obtenerClientes,
} from "./api";
import axios from "axios";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });

  const [formData, setFormData] = useState({
    id_cliente: null,
    id_tipo_vehiculo: 1,
    fecha: new Date().toISOString(),
    hora_entrada: new Date().toISOString(),
    hora_salida: null,
    estado: "activo",
    asignaciones: [],
  });

  useEffect(() => {
    fetchTickets();
    fetchEspacios();
    fetchTiposVehiculo();
    fetchClientes();
  }, []);

  const fetchTickets = async () => {
    const res = await obtenerTickets();
    setTickets(res.data);
  };

  const fetchEspacios = async () => {
    const res = await obtenerEspaciosDisponibles();
    setEspacios(res.data);
  };

  const fetchTiposVehiculo = async () => {
    const res = await obtenerTiposVehiculo();
    setTiposVehiculo(res.data);
  };

  const fetchClientes = async () => {
    const res = await obtenerClientes();
    setClientes(res.data);
  };

  const resetForm = () => {
    setFormData({
      id_cliente: null,
      id_tipo_vehiculo: 1,
      fecha: new Date().toISOString(),
      hora_entrada: new Date().toISOString(),
      hora_salida: null,
      estado: "activo",
      asignaciones: [],
    });
    setEditando(false);
    setEditId(null);
    setModalVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let datos = {
        ...formData,
        id_cliente: formData.id_cliente !== null ? parseInt(formData.id_cliente) : null,
        id_tipo_vehiculo: parseInt(formData.id_tipo_vehiculo),
      };

      delete datos.costo_total;

      if (editando) {
        delete datos.asignaciones;
        await actualizarTicket(editId, datos);
      } else {
        datos.asignaciones = formData.asignaciones.map((id) => parseInt(id));
        await crearTicket(datos);
      }

      fetchTickets();
      resetForm();
    } catch (error) {
      console.error("Error al guardar ticket:", error.response?.data || error);
    }
  };

  const handleDelete = async () => {
    try {
      await eliminarTicket(confirmDelete.id);
      fetchTickets();
    } catch (error) {
      console.error("Error al eliminar ticket:", error);
    }
    setConfirmDelete({ visible: false, id: null });
  };

  const handleEdit = async (ticket) => {
    try {
      const res = await axios.get(`http://localhost:8000/tickets/${ticket.id_ticket}`);
      const fullTicket = res.data;

      setFormData({
        id_cliente: fullTicket.id_cliente ?? null,
        id_tipo_vehiculo: fullTicket.id_tipo_vehiculo ?? 1,
        fecha: fullTicket.fecha,
        hora_entrada: fullTicket.hora_entrada,
        hora_salida: fullTicket.hora_salida ?? null,
        estado: fullTicket.estado,
        asignaciones: [],
      });

      setEditando(true);
      setEditId(ticket.id_ticket);
      setModalVisible(true);
    } catch (error) {
      console.error("Error al cargar ticket:", error);
    }
  };

  const handleVer = (ticket) => {
    alert(
      `Ticket #${ticket.id_ticket}\nCliente: ${ticket.cliente}\nTipo Vehículo: ${ticket.tipo_vehiculo}\nEstado: ${ticket.estado}\nFecha: ${ticket.fecha}\nEspacio: ${ticket.numero_espacio || "N/A"}`
    );
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-dark">Tickets de Parqueo</h2>
        <button className="btn btn-primary" onClick={() => setModalVisible(true)}>
          <i className="bi bi-plus-circle me-1"></i> Agregar Ticket
        </button>
      </div>

      <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
        <table className="table table-striped table-hover text-center align-middle">
          <thead className="table-light text-dark">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Tipo Vehículo</th>
              <th>Fecha</th>
              <th>Hora Entrada</th>
              <th>Hora Salida</th>
              <th>Estado</th>
              <th>Costo Total</th>
              <th>Espacio</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((t) => (
                <tr key={t.id_ticket} className={`fila-${t.estado}`}>
                  <td>{t.id_ticket}</td>
                  <td>{t.cliente}</td>
                  <td>{t.tipo_vehiculo}</td>
                  <td>{new Date(t.fecha).toLocaleDateString()}</td>
                  <td>{new Date(t.hora_entrada).toLocaleTimeString()}</td>
                  <td>{t.hora_salida ? new Date(t.hora_salida).toLocaleTimeString() : "—"}</td>
                  <td className={`estado-${t.estado.toLowerCase()}`}>{t.estado.toUpperCase()}</td>
                  <td>{t.costo_total != null ? `Q${t.costo_total.toFixed(2)}` : "—"}</td>
                  <td>{t.numero_espacio || "—"}</td>
                  <td>{t.ubicacion || "—"}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-info text-white me-1" onClick={() => handleVer(t)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-warning text-white me-1" onClick={() => handleEdit(t)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-danger text-white"
                        onClick={() => setConfirmDelete({ visible: true, id: t.id_ticket })}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">No hay tickets registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalVisible && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{editando ? "Editar Ticket" : "Crear Ticket"}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={resetForm}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body bg-light text-dark">
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Cliente</label>
                      <select
                        className="form-select"
                        value={formData.id_cliente ?? ""}
                        disabled={editando}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            id_cliente: e.target.value === "" ? null : parseInt(e.target.value),
                          })
                        }
                      >
                        <option value="">C/F</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.id_cliente} value={cliente.id_cliente}>
                            {cliente.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label">Tipo Vehículo</label>
                      <select
                        className="form-select"
                        value={formData.id_tipo_vehiculo}
                        disabled={editando}
                        onChange={(e) => setFormData({ ...formData, id_tipo_vehiculo: parseInt(e.target.value) })}
                      >
                        {tiposVehiculo.map((tipo) => (
                          <option key={tipo.id_tipo_vehiculo} value={tipo.id_tipo_vehiculo}>
                            {tipo.nombre_tipo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Fecha</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.fecha.slice(0, 16)}
                        disabled
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Hora Entrada</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.hora_entrada.slice(0, 16)}
                        disabled
                      />
                    </div>
                  </div>

                  {editando && (
                    <div className="row mb-3">
                      <div className="col">
                        <label className="form-label">Hora Salida</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={formData.hora_salida ? formData.hora_salida.slice(0, 16) : ""}
                          onChange={(e) => setFormData({ ...formData, hora_salida: e.target.value })}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label">Estado</label>
                        <select
                          className="form-select"
                          value={formData.estado}
                          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        >
                          <option value="activo">Activo</option>
                          <option value="finalizado">Finalizado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Asignar Espacios</label>
                      <select
                        multiple
                        className="form-select"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            asignaciones: Array.from(e.target.selectedOptions, (o) => parseInt(o.value)),
                          })
                        }
                      >
                        {espacios.length === 0 ? (
                          <option disabled>No hay espacios disponibles</option>
                        ) : (
                          espacios.map((espacio) => (
                            <option key={espacio.id_espacio} value={espacio.id_espacio}>
                              {espacio.numero_espacio} - {espacio.ubicacion}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-1"></i> {editando ? "Actualizar" : "Guardar"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmDelete.visible && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setConfirmDelete({ visible: false, id: null })}
                ></button>
              </div>
              <div className="modal-body bg-light">
                <p>¿Estás seguro que deseas eliminar este ticket?</p>
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete({ visible: false, id: null })}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;