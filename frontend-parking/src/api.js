import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
});

export const obtenerTickets = () => API.get("/tickets");
export const obtenerEspaciosDisponibles = () => API.get("/espacios/disponibles");
export const crearTicket = (data) => API.post("/tickets", data);
export const actualizarTicket = (id, data) => API.put(`/tickets/${id}`, data);
export const eliminarTicket = (id) => API.delete(`/tickets/${id}`);
export const obtenerTiposVehiculo = () => API.get("/tipos_vehiculo");
export const obtenerClientes = () => API.get("/clientes");
