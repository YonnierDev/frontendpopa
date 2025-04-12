import { useEffect, useState } from "react";
import { api } from "../api/api";

const ReservaListPage = () => {
  const [reservas, setReservas] = useState([]);
  const [editReserva, setEditReserva] = useState(null);
  const [searchId, setSearchId] = useState("");

  // Obtener todas las reservas
  const fetchReservas = async () => {
    try {
      const response = await api.get("/reservas");
      setReservas(response.data);
    } catch (error) {
      console.error("Error al obtener las reservas:", error.response?.data || error.message);
    }
  };

  // Buscar una reserva por ID
  const fetchReservaById = async () => {
    if (!searchId) return;
    try {
      const response = await api.get(`/reserva/${searchId}`);
      setReservas([response.data]);
    } catch (error) {
      console.error("Error al buscar la reserva:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Editar reserva
  const handleEditClick = (reserva) => {
    setEditReserva({ ...reserva });
  };

  // Guardar cambios en la edición
  const handleSaveEdit = async () => {
    if (!editReserva) return;
    try {
      await api.put(`/reserva/${editReserva.id}`, editReserva);
      setEditReserva(null);
      fetchReservas();
    } catch (error) {
      console.error("Error al guardar los cambios:", error.response?.data || error.message);
    }
  };

  // Cambiar estado (activar/desactivar)
  const handleToggleActive = async (id) => {
    try {
      await api.put(`/reserva/${id}/estado`);
      fetchReservas();
    } catch (error) {
      console.error("Error al cambiar el estado:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Lista de Reservas</h2>
      <div>
        <input
          type="text"
          placeholder="Buscar por ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={fetchReservaById}>Buscar</button>
        <button onClick={fetchReservas}>Listar Todas</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Evento ID</th>
            <th>Usuario ID</th>
            <th>Fecha y Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.id}</td>
              <td>
                {editReserva?.id === reserva.id ? (
                  <input
                    type="number"
                    value={editReserva.eventoid}
                    onChange={(e) => setEditReserva({ ...editReserva, eventoid: e.target.value })}
                  />
                ) : (
                  reserva.eventoid
                )}
              </td>
              <td>
                {editReserva?.id === reserva.id ? (
                  <input
                    type="number"
                    value={editReserva.usuarioid}
                    onChange={(e) => setEditReserva({ ...editReserva, usuarioid: e.target.value })}
                  />
                ) : (
                  reserva.usuarioid
                )}
              </td>
              <td>
                {editReserva?.id === reserva.id ? (
                  <input
                    type="text"
                    value={editReserva.fecha_hora}
                    onChange={(e) => setEditReserva({ ...editReserva, fecha_hora: e.target.value })}
                  />
                ) : (
                  reserva.fecha_hora
                )}
              </td>
              <td>
                {editReserva?.id === reserva.id ? (
                  <select
                    value={editReserva.estado}
                    onChange={(e) => setEditReserva({ ...editReserva, estado: e.target.value === "true" })}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                ) : (
                  reserva.estado ? "Activo" : "Inactivo"
                )}
              </td>
              <td>
                {editReserva?.id === reserva.id ? (
                  <button onClick={handleSaveEdit}>Guardar</button>
                ) : (
                  <button onClick={() => handleEditClick(reserva)}>Editar</button>
                )}
                <button onClick={() => handleToggleActive(reserva.id)}>
                  {reserva.estado ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservaListPage;
