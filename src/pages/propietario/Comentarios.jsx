import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Comentarios.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFlag, FaTimes, FaArrowLeft } from 'react-icons/fa';  // Eliminados los íconos de estrellas

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
      const response = await api.get(`/api/comentarios/evento/${id}`);
      
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
      await api.post(`/api/comentario/${comentarioSeleccionado.id}/reportar`, {
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

  // Función para renderizar las estrellas de calificación (deshabilitada)
  const renderEstrellas = () => {
    return null; // No mostrar estrellas
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
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2">Cargando comentarios...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="mb-2">
              <i className="bi bi-chat-square-quote-fill me-2 text-primary"></i>
              Comentarios
            </h1>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb" className="me-3">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/propietario/dashboard" className="text-decoration-none">Inicio</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">Comentarios</li>
                </ol>
              </nav>
              {comentarios.length > 0 && (
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  {comentarios.length} {comentarios.length === 1 ? 'comentario' : 'comentarios'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="comments-container">
          {comentarios.length > 0 ? (
            <div className="row g-4">
              {comentarios.map((comentario) => (
                <div key={comentario.id} className="col-12 mb-4">
                  <div className="comment-card">
                    <div className="card h-100 border-0">
                      <div className="card-body p-4">
                        {/* Header del comentario */}
                        <div className="d-flex align-items-start mb-3">
                          <div 
                            className="avatar bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                            style={{ width: '48px', height: '48px', fontSize: '1.1rem', fontWeight: '600' }}
                          >
                            {getIniciales(comentario.usuario?.nombre || 'U')}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="card-title mb-0 fw-semibold">
                                  {comentario.usuario?.nombre || 'Usuario anónimo'}
                                </h5>
                                <p className="text-muted small mb-0">
                                  {formatearFecha(comentario.fecha)}
                                </p>
                              </div>
                              <div className="d-flex align-items-center">
                                {/* Sección de calificación eliminada */}
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className="card-text">{comentario.contenido}</p>
                            </div>
                            
                            <div className="mt-3 d-flex justify-content-end">
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => abrirModalReporte(comentario)}
                              >
                                <FaFlag className="me-1" />
                                Reportar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 my-5 w-100">
              <div className="mb-3">
                <i className="bi bi-chat-square-text" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              </div>
              <h4 className="text-muted">No hay comentarios aún</h4>
              <p className="text-muted">Este lugar no tiene comentarios. Los comentarios aparecerán aquí cuando los usuarios los dejen.</p>
            </div>
          )}
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
                    />
                  </div>
                  
                  <div className="alert alert-info small mb-0">
                    <i className="bi bi-info-circle me-1"></i>
                    Tu reporte será revisado por nuestro equipo de moderación.
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
