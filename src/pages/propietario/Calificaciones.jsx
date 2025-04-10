import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";      
import { useNavigate } from 'react-router-dom';
import './Calificaciones.css';
import Sidebar from '../../components/Sidebar';

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [eventos, setEventos] = useState([]); // para mostrar en el select
  const [nuevaCalificacion, setNuevaCalificacion] = useState({
    usuarioid: '',
    eventoid: '',
    puntuacion: '',
    comentario: '',
    fecha: new Date().toISOString()
  });
  const [calificacionEditar, setCalificacionEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarCalificaciones();
    cargarEventos(); // nueva función
  }, []);

  const cargarCalificaciones = async () => {
    try {
      const response = await api.get("/calificaciones");
      setCalificaciones(response.data);
    } catch (error) {
      console.error("Error detallado:", error.response || error);
      setMensaje('Error al cargar las calificaciones: ' + (error.response?.data?.message || error.message));
    }
  };

  const cargarEventos = async () => {
    try {
      const response = await api.get("/eventos"); // asegúrate que esta ruta exista
      setEventos(response.data);
    } catch (error) {
      console.error("Error al cargar eventos:", error.response || error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (calificacionEditar) {
        await api.put(`/calificacion/${calificacionEditar.id}`, nuevaCalificacion);
        setMensaje('Calificación actualizada exitosamente');
      } else {
        await api.post("/calificacion", nuevaCalificacion);
        setMensaje('Calificación creada exitosamente');
      }
      setNuevaCalificacion({
        usuarioid: '',
        eventoid: '',
        puntuacion: '',
        comentario: '',
        fecha: new Date().toISOString()
      });
      setCalificacionEditar(null);
      cargarCalificaciones();
    } catch (error) {
      setMensaje('Error al procesar la calificación');
      console.error("Error:", error);
    }
  };

  const handleEditar = (calificacion) => {
    setCalificacionEditar(calificacion);
    setNuevaCalificacion({
      usuarioid: calificacion.usuarioid,
      eventoid: calificacion.eventoid,
      puntuacion: calificacion.puntuacion,
      comentario: calificacion.comentario,
      fecha: calificacion.fecha
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta calificación?')) {
      try {
        await api.delete(`/calificacion/${id}`);
        setMensaje('Calificación eliminada exitosamente');
        cargarCalificaciones();
      } catch (error) {
        setMensaje('Error al eliminar la calificación');
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Calificaciones de Popayán Nocturna</h2>
          
          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="number"
                value={nuevaCalificacion.usuarioid}
                onChange={(e) => setNuevaCalificacion({...nuevaCalificacion, usuarioid: e.target.value})}
                placeholder="ID Usuario"
                required
              />
              <select
                value={nuevaCalificacion.eventoid}
                onChange={(e) => setNuevaCalificacion({...nuevaCalificacion, eventoid: e.target.value})}
                required
              >
                <option value="">Seleccione un evento</option>
                {eventos.map(evento => (
                  <option key={evento.id} value={evento.id}>
                    {evento.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={nuevaCalificacion.puntuacion}
                onChange={(e) => setNuevaCalificacion({...nuevaCalificacion, puntuacion: e.target.value})}
                placeholder="Puntuación (1-5)"
                min="1"
                max="5"
                required
              />
            </div>
            <textarea
              value={nuevaCalificacion.comentario}
              onChange={(e) => setNuevaCalificacion({...nuevaCalificacion, comentario: e.target.value})}
              placeholder="Comentario de la calificación..."
              required
            />
            <button type="submit" className="btn-crear">
              {calificacionEditar ? 'Actualizar' : 'Crear'} Calificación
            </button>
          </form>

          <div className="items-list">
            {calificaciones.map((calificacion) => (
              <div key={calificacion.id} className="item-card">
                <div className="item-header">
                  <span>Usuario #{calificacion.usuarioid}</span>
                  <span>⭐ {calificacion.puntuacion}/5</span>
                </div>
                <div className="item-content">
                  <p>{calificacion.comentario}</p>
                </div>
                <div className="item-footer">
                  <span>{new Date(calificacion.fecha).toLocaleDateString()}</span>
                  <div className="item-actions">
                    <button onClick={() => handleEditar(calificacion)}>Editar</button>
                    <button onClick={() => handleEliminar(calificacion.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calificaciones;
