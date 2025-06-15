import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Comentarios.css';
import { useParams, useNavigate } from 'react-router-dom';

const Comentarios = () => {
  const { id } = useParams();
  const [comentarios, setComentarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verificarSesionYCargar = async () => {
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
      
      // Verificar si estamos en el cliente
      if (typeof window === 'undefined') return;
      
      // Verificar autenticación
      if (!token || !usuario) {
        console.log('No hay sesión activa, redirigiendo a login');
        // Guardar la ruta actual para redirigir después del login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        toast.error('Por favor inicia sesión para continuar');
        navigate('/login', { replace: true });
        return;
      }

      if (!id) {
        console.log('No se proporcionó ID de evento');
        setCargando(false);
        return;
      }

      // Cargar comentarios
      await cargarComentarios();
    };

    verificarSesionYCargar();
  }, [id, navigate]);

  const cargarComentarios = async () => {
    try {
      setCargando(true);
      setError('');
      
      // Obtener los comentarios del evento
      const response = await api.get(`/comentarios/evento/${id}`);
      
      if (response.data && response.data.comentarios) {
        // Formatear los comentarios con valores por defecto
        const comentariosFormateados = response.data.comentarios.map(comentario => ({
          ...comentario,
          usuario: comentario.usuario || { nombre: 'Usuario anónimo', correo: '' },
          lugar: comentario.evento?.lugar || { id: 0, nombre: 'Lugar no disponible' },
          evento: {
            id: comentario.eventoid,
            nombre: comentario.evento?.nombre || 'Evento sin nombre',
            fecha_hora: comentario.evento?.fecha_hora || new Date().toISOString()
          },
          fecha: comentario.fecha_hora || new Date().toISOString(),
          estado: comentario.estado ? 'activo' : 'inactivo',
          contenido: comentario.contenido || 'Sin contenido',
          id: comentario.id
        }));
        
        setComentarios(comentariosFormateados);
      } else {
        console.log('No hay comentarios para este evento');
        setComentarios([]);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setComentarios([]);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('La sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError('Error al cargar los comentarios. Por favor, inténtalo de nuevo.');
      }
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

  // Función para formatear la fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  // Función para renderizar las estrellas de calificación
  const renderEstrellas = (calificacion) => {
    return (
      <div className="d-flex">
        {[1, 2, 3, 4, 5].map((estrella) => (
          <i
            key={estrella}
            className={`bi ${estrella <= calificacion ? 'bi-star-fill text-warning' : 'bi-star'} me-1`}
          ></i>
        ))}
      </div>
    );
  };

  if (cargando) {
    return (
      <div className="comentarios-container">
        <Sidebar />
        <div className="comentarios-content text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando comentarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comentarios-container">
        <Sidebar />
        <div className="comentarios-content">
          <div className="error-message">{error}</div>
          {error.includes('sesión') && (
            <div className="mt-3 text-center">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/login'}
              >
                Ir al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="comentarios-container">
        <Sidebar />
        <div className="comentarios-content">
          <div className="info-message">
            <p>Selecciona un evento para ver sus comentarios</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => window.history.back()}
            >
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="comentarios-container">
      <Sidebar />
      <div className="content-container p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Comentarios del Lugar</h1>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/propietario/dashboard')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver a Lugares
          </button>
        </div>
        
        {cargando ? (
          <div className="text-center my-5 py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando comentarios...</p>
          </div>
        ) : (
          <div className="comentarios-list">
            {comentarios.length > 0 ? (
              <div className="row g-4">
                {comentarios.map((comentario) => (
                  <div key={comentario.id} className="col-12">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                              <i className="bi bi-person fs-4"></i>
                            </div>
                            <div>
                              <h5 className="card-title mb-0">{comentario.usuario?.nombre || 'Usuario anónimo'}</h5>
                              <small className="text-muted">
                                {formatearFecha(comentario.fecha)}
                              </small>
                            </div>
                          </div>
                          {comentario.estado === 'reportado' && (
                            <span className="badge bg-danger">Reportado</span>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          {renderEstrellas(comentario.calificacion || 0)}
                        </div>
                        
                        <p className="card-text">{comentario.contenido}</p>
                        
                        {comentario.evento?.nombre && (
                          <div className="mt-2">
                            <span className="badge bg-info text-dark">
                              <i className="bi bi-calendar-event me-1"></i>
                              {comentario.evento.nombre}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end">
                        {comentario.estado !== 'reportado' && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => abrirModalReporte(comentario)}
                          >
                            <i className="bi bi-flag me-1"></i>
                            Reportar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 my-5">
                <div className="mb-3">
                  <i className="bi bi-chat-square-text" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                </div>
                <h4 className="text-muted">No hay comentarios aún</h4>
                <p className="text-muted">Este lugar no tiene comentarios. Los comentarios aparecerán aquí cuando los usuarios los dejen.</p>
              </div>
            )}
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

        <ToastContainer />
      </div>
    </div>
  );
};

export default Comentarios;
