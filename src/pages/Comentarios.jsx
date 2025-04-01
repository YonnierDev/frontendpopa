import React, { useState, useEffect } from 'react';
import { api } from "./api/api";
import { useNavigate } from 'react-router-dom';
import './Comentarios.css';

const Comentarios = () => {
  // Datos locales temporales
  const comentariosIniciales = [
    {
      id: 1,
      id_user: 1,
      id_evento: 1,
      contenido: "¡Excelente lugar! Lo recomiendo.",
      fecha_hora: new Date().toISOString()
    },
    {
      id: 2,
      id_user: 2,
      id_evento: 1,
      contenido: "Muy buen servicio y ambiente agradable.",
      fecha_hora: new Date().toISOString()
    }
  ];

  const [comentarios, setComentarios] = useState(comentariosIniciales);
  const [nuevoComentario, setNuevoComentario] = useState({
    id_user: '',
    id_evento: '',
    contenido: ''
  });
  const [comentarioEditar, setComentarioEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comentarioEditar) {
        // Actualización local
        setComentarios(comentarios.map(com => 
          com.id === comentarioEditar.id ? { 
            ...com, 
            ...nuevoComentario,
            fecha_hora: new Date().toISOString() 
          } : com
        ));
        setMensaje('Comentario actualizado exitosamente');
      } else {
        // Creación local
        const nuevoComentarioCompleto = {
          ...nuevoComentario,
          id: comentarios.length + 1,
          fecha_hora: new Date().toISOString()
        };
        setComentarios([...comentarios, nuevoComentarioCompleto]);
        setMensaje('Comentario creado exitosamente');
      }
      setNuevoComentario({
        id_user: '',
        id_evento: '',
        contenido: ''
      });
      setComentarioEditar(null);
    } catch (error) {
      setMensaje('Error al procesar el comentario');
      console.error("Error:", error);
    }
  };

  const handleEditar = (comentario) => {
    setComentarioEditar(comentario);
    setNuevoComentario({
      id_user: comentario.id_user,
      id_evento: comentario.id_evento,
      contenido: comentario.contenido
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este comentario?')) {
      try {
        // Eliminación local
        setComentarios(comentarios.filter(com => com.id !== id));
        setMensaje('Comentario eliminado exitosamente');
      } catch (error) {
        setMensaje('Error al eliminar el comentario');
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="comentarios-container">
      <div className="page-header">
        <h2>Gestión de Comentarios</h2>
        <div className="navigation-buttons">
          <button 
            className="nav-button"
            onClick={() => navigate('/eventos')}
          >
            <span className="icon">📅</span>
            <span className="text">Ver Eventos</span>
          </button>
        </div>
      </div>
      
      <div className="content-section">
        {mensaje && <div className="mensaje">{mensaje}</div>}

        <form onSubmit={handleSubmit} className="comentario-form">
          <input
            type="number"
            value={nuevoComentario.id_user}
            onChange={(e) => setNuevoComentario({...nuevoComentario, id_user: e.target.value})}
            placeholder="ID Usuario"
            required
          />
          <input
            type="number"
            value={nuevoComentario.id_evento}
            onChange={(e) => setNuevoComentario({...nuevoComentario, id_evento: e.target.value})}
            placeholder="ID Evento"
            required
          />
          <textarea
            value={nuevoComentario.contenido}
            onChange={(e) => setNuevoComentario({...nuevoComentario, contenido: e.target.value})}
            placeholder="Escribe tu comentario aquí..."
            required
          />
          <button type="submit">
            {comentarioEditar ? 'Actualizar' : 'Crear'} Comentario
          </button>
        </form>

        <div className="comentarios-lista">
          {comentarios.map((comentario) => (
            <div key={comentario.id} className="comentario-item">
              <div className="comentario-info">
                <div className="comentario-header">
                  <span className="usuario-id">👤 Usuario #{comentario.id_user}</span>
                  <span className="fecha">{new Date(comentario.fecha_hora).toLocaleString()}</span>
                </div>
                <p className="contenido">{comentario.contenido}</p>
                <span className="evento-id">📅 Evento #{comentario.id_evento}</span>
              </div>
              <div className="comentario-botones">
                <button onClick={() => handleEditar(comentario)}>Editar</button>
                <button onClick={() => handleEliminar(comentario.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comentarios; 