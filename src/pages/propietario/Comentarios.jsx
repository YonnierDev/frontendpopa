import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api"; 
import { useNavigate } from 'react-router-dom';
import './Comentarios.css';
import Sidebar from '../../components/Sidebar';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState({
    usuarioid: '',
    contenido: '',
    fecha_hora: new Date().toISOString(),
    estado: true
  });
  const [comentarioEditar, setComentarioEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      const response = await api.get("/comentarios");
      console.log('Comentarios cargados:', response.data);
      setComentarios(response.data);
    } catch (error) {
      console.error("Error detallado:", error.response || error);
      setMensaje('Error al cargar los comentarios: ' + (error.response?.data?.message || error.message));
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
        contenido: '',
        fecha_hora: new Date().toISOString(),
        estado: true
      });
      setComentarioEditar(null);
      cargarComentarios();
    } catch (error) {
      setMensaje('Error al procesar el comentario');
      console.error("Error:", error);
    }
  };

  const handleEditar = (comentario) => {
    setComentarioEditar(comentario);
    setNuevoComentario({
      usuarioid: comentario.usuarioid,
      contenido: comentario.contenido,
      fecha_hora: comentario.fecha_hora,
      estado: comentario.estado
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este comentario?')) {
      try {
        await api.delete(`/comentario/${id}`);
        setMensaje('Comentario eliminado exitosamente');
        cargarComentarios();
      } catch (error) {
        setMensaje('Error al eliminar el comentario');
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="header">
          <button className="cerrar-sesion" onClick={() => navigate('/login')}>
            Cerrar sesión
          </button>
        </div>

        <div className="main-content">
          <h2>Comentarios de Popayán Nocturna</h2>
          
          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="number"
                value={nuevoComentario.usuarioid}
                onChange={(e) => setNuevoComentario({...nuevoComentario, usuarioid: e.target.value})}
                placeholder="ID Usuario"
                required
              />
            </div>
            <textarea
              value={nuevoComentario.contenido}
              onChange={(e) => setNuevoComentario({...nuevoComentario, contenido: e.target.value})}
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
                  <span>Usuario #{comentario.usuarioid}</span>
                  <span>{new Date(comentario.fecha_hora).toLocaleString()}</span>
                </div>
                <div className="item-content">
                  <p>{comentario.contenido}</p>
                </div>
                <div className="item-footer">
                  <span>Estado: {comentario.estado ? 'Activo' : 'Inactivo'}</span>
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
