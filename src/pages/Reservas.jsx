import { useState, useEffect } from "react";
import "./Reservas.css";

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Obtener todas las reservas
  const fetchReservas = async () => {
    try {
      const response = await fetch("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/reservas");
      if (!response.ok) throw new Error("Error al obtener las reservas");

      const data = await response.json();
      setReservas(data);
    } catch (error) {
      console.error("Error al cargar reservas", error);
      setMensaje("No se pudieron cargar las reservas.");
    }
  };

  // Buscar una reserva por ID
  const buscarReserva = async (id) => {
    try {
      const response = await fetch(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/reserva/${id}`);
      if (!response.ok) throw new Error("Reserva no encontrada");

      const data = await response.json();
      setReservas([data]); // Mostrar solo la reserva encontrada
    } catch (error) {
      console.error("Error al buscar la reserva", error);
      setMensaje("Reserva no encontrada.");
    }
  };

  // Editar una reserva
  const editarReserva = async (id, nuevaData) => {
    try {
      const response = await fetch(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/reserva/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaData),
      });

      if (!response.ok) throw new Error("Error al editar la reserva");

      setMensaje("Reserva editada con éxito");
      fetchReservas(); // Recargar la lista de reservas
    } catch (error) {
      console.error("Error al editar la reserva", error);
      setMensaje("No se pudo editar la reserva.");
    }
  };

  // Aceptar o rechazar una reserva
  const actualizarEstadoReserva = async (id, estado) => {
    try {
      const response = await fetch(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/reserva/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      if (!response.ok) throw new Error("Error al actualizar la reserva");

      setMensaje(`Reserva ${estado} con éxito`);
      fetchReservas(); // Recargar la lista
    } catch (error) {
      console.error("Error al actualizar la reserva", error);
      setMensaje("No se pudo actualizar la reserva.");
    }
  };

  // Eliminar una reserva
  const eliminarReserva = async (id) => {
    try {
      const response = await fetch(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/reserva/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar la reserva");

      setMensaje("Reserva eliminada con éxito");
      fetchReservas(); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar la reserva", error);
      setMensaje("No se pudo eliminar la reserva.");
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  return (
    <div className="reservas-box">
      <h2>🍽 Carantanta</h2>
      <h3>📅 Reservas</h3>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      {reservas.length === 0 ? (
        <p className="loading-text">Cargando...</p>
      ) : (
        <div className="card-container">
          {reservas.map((r) => (
            <div key={r.id} className="card">
              <p><strong>Cliente:</strong> {r.cliente}</p>
              <p><strong>Mesa:</strong> {r.mesa}</p>
              <button className="editar" onClick={() => editarReserva(r.id, { cliente: "Nuevo Cliente", mesa: 99 })}>
                Editar
              </button>
              <button className="aceptar" onClick={() => actualizarEstadoReserva(r.id, "aceptada")}>
                Aceptar
              </button>
              <button className="rechazar" onClick={() => actualizarEstadoReserva(r.id, "rechazada")}>
                Rechazar
              </button>
              <button className="eliminar" onClick={() => eliminarReserva(r.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservas;
