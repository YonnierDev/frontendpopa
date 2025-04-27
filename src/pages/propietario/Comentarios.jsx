import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { FaComment, FaReply, FaTrash } from 'react-icons/fa';
=======
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Comentarios.css';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
<<<<<<< HEAD
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

=======
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState('');

  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      setCargando(true);
      const { data } = await api.get('/comentarios');
      setComentarios(data.comentarios || []);
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
      toast.error('Error al cargar los comentarios');
    } finally {
      setCargando(false);
    }
  };

  const abrirModalReporte = (comentario) => {
    setComentarioSeleccionado(comentario);
    setMotivoReporte('');
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setComentarioSeleccionado(null);
  };

  const enviarReporte = async () => {
    if (!motivoReporte.trim()) {
      return toast.error('Escribe un motivo para el reporte');
    }
    try {
      await api.post(`/comentario/${comentarioSeleccionado.id}/reportar`, {
        motivo: motivoReporte,
      });
      toast.success('Reporte enviado');
      cerrarModal();
      cargarComentarios();
    } catch (err) {
      console.error('Error al enviar el reporte – detalles del servidor:', err.response?.data);
      toast.error(err.response?.data?.mensaje || 'Error al enviar el reporte');
    }
  };

  const renderBadge = (tipo, valor) => {
    let clases = 'badge ';
    switch (tipo) {
      case 'estado':
        clases += valor ? 'bg-success' : 'bg-secondary';
        return <span className={clases}>{valor ? 'Activo' : 'Inactivo'}</span>;
      case 'reportado':
        clases += valor ? 'bg-danger' : 'bg-success';
        return <span className={clases}>{valor ? 'Reportado' : 'Sin Reportes'}</span>;
      default:
        return null;
    }
  };

>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content-container">
        <h1>Comentarios</h1>
<<<<<<< HEAD

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
=======
        {cargando ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre de Usuario</th>
                  <th>Nombre de Evento</th>
                  <th>Nombre de Lugar</th>
                  <th>Contenido del Comentario</th>
                  <th>Fecha y Hora</th>
                  <th>Estado</th>
                  <th>Estado de Reportes</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comentarios.length === 0 && (
                  <tr>
                    <td colSpan="8" className="sin-datos">
                      No hay comentarios disponibles.
                    </td>
                  </tr>
                )}
                {comentarios.map((c) => (
                  <tr key={c.id}>
                    <td>{c.usuario?.nombre || '—'}</td>
                    <td>{c.evento?.nombre || '—'}</td>
                    <td>{c.lugar?.nombre || c.evento?.lugar?.nombre || '—'}</td>
                    <td>{c.contenido}</td>
                    <td>{new Date(c.fecha_hora).toLocaleString()}</td>
                    <td>{renderBadge('estado', c.estado)}</td>
                    <td>{renderBadge('reportado', c.motivo_reporte)}</td>
                    <td>
                      {c.motivo_reporte ? (
                        <button className="btn btn-sm btn-warning" disabled>
                          Reportado
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => abrirModalReporte(c)}
                        >
                          Reportar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Reporte */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reportar Comentario</h5>
                  <button type="button" className="btn-close" onClick={cerrarModal} />
                </div>
                <div className="modal-body">
                  <p>{comentarioSeleccionado.contenido}</p>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={motivoReporte}
                    onChange={(e) => setMotivoReporte(e.target.value)}
                    placeholder="Motivo del reporte"
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={cerrarModal}>
                    Cancelar
                  </button>
                  <button className="btn btn-warning" onClick={enviarReporte}>
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571

        <ToastContainer />
      </div>
    </div>
  );
};

export default Comentarios;
