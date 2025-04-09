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
      const { data } = await axios.get("https://popnocturna.vercel.app/api/calificaciones");
      if (!Array.isArray(data)) throw new Error("La API no devolvió un array");
      setCalificaciones(data);
    } catch (error) {
      console.error("Error al cargar calificaciones:", error);
      setMensaje("No se pudieron cargar las calificaciones");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta calificación?")) return;

    try {
      await axios.delete(`https://popnocturna.vercel.app/api/calificacion/${id}`);
      setCalificaciones(prev => prev.filter(c => c.id !== id));
      setMensaje("Calificación eliminada exitosamente");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al eliminar calificación:", error);
      setMensaje("No se pudo eliminar la calificación");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;

    try {
      await axios.put(`https://popnocturna.vercel.app/api/calificacion/${id}/estado`, {
        estado: nuevoEstado,
      });

      setCalificaciones(prev =>
        prev.map(c => (c.id === id ? { ...c, estado: nuevoEstado } : c))
      );
    } catch (error) {
      console.error("Error al cambiar estado de la calificación:", error);
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
    c.usuarioid.toString().includes(busqueda)
  );

  return (
    <div className="calificaciones-box">
      <h2>Calificaciones</h2>

      <input
        type="text"
        placeholder="Buscar por ID de usuario..."
        value={busqueda}
        onChange={handleBusqueda}
        className="buscador-calificaciones"
      />

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      {calificaciones.length === 0 ? (
        <p className="loading-text">Cargando...</p>
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
                <td>{c.usuarioid}</td>
                <td>{c.eventoid}</td>
                <td>{c.puntuacion}</td>
                <td className="acciones">
                  <button className="detalles" onClick={() => handleDetalles(c)}>Detalles</button>
                  <button className="editar">Editar</button>
                  <button className="eliminar" onClick={() => handleEliminar(c.id)}>Eliminar</button>
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
            <p><strong>ID Usuario:</strong> {calificacionSeleccionada.usuarioid}</p>
            <p><strong>ID Evento:</strong> {calificacionSeleccionada.eventoid}</p>
            <p><strong>Calificación:</strong> {calificacionSeleccionada.puntuacion}</p>
            <button className="cerrar-modal" onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calificaciones;
