import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Calificaciones.css";

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [calificacionSeleccionada, setCalificacionSeleccionada] = useState(null);

  useEffect(() => {
    fetchCalificaciones();
  }, []);

  const fetchCalificaciones = async () => {
    try {
      const token = localStorage.getItem("token"); // o donde guardes el token

      const response = await axios.get(
        "https://popnocturna.vercel.app/api/calificaciones",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Respuesta del backend:", response.data);
      const data = response.data?.datos?.calificaciones || [];
      setCalificaciones(data);
    } catch (error) {
      console.error("Error al cargar calificaciones:", error);
      setMensaje("No se pudieron cargar las calificaciones");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `https://popnocturna.vercel.app/api/calificacion/estado/${id}`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCalificaciones(prev =>
        prev.map(calificacion =>
          calificacion.id === id ? { ...calificacion, estado: nuevoEstado } : calificacion
        )
      );

      setMensaje(`Estado de la calificación actualizado a ${nuevoEstado ? "Activo" : "Inactivo"}`);
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al cambiar estado de la calificación:", error);

      if (error.response?.status === 403) {
        setMensaje("Solo los administradores pueden cambiar el estado de las calificaciones");
      } else if (error.response?.status === 404) {
        setMensaje("Calificación no encontrada");
      } else {
        setMensaje("Error al cambiar el estado de la calificación");
      }

      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const handleDetalles = (calificacion) => {
    setCalificacionSeleccionada(calificacion);
  };

  const cerrarModal = () => {
    setCalificacionSeleccionada(null);
  };

  const calificacionesFiltradas = calificaciones.filter(c =>
    (c.usuarioid || '').toString().includes(busqueda)
  );

  return (
    <div className="calificaciones-box">
      <h2>Calificaciones</h2>

      <div className="buscador-container">
        <input
          type="text"
          placeholder="Buscar por ID de usuario..."
          value={busqueda}
          onChange={handleBusqueda}
          className="buscador-calificaciones"
        />
      </div>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      {calificaciones.length === 0 ? (
        <p className="loading-text">No hay calificaciones disponibles</p>
      ) : (
        <table className="calificaciones-tabla">
          <thead>
            <tr>
              <th>ID Usuario</th>
              <th>ID Evento</th>
              <th>Calificación</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {calificacionesFiltradas.map(c => (
              <tr key={c.id} className="calificacion-item">
                <td>{c.usuario?.nombre || c.usuario?.correo || "No disponible"}</td>
                <td>{c.evento?.nombre || c.evento?.descripcion || "No disponible"}</td>
                <td>{c.puntuacion || "No disponible"}</td>
                <td className="acciones">
                  <button className="detalles" onClick={() => handleDetalles(c)}>Detalles</button>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={c.estado}
                      onChange={() => toggleEstado(c.id, c.estado)}
                    />
                    <span className="slider"></span>
                  </label>
                  <div className="estado-texto">
                    {c.estado ? "Activo" : "Inactivo"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {calificacionSeleccionada && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Detalles de la Calificación</h3>
            <p><strong>ID:</strong> {calificacionSeleccionada.id}</p>
            <p><strong>Usuario:</strong> {calificacionSeleccionada.usuario?.nombre || calificacionSeleccionada.usuario?.correo || "No disponible"}</p>
            <p><strong>Correo Usuario:</strong> {calificacionSeleccionada.usuario?.correo || "No disponible"}</p>
            <p><strong>Evento:</strong> {calificacionSeleccionada.evento?.nombre || calificacionSeleccionada.evento?.descripcion || "No disponible"}</p>
            <p><strong>Calificación:</strong> {calificacionSeleccionada.puntuacion || "No disponible"}</p>
            <p><strong>Estado:</strong> {calificacionSeleccionada.estado ? "Activo" : "Inactivo"}</p>
            <p><strong>Fecha:</strong> {calificacionSeleccionada.fecha ? new Date(calificacionSeleccionada.fecha).toLocaleString() : "No disponible"}</p>
            <button className="cerrar-modal" onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calificaciones;
