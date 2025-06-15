import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Comentarios.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaFlag, FaTimes, FaArrowLeft } from 'react-icons/fa';

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

  // Función para obtener el primer lugar del propietario
  const obtenerPrimerLugar = async () => {
    try {
      const response = await api.get('/propietario/lugares');
      if (response.data && response.data.length > 0) {
        const primerLugar = response.data[0];
        return primerLugar.id;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener los lugares del propietario:', error);
      return null;
    }
  };

  useEffect(() => {
    const verificarSesionYCargar = async () => {
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
      
      // Verificar si estamos en el cliente
      if (typeof window === 'undefined') return;
      
      // Verificar autenticación
      if (!token || !usuario) {
        console.log('No hay sesión activa, redirigiendo a login');
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        toast.error('Por favor inicia sesión para continuar');
        navigate('/login', { replace: true });
        return;
      }

      // Si no hay id, intentar obtener el primer lugar del propietario
      if (!id) {
        const primerLugarId = await obtenerPrimerLugar();
        if (primerLugarId) {
          // Redirigir a la ruta con el ID del primer lugar
          navigate(`/propietario/comentarios/${primerLugarId}`, { replace: true });
        } else {
          // Si no hay lugares, mostrar mensaje y redirigir al dashboard
          toast.error('No tienes lugares registrados');
          navigate('/propietario/dashboard');
        }
        return;
      }

      // Si llegamos aquí, tenemos un id válido
      try {
        await cargarComentarios();
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Manejar errores de autenticación
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login', { replace: true });
        } else {
          setError('Error al cargar los comentarios. Por favor, inténtalo de nuevo.');
        }
      } finally {
        setCargando(false);
      }
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
  const renderEstrellas = (puntuacion) => {
    const estrellas = [];
    const puntuacionRedondeada = Math.round(puntuacion * 2) / 2; // Redondear al medio punto más cercano
    
    for (let i = 1; i <= 5; i++) {
      if (i <= puntuacionRedondeada) {
        estrellas.push(<FaStar key={i} className="star-icon filled" />);
      } else if (i - 0.5 === puntuacionRedondeada) {
        estrellas.push(<FaStarHalfAlt key={i} className="star-icon filled" />);
      } else {
        estrellas.push(<FaRegStar key={i} className="star-icon" />);
      }
    }
    
    return (
      <div className="rating-stars">
        {estrellas}
        <span className="rating-text">({puntuacion.toFixed(1)})</span>
      </div>
    );
  };
  
  // Función para obtener las iniciales del nombre
  const getIniciales = (nombre) => {
    if (!nombre) return '??';
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (cargando) {
    return (
      <div className="dashboard">
        <Sidebar lugarId={id} />
        <div className="content-container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando comentarios...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Sidebar lugarId={id} />
        <div className="content-container p-4">
          <div className="alert alert-danger">
            <h5 className="alert-heading">Error</h5>
            <p className="mb-0">{error}</p>
            {error.includes('sesión') && (
              <div className="mt-3">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/login'}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Ir al inicio de sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="content-container p-4">
          <div className="card shadow-sm">
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <i className="bi bi-chat-square-text text-muted" style={{ fontSize: '4rem' }}></i>
              </div>
              <h4 className="mb-3">Selecciona un evento</h4>
              <p className="text-muted mb-4">Para ver los comentarios, por favor selecciona un evento de la lista.</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver atrás
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar lugarId={id} />
      <div className="content-container p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-1">Comentarios</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/propietario/dashboard" className="text-decoration-none">Inicio</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Comentarios</li>
              </ol>
            </nav>
          </div>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/propietario/dashboard')}
          >
            <FaArrowLeft className="me-2" />
            Volver al inicio
          </button>
        </div>
        
        <div className="row g-4">
          {/* Sidebar de estadísticas */}
          <div className="col-md-4 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-4">Resumen de Comentarios</h5>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3">
                    <i className="bi bi-chat-square-text fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Total de comentarios</h6>
                    <p className="text-muted mb-0">{comentarios.length}</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-circle bg-success bg-opacity-10 text-success p-3 rounded-circle me-3">
                    <i className="bi bi-check-circle fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Aprobados</h6>
                    <p className="text-muted mb-0">
                      {comentarios.filter(c => c.estado === 'aprobado').length}
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div className="icon-circle bg-warning bg-opacity-10 text-warning p-3 rounded-circle me-3">
                    <i className="bi bi-exclamation-triangle fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-0">Pendientes</h6>
                    <p className="text-muted mb-0">
                      {comentarios.filter(c => c.estado === 'pendiente').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de comentarios */}
          <div className="col-md-8 col-lg-9">
            {comentarios.length > 0 ? (
              <div className="row g-4">
                {comentarios.map((comentario) => (
                  <div key={comentario.id} className="col-12">
                    <div className={`card shadow-sm h-100 border-${comentario.estado === 'aprobado' ? 'success' : comentario.estado === 'pendiente' ? 'warning' : 'danger'}`}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style={{ width: '48px', height: '48px' }}>
                              {getIniciales(comentario.usuario?.nombre || '??')}
                            </div>
                            <div>
                              <h5 className="card-title mb-0">{comentario.usuario?.nombre || 'Usuario anónimo'}</h5>
                              <small className="text-muted">
                                {new Date(comentario.fecha).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </small>
                            </div>
                          </div>
                          <span className={`badge bg-${comentario.estado === 'aprobado' ? 'success' : comentario.estado === 'pendiente' ? 'warning' : 'danger'} text-capitalize`}>
                            {comentario.estado}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          {comentario.puntuacion && renderEstrellas(comentario.puntuacion)}
                        </div>
                        
                        <p className="card-text">{comentario.contenido}</p>
                        
                        {comentario.evento?.nombre && (
                          <div className="mt-2">
                            <span className="badge bg-info bg-opacity-10 text-info">
                              <i className="bi bi-calendar-event me-1"></i>
                              {comentario.evento.nombre}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end">
                        {comentario.estado !== 'rechazado' && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              setComentarioSeleccionado(comentario);
                              setShowModal(true);
                            }}
                          >
                            <FaFlag className="me-1" />
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
        </div>

        {/* Modal de Reporte */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-light">
                  <h5 className="modal-title d-flex align-items-center">
                    <FaFlag className="text-danger me-2" />
                    Reportar Comentario
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setComentarioSeleccionado(null);
                      setMotivoReporte('');
                      setMensaje('');
                    }}
                    aria-label="Cerrar"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-light">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar bg-light text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          {comentarioSeleccionado?.usuario?.nombre ? getIniciales(comentarioSeleccionado.usuario.nombre) : '??'}
                        </div>
                      </div>
                      <div>
                        <p className="mb-1">
                          <strong>{comentarioSeleccionado?.usuario?.nombre || 'Usuario anónimo'}</strong>
                        </p>
                        <p className="text-muted small mb-0">
                          {comentarioSeleccionado?.contenido}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted mb-4">
                    ¿Por qué deseas reportar este comentario? Por favor selecciona un motivo.
                  </p>
                  
                  <div className="mb-4">
                    <label htmlFor="motivo" className="form-label fw-medium">Motivo del reporte</label>
                    <select
                      className="form-select"
                      id="motivo"
                      value={motivoReporte}
                      onChange={(e) => setMotivoReporte(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un motivo</option>
                      <option value="contenido_inapropiado">Contenido inapropiado</option>
                      <option value="lenguaje_ofensivo">Lenguaje ofensivo o irrespetuoso</option>
                      <option value="spam">Spam o publicidad no deseada</option>
                      <option value="informacion_falsa">Información falsa o engañosa</option>
                      <option value="otro">Otro motivo</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="mensaje" className="form-label fw-medium">
                      Explicación adicional <span className="text-muted">(opcional)</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="mensaje"
                      rows={3}
                      placeholder="Proporciona más detalles sobre el problema..."
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                    ></textarea>
                    <div className="form-text">
                      Tu reporte será revisado por nuestro equipo de moderación.
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer bg-light border-top-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setComentarioSeleccionado(null);
                      setMotivoReporte('');
                      setMensaje('');
                    }}
                  >
                    <FaTimes className="me-1" /> Cancelar
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={enviarReporte}
                    disabled={!motivoReporte}
                  >
                    <FaFlag className="me-1" /> Enviar reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ marginTop: '60px' }}
      />
    </div>
  );
};

export default Comentarios;
