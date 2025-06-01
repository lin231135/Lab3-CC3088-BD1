CREATE OR REPLACE VIEW vw_tickets_asignados AS
SELECT
  t.id_ticket,
  c.nombre AS cliente,
  tv.nombre_tipo AS tipo_vehiculo,
  t.fecha,
  t.hora_entrada,
  t.hora_salida,
  t.estado,
  t.costo_total,
  e.numero_espacio,
  e.ubicacion,
  a.hora_inicio_asignacion,
  a.hora_fin_asignacion
FROM ticket t
JOIN cliente c ON t.id_cliente = c.id_cliente
JOIN tipo_vehiculo tv ON t.id_tipo_vehiculo = tv.id_tipo_vehiculo
LEFT JOIN asignacion_espacio a ON t.id_ticket = a.id_ticket
LEFT JOIN espacio_parqueo e ON a.id_espacio = e.id_espacio;