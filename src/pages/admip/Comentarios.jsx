import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Comentarios.css";

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [mensajesEstado, setMensajesEstado] = useState({});

  useEffect(() => {
    fetchComentarios();
  }, []);

  const fetchComentarios = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const response = await axios.get("https://popnocturna.vercel.app/api/comentarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComentarios(response.data.comentarios);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      await axios.patch(`https://popnocturna.vercel.app/api/comentario/estado/${id}`, {
        activo: nuevoEstado,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComentarios(comentarios.map(c =>
        c.id === id ? { ...c, estado: nuevoEstado } : c
      ));

      setMensajesEstado(prev => ({
        ...prev,
        [id]: nuevoEstado ? "Activo" : "Inactivo"
      }));
    } catch (error) {
      console.error("Error al cambiar estado del comentario:", error);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const comentariosFiltrados = comentarios.filter(c =>
    c.usuario?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="comentarios-box">
      <div className="card-comentarios">
        <h2>Comentarios</h2>
        <input
          type="text"
          placeholder="Buscar por nombre de usuario..."
          value={busqueda}
          onChange={handleBusqueda}
          className="buscador-comentarios"
        />

        <table className="comentarios-tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Contenido</th>
              <th>Fecha</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {comentariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5">No hay comentarios disponibles.</td>
              </tr>
            ) : (
              comentariosFiltrados.map((c) => (
                <tr key={c.id} className="comentario-item">
                  <td>{c.usuario?.nombre}</td>
                  <td>{c.contenido}</td>
                  <td>{new Date(c.fecha_hora).toLocaleString()}</td>
                  <td>
                    <button
                      className="ver-detalles"
                      onClick={() => setComentarioSeleccionado(c)}
                    >
                      Detalles
                    </button>
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
                    {mensajesEstado[c.id] && <span>{mensajesEstado[c.id]}</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para mostrar detalles del comentario */}
      {comentarioSeleccionado && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Detalles del Comentario</h3>
            <p><strong>Contenido:</strong> {comentarioSeleccionado.contenido}</p>
            <p><strong>Usuario:</strong> {comentarioSeleccionado.usuario?.nombre}</p>
            <p><strong>Evento:</strong> {comentarioSeleccionado.eventoid}</p>
            <p><strong>Fecha:</strong> {new Date(comentarioSeleccionado.fecha_hora).toLocaleString()}</p>
            <p><strong>Estado:</strong> {comentarioSeleccionado.estado ? "Activo" : "Inactivo"}</p>
            <p><strong>Aprobación:</strong> {comentarioSeleccionado.aprobacion ? "Aprobado" : "No Aprobado"}</p>
            <p><strong>Motivo de Reporte:</strong> {comentarioSeleccionado.motivo_reporte || "N/A"}</p>
            <button onClick={() => setComentarioSeleccionado(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comentarios;
