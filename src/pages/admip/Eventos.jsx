import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Eventos.css";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMensaje("No se encontró token. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await axios.get("https://popnocturna.vercel.app/api/eventos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data?.datos || [];
      setEventos(data);
    } catch (error) {
      console.error("Error al cargar eventos", error);
      setMensaje("Error al cargar eventos. Por favor, inicia sesión.");
      setTimeout(() => setMensaje(""), 3000);
      setEventos([]);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const mostrarDetalles = async (evento) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMensaje("No se encontró token. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await axios.get(
        `https://popnocturna.vercel.app/api/evento/${evento.id}?con_relaciones=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.datos;

      const comentarios = data.comentarios?.map(comentario => ({
        id: comentario.id,
        usuario: {
          id: comentario.usuario?.id,
          nombre: comentario.usuario?.nombre,
          correo: comentario.usuario?.correo,
        },
        contenido: comentario.contenido,
        fecha: comentario.fecha,
      })) || [];

      const calificaciones = data.calificaciones?.map(calificacion => ({
        id: calificacion.id,
        usuario: {
          id: calificacion.usuario?.id,
          nombre: calificacion.usuario?.nombre,
          correo: calificacion.usuario?.correo,
        },
        puntuacion: calificacion.puntuacion,
        comentario: calificacion.comentario,
        fecha: calificacion.fecha,
      })) || [];

      const eventoDetalles = {
        id: data.id,
        nombre: data.nombre || data.descripcion,
        lugar: data.lugar?.nombre || data.lugar?.descripcion || "No disponible",
        propietario: data.lugar?.usuario?.nombre || data.lugar?.usuario?.correo || "No disponible",
        capacidad: data.capacidad,
        precio: data.precio,
        fecha_hora: data.fecha_hora,
        estado: data.estado,
        comentarios: comentarios,
        calificaciones: calificaciones,
      };

      setEventoSeleccionado(eventoDetalles);
    } catch (error) {
      console.error("Error al obtener detalles del evento", error);
      setMensaje("Error al obtener los detalles del evento");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const cambiarEstadoEvento = async (id, estadoActual) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMensaje("No se encontró token. Por favor, inicia sesión.");
      return;
    }

    try {
      const nuevoEstado = !estadoActual;
      await axios.patch(
        `https://popnocturna.vercel.app/api/evento/estado/${id}`,
        { estado: nuevoEstado },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEventos(prev =>
        prev.map(evento =>
          evento.id === id ? { ...evento, estado: nuevoEstado } : evento
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado", error);
    }
  };

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };

  return (
    <div className="eventos-contenedor">
      <div className="tabla-container">
        <h3>Lista de Eventos</h3>
        {mensaje && (
          <div className="mensaje" style={{ color: 'red', marginBottom: '1rem' }}>
            {mensaje}
          </div>
        )}
        <input
          type="text"
          placeholder="Buscar evento..."
          value={busqueda}
          onChange={handleBusqueda}
          className="buscador-eventos"
        />
        <table className="eventos-tabla">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Lugar</th>
              <th>Propietario</th>
              <th>Capacidad</th>
              <th>Precio</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos
              .filter((evento) =>
                evento.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
              )
              .map((evento) => (
                <tr key={evento.id} className="evento-item">
                  <td>{evento.descripcion}</td>
                  <td>{evento.lugar?.nombre || "No disponible"}</td>
                  <td>{evento.lugar?.usuario?.nombre || "No disponible"}</td>
                  <td>{evento.capacidad}</td>
                  <td>${evento.precio}</td>
                  <td>{new Date(evento.fecha_hora).toLocaleString()}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={evento.estado}
                        onChange={() => cambiarEstadoEvento(evento.id, evento.estado)}
                      />
                      <span className="slider"></span>
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        {evento.estado ? "Activo" : "Inactivo"}
                      </div>
                    </label>
                  </td>
                  <td className="acciones">
                    <button className="detalles" onClick={() => mostrarDetalles(evento)}>
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {eventoSeleccionado && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Detalles del Evento</h3>
            <p><strong>ID:</strong> {eventoSeleccionado.id}</p>
            <p><strong>Nombre:</strong> {eventoSeleccionado.nombre}</p>
            <p><strong>Lugar:</strong> {eventoSeleccionado.lugar}</p>
            <p><strong>Propietario:</strong> {eventoSeleccionado.propietario}</p>
            <p><strong>Capacidad:</strong> {eventoSeleccionado.capacidad}</p>
            <p><strong>Precio:</strong> ${eventoSeleccionado.precio}</p>
            <p><strong>Fecha:</strong> {new Date(eventoSeleccionado.fecha_hora).toLocaleString()}</p>
            <p><strong>Estado:</strong> {eventoSeleccionado.estado ? "Activo" : "Inactivo"}</p>

            <div className="seccion-detalle">
              <h4>Comentarios ({eventoSeleccionado.comentarios?.length || 0})</h4>
              {eventoSeleccionado.comentarios?.length > 0 ? (
                <div className="comentarios-container">
                  {eventoSeleccionado.comentarios.map((comentario) => (
                    <div key={comentario.id} className="comentario">
                      <div className="comentario-header">
                        <strong>{comentario.usuario?.nombre || "Anónimo"}</strong>
                        <span className="fecha-comentario">
                          {new Date(comentario.fecha).toLocaleString()}
                        </span>
                      </div>
                      <p className="comentario-texto">
                        {comentario.contenido}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="sin-comentarios">No hay comentarios.</p>
              )}
            </div>

            <div className="seccion-detalle">
              <h4>Calificaciones ({eventoSeleccionado.calificaciones?.length || 0})</h4>
              {eventoSeleccionado.calificaciones?.length > 0 ? (
                <div className="calificaciones-container">
                  {eventoSeleccionado.calificaciones.map((calificacion) => (
                    <div key={calificacion.id} className="calificacion">
                      <div className="calificacion-header">
                        <strong>{calificacion.usuario?.nombre || "Anónimo"}</strong>
                        <span className="fecha-calificacion">
                          {new Date(calificacion.fecha).toLocaleString()}
                        </span>
                      </div>
                      <div className="calificacion-info">
                        <span className="puntuacion">
                          <strong>Puntuación:</strong> {calificacion.puntuacion}
                        </span>
                        {calificacion.comentario && (
                          <p className="comentario-calificacion">
                            {calificacion.comentario}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="sin-calificaciones">No hay calificaciones.</p>
              )}
            </div>

            <button
              className="cerrar-modal"
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                marginTop: '20px',
                width: '100%',
              }}
              onClick={cerrarModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eventos;
