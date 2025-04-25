import React, { useState, useEffect } from 'react';
import { FaComment, FaReply, FaTrash } from 'react-icons/fa';
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Comentarios.css';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = 'https://popnocturna.vercel.app/api';

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await api.get('/comentarios', {
          headers: {
            'Authorization': `Bearer ${usuario.token}`
          }
        });

        if (!response.data.success) {
          throw new Error('Error al cargar los comentarios');
        }

        setComentarios(response.data.comentarios);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComentarios();
  }, [usuario.token]);

  const handleResponder = async (comentarioId) => {
    if (!respuesta.trim()) return;

    try {
      const response = await api.post(`/comentario/${comentarioId}/responder`, {
        respuesta: respuesta
      });

      if (!response.data.success) {
        throw new Error('Error al responder el comentario');
      }

      setComentarios(comentarios.map(comentario => 
        comentario.id === comentarioId 
          ? { ...comentario, respuesta: response.data.respuesta }
          : comentario
      ));
      setRespuesta('');
      setComentarioSeleccionado(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEliminar = async (comentarioId) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      const response = await api.delete(`/comentario/${comentarioId}`);

      if (!response.data.success) {
        throw new Error('Error al eliminar el comentario');
      }

      setComentarios(comentarios.filter(comentario => comentario.id !== comentarioId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content-container">
        <h1>Comentarios</h1>

        <div className="comentarios-grid">
          {comentarios.map(comentario => (
            <div key={comentario.id} className="comentario-card">
              <div className="comentario-header">
                <FaComment className="icon" />
                <span className="usuario">{comentario.usuario_nombre}</span>
                <span className="fecha">
                  {new Date(comentario.fecha).toLocaleDateString()}
                </span>
              </div>

              <div className="comentario-content">
                <p>{comentario.contenido}</p>
              </div>

              {comentario.respuesta && (
                <div className="respuesta">
                  <FaReply className="icon" />
                  <p>{comentario.respuesta}</p>
                </div>
              )}

              <div className="comentario-actions">
                {!comentario.respuesta && (
                  <>
                    {comentarioSeleccionado === comentario.id ? (
                      <div className="respuesta-form">
                        <textarea
                          value={respuesta}
                          onChange={(e) => setRespuesta(e.target.value)}
                          placeholder="Escribe tu respuesta..."
                        />
                        <button onClick={() => handleResponder(comentario.id)}>
                          Enviar Respuesta
                        </button>
                        <button onClick={() => {
                          setComentarioSeleccionado(null);
                          setRespuesta('');
                        }}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setComentarioSeleccionado(comentario.id)}>
                        <FaReply /> Responder
                      </button>
                    )}
                  </>
                )}
                <button 
                  onClick={() => handleEliminar(comentario.id)}
                  className="btn-eliminar"
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Comentarios;
