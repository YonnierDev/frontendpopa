import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import { useNavigate } from 'react-router-dom';
import './Comentarios.css';
import Sidebar from '../../components/Sidebar';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState({
    usuarioid: '',
    eventoid: '',
    contenido: '',
    fecha_hora: new Date().toISOString()
  });
  const [comentarioEditar, setComentarioEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      const response = await api.get("/comentarios"); // ← este endpoint debe apuntar al que devuelve relaciones
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al cargar los comentarios:", error);
      setMensaje('Error al cargar los comentarios');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comentarioEditar) {
        await api.put(`/comentario/${comentarioEditar.id}`, nuevoComentario);
        setMensaje('Comentario actualizado exitosamente');
      } else {
        await api.post("/comentario", nuevoComentario);
        setMensaje('Comentario creado exitosamente');
      }

      setNuevoComentario({
        usuarioid: '',
        eventoid: '',
        contenido: '',
        fecha_hora: new Date().toISOString()
      });

      setComentarioEditar(null);
      cargarComentarios();
    } catch (error) {
      console.error("Error al procesar el comentario:", error);
      setMensaje('Error al procesar el comentario');
    }
  };

  const handleEditar = (comentario) => {
    setComentarioEditar(comentario);
    setNuevoComentario({
      usuarioid: comentario.usuarioid,
      eventoid: comentario.eventoid,
      contenido: comentario.contenido,
      fecha_hora: comentario.fecha_hora
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este comentario?')) {
      try {
        await api.delete(`/comentario/${id}`);
        setMensaje('Comentario eliminado exitosamente');
        cargarComentarios();
      } catch (error) {
        console.error("Error al eliminar el comentario:", error);
        setMensaje('Error al eliminar el comentario');
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Comentarios de Popayán Nocturna</h2>

          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="number"
                value={nuevoComentario.usuarioid}
                onChange={(e) =>
                  setNuevoComentario({ ...nuevoComentario, usuarioid: e.target.value })
                }
                placeholder="ID Usuario"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                value={nuevoComentario.eventoid}
                onChange={(e) =>
                  setNuevoComentario({ ...nuevoComentario, eventoid: e.target.value })
                }
                placeholder="ID Evento"
                required
              />
            </div>

            <textarea
              value={nuevoComentario.contenido}
              onChange={(e) =>
                setNuevoComentario({ ...nuevoComentario, contenido: e.target.value })
              }
              placeholder="Escribe tu comentario aquí..."
              required
            />

            <button type="submit" className="btn-crear">
              {comentarioEditar ? 'Actualizar' : 'Crear'} Comentario
            </button>
          </form>

          <div className="items-list">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="item-card">
                <div className="item-header">
                  <span>👤 {comentario.usuario?.nombre || `Usuario ID ${comentario.usuarioid}`}</span>
                  <span>🎉 {comentario.evento?.nombre || `Evento ID ${comentario.eventoid}`}</span>
                  <span>📅 {new Date(comentario.fecha_hora).toLocaleString()}</span>
                </div>
                <div className="item-content">
                  <p>{comentario.contenido}</p>
                </div>
                <div className="item-footer">
                  <div className="item-actions">
                    <button onClick={() => handleEditar(comentario)}>Editar</button>
                    <button onClick={() => handleEliminar(comentario.id)}>Eliminar</button>
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

export default Comentarios;
