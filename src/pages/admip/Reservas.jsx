import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Reservas.css";

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      setCargando(true);

      // Obtener el token desde localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No se encontró el token. El usuario no está autenticado.");
        setMensaje("No estás autenticado. Inicia sesión nuevamente.");
        setCargando(false);
        return;
      }

      const response = await axios.get(
        "https://popnocturna.vercel.app/api/reservas?con_relaciones=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Respuesta del backend:", response.data);

      const data = response.data?.datos?.rows || [];
      setReservas(data);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar reservas", error);
      setMensaje("Error al cargar las reservas. Por favor, inténtalo de nuevo.");
      setTimeout(() => setMensaje(""), 3000);
      setCargando(false);
    }
  };

  const mostrarDetalles = (reserva) => {
    setReservaSeleccionada({ ...reserva });
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No se encontró el token para cambiar estado.");
        return;
      }

      await axios.patch(
        `https://popnocturna.vercel.app/api/reserva/estado/${id}`,
        {
          estado: nuevoEstado,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReservas(
        reservas.map((reserva) =>
          reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado de la reserva", error);
    }
  };

  const reservasFiltradas = reservas.filter((reserva) =>
    (reserva.aprobacion || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="reservas-box">
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      <div className="card-reservas">
        <h2>Reservas</h2>

        <div className="buscador-container">
          <input
            type="text"
            placeholder="Buscar por aprobación..."
            value={busqueda}
            onChange={handleBusqueda}
            className="buscador-reservas"
          />
        </div>

        {cargando ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando reservas...</p>
          </div>
        ) : reservas.length === 0 ? (
          <p className="loading-text">No hay reservas disponibles</p>
        ) : (
          <table className="reservas-tabla">
            <thead>
              <tr>
                <th>Nombre del usuario</th>
                <th>Nombre del evento</th>
                <th>Fecha</th>
                <th>Aprobación</th>
                <th>Acciones</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((reserva) => (
                <tr key={reserva.id} className="reserva-item">
                  <td>{reserva.usuario?.nombre || "No disponible"}</td>
                  <td>{reserva.evento?.nombre || "No disponible"}</td>
                  <td>
                    {reserva.fecha_hora
                      ? new Date(reserva.fecha_hora).toLocaleString()
                      : "No disponible"}
                  </td>
                  <td>{reserva.aprobacion || "No disponible"}</td>
                  <td className="acciones">
                    <button
                      className="detalles"
                      onClick={() => mostrarDetalles(reserva)}
                    >
                      Detalles
                    </button>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!!reserva.estado}
                        onChange={() =>
                          toggleEstado(reserva.id, reserva.estado)
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <div className="estado-texto">
                      {reserva.estado ? "Activo" : "Inactivo"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {reservaSeleccionada && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Detalles de la Reserva</h3>
            <p>
              <strong>ID:</strong> {reservaSeleccionada.id}
            </p>
            <p>
              <strong>Usuario:</strong>{" "}
              {reservaSeleccionada.usuario?.nombre ||
                reservaSeleccionada.usuario?.correo ||
                "No disponible"}
            </p>
            <p>
              <strong>Correo Usuario:</strong>{" "}
              {reservaSeleccionada.usuario?.correo || "No disponible"}
            </p>
            <p>
              <strong>Evento:</strong>{" "}
              {reservaSeleccionada.evento?.nombre ||
                reservaSeleccionada.evento?.descripcion ||
                "No disponible"}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(reservaSeleccionada.fecha_hora).toLocaleString()}
            </p>
            <p>
              <strong>Aprobación:</strong> {reservaSeleccionada.aprobacion}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {reservaSeleccionada.estado ? "Activo" : "Inactivo"}
            </p>
            <button
              className="cerrar-modal"
              onClick={() => setReservaSeleccionada(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservas;
