import { useState, useEffect } from "react";
import axios from "axios"; // Importar Axios
import "./Reservas.css";

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await axios.get("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/reservas");
      setReservas(response.data);
    } catch (error) {
      console.error("Error al cargar reservas", error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta reserva?")) return;

    try {
      await axios.delete(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/reserva/${id}`);
      setReservas(reservas.filter(reserva => reserva.id !== id));

      setMensaje("Reserva eliminada exitosamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al eliminar reserva", error);
      setMensaje("No se pudo eliminar la reserva");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;

    try {
      await axios.put(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/reserva/${id}`, {
        estado: nuevoEstado
      });

      setReservas(reservas.map(reserva =>
        reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
      ));
    } catch (error) {
      console.error("Error al cambiar estado de la reserva", error);
    }
  };

  const reservasFiltradas = reservas.filter(reserva =>
    reserva.aprobacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="reservas-box">
      <h2>Reservas</h2>

      <input
        type="text"
        placeholder="Buscar reserva..."
        value={busqueda}
        onChange={handleBusqueda}
        className="buscador-reservas"
      />

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      {reservas.length === 0 ? (
        <p className="loading-text">Cargando...</p>
      ) : (
        <table className="reservas-tabla">
          <thead>
            <tr>
              <th>ID Usuario</th>
              <th>ID Evento</th>
              <th>Fecha</th>
              <th>Aprobación</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map(reserva => (
              <tr key={reserva.id} className="reserva-item">
                <td>{reserva.usuarioid}</td>
                <td>{reserva.eventoid}</td>
                <td>{new Date(reserva.fecha_hora).toLocaleString()}</td>
                <td>{reserva.aprobacion}</td>
                <td className="acciones">
                  <button className="editar">Editar</button>
                  <button className="eliminar" onClick={() => handleEliminar(reserva.id)}>Eliminar</button>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={!!reserva.estado}
                      onChange={() => toggleEstado(reserva.id, reserva.estado)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reservas;
